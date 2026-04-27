import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from db import get_schema

load_dotenv()

client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.getenv("GITHUB_TOKEN")
)
SCHEMA = get_schema()

def _call(prompt: str, model: str = "openai/gpt-4o") -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024
    )
    return response.choices[0].message.content.strip()


def guardrails_agent(question: str, history: list = []) -> dict:
    history_text = ""
    if history:
        history_text = "Previous conversation:\n"
        for msg in history[-4:]:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role_label}: {msg['content']}\n"
        history_text += "\n"

    prompt = f"""You are a scope filter for an e-commerce analytics platform.
Respond ONLY with valid JSON. No markdown, no backticks.

{history_text}Rules:
- The question may be in ANY language. Translate it mentally before evaluating scope.
- If the message is a greeting (hi, hello, hey, merhaba, etc.) → {{"in_scope": false, "message": "Hello! I am your e-commerce analytics assistant. Ask me about sales, orders, products, customers, reviews, or shipments!"}}
- If the question is about sales, orders, products, customers, shipments, reviews, revenue, inventory, stores, categories, ratings, spending, payments, competition, pricing → {{"in_scope": true}}
- Follow-up questions referencing previous conversation → {{"in_scope": true}}
- Anything completely unrelated to e-commerce → {{"in_scope": false, "message": "I can only answer questions about e-commerce data such as sales, orders, customers, and products."}}

Question: {question}"""

    raw = _call(prompt)
    clean = raw.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"in_scope": True}


def sql_agent(question: str, user_role: str, user_id: int, history: list) -> str:
    if user_role == "CUSTOMER" and user_id:
        role_note = f"""IMPORTANT: This user is a CUSTOMER (user_id={user_id}).

ALLOWED queries for CUSTOMER:
- Their own orders: WHERE user_id = {user_id} in Orders table
- Their own order items: JOIN through their own order_ids
- Product information (names, prices, categories) - no restriction
- Store information (names, status) - no restriction
- Product reviews and ratings - no restriction
- Category information - no restriction
- Aggregate/statistical questions about the platform - ALLOWED

FORBIDDEN for CUSTOMER:
- Other specific users personal data (email, specific spending of named users)
- Other users order history with personal identifiable information

If the question asks for another specific users personal data, return exactly:
ACCESS_DENIED: You do not have permission to access other users data."""

    elif user_role == "CORPORATE" and user_id:
        role_note = f"""This user is a CORPORATE store owner (user_id={user_id}).
Their store is where owner_id = {user_id} in the Stores table.

ALLOWED for CORPORATE:
- All data from their own store including their products and sales
- Product information platform-wide (names, prices, categories)
- Aggregate platform statistics
- COMPETITION QUERIES: They CAN see which other stores sell products in the same categories as their products. They CAN see competitor product names and prices. They CANNOT see competitor revenue, order counts, or sales figures.

FORBIDDEN for CORPORATE:
- Other stores revenue, grand_total, order counts or any sales metrics
- Other stores customer data

Competition query example - ALLOWED:
SELECT p.name, p.unit_price, s.name as store_name
FROM Products p
JOIN Stores s ON p.store_id = s.id
WHERE p.category_id IN (
    SELECT category_id FROM Products WHERE store_id = (
        SELECT id FROM Stores WHERE owner_id = {user_id}
    )
) AND p.store_id != (SELECT id FROM Stores WHERE owner_id = {user_id})

If forbidden, return exactly:
ACCESS_DENIED: You do not have permission to access data from other stores."""

    else:
        role_note = "This user is an ADMIN. They can access all data across all users and stores with no restrictions."

    history_text = ""
    if history:
        history_text = "Previous conversation:\n"
        for msg in history[-6:]:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role_label}: {msg['content']}\n"
        history_text += "\n"

    prompt = f"""You are a senior MySQL developer for an e-commerce platform.
Database: ecommerce_db

Schema:
{SCHEMA}

{role_note}

{history_text}CRITICAL RULES — follow these exactly:
1. Return ONLY the raw SQL query. No explanation, no markdown, no backticks, no comments.
2. Use only table and column names that exist in the schema above.
3. For revenue calculations use SUM(grand_total) from the Orders table.
4. For date/time filters use MySQL date functions (NOW(), DATE_SUB(), etc.)
5. Payment method values are uppercase: CREDIT_CARD, DEBIT_CARD, PAYPAL.
6. Star ratings in Reviews are integers 1-5.

ORDINAL POSITION RULE — this is critical:
- "1st", "top 1", "highest", "most" → ORDER BY ... DESC LIMIT 1
- "2nd", "second" → ORDER BY ... DESC LIMIT 1 OFFSET 1
- "3rd", "third" → ORDER BY ... DESC LIMIT 1 OFFSET 2
- "4th", "fourth" → ORDER BY ... DESC LIMIT 1 OFFSET 3
- "5th", "fifth" → ORDER BY ... DESC LIMIT 1 OFFSET 4
- "top 3", "top 5", "top N" → ORDER BY ... DESC LIMIT N
- "bottom", "lowest", "least" → ORDER BY ... ASC LIMIT N
- Never confuse "3rd biggest" with "top 3". They are completely different.

HISTORY RULE:
- Use conversation history ONLY for direct follow-up questions about the same topic.
- If the current question is completely new and unrelated to the previous question, IGNORE the history entirely and treat it as a fresh question.
- Never let a previous failed or null result affect a new unrelated query.
- Signs of a new unrelated question: different subject (orders vs stores vs products), no pronouns like "it", "they", "those" referring back.

PERCENTAGE RULE:
- For percentage calculations NEVER use a subquery that might return null.
- Always use this pattern:
  SELECT 
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*) as percentage
  FROM Orders
  WHERE YEAR(order_date) = 2024 AND MONTH(order_date) = 1
- Never divide by zero — wrap with NULLIF(COUNT(*), 0)

SUBQUERY RULE:
- When a question asks to compare X to a platform/overall average, calculate BOTH in a single query using a subquery or CTE.
- Example: "highest category average vs platform average" →
  SELECT 
    c.name as category,
    AVG(o.grand_total) as category_avg,
    (SELECT AVG(grand_total) FROM Orders) as platform_avg
  FROM Orders o
  JOIN Order_Items oi ON o.id = oi.order_id
  JOIN Products p ON oi.product_id = p.id
  JOIN Categories c ON p.category_id = c.id
  GROUP BY c.id, c.name
  ORDER BY category_avg DESC
  LIMIT 1
- Never make the user ask a follow-up to get data that was part of the original question.
- If a question has multiple parts, answer ALL parts in a single SQL query.

SELECTION RULE:
- Always SELECT meaningful columns that answer the question.
- For "who is the biggest/smallest/Nth spender" → SELECT u.username, u.email, SUM(o.grand_total) as total_spent FROM User u JOIN Orders o ON u.id = o.user_id GROUP BY u.id, u.username, u.email ORDER BY total_spent DESC LIMIT 1 OFFSET N
- Never SELECT only an ID or email when the question asks "who is" — always include the name/username and the relevant metric.
- For ranking questions always include both the identifier (name/email) AND the metric being ranked (total, count, average etc.)

DEFAULT LIMIT RULE:
- Unless the question only needs a count or single aggregate, add LIMIT 100.
- Exception: ordinal questions (1st, 2nd, 3rd etc.) use LIMIT 1 OFFSET N as above.

Use conversation history to understand follow-up questions.

Question: {question}"""

    raw = _call(prompt)
    return raw.replace("```sql", "").replace("```", "").strip()


def error_agent(bad_sql: str, error: str) -> str:
    prompt = f"""You are a MySQL error recovery specialist.
Fix the broken SQL query below. Return ONLY the corrected raw SQL. No explanation, no backticks, no markdown.

Error message: {error}

Broken query:
{bad_sql}

Schema for reference:
{SCHEMA}"""

    raw = _call(prompt)
    return raw.replace("```sql", "").replace("```", "").strip()


def analysis_agent(question: str, rows: list, history: list = []) -> str:
    if not rows:
        return "No data was found for your query."

    preview = json.dumps(rows[:20], default=str)

    history_text = ""
    if history:
        history_text = "Previous conversation:\n"
        for msg in history[-4:]:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            history_text += f"{role_label}: {msg['content']}\n"
        history_text += "\n"

    prompt = f"""You are a helpful data analyst for an e-commerce platform.
Answer the question using ONLY the data provided below. Do not add assumptions, do not mention other rankings or data outside what is shown. Do not say there is "limited data" or speculate about what might exist outside the results.

STRICT RULES:
- Use ONLY the rows provided. Nothing else exists.
- Never start with "Based on", "The query results show", "The data shows".
- Never mention SQL, queries, or databases.
- Never speculate or add context not in the data.
- Answer in 1-2 sentences maximum for single-row results.
- Answer in 2-4 sentences for multi-row results.
- Use specific numbers from the data.

{history_text}Question: {question}
Data: {preview}"""

    return _call(prompt)


def viz_agent(question: str, rows: list, analysis: str = "") -> dict | None:
    if not rows:
        return None
    # Don't chart single row results — they are just answers, not comparisons
    if len(rows) == 1:
        return None
    # Don't chart if only one column
    if len(rows[0]) == 1:
        return None

    preview = json.dumps(rows[:50], default=str)

    prompt = f"""You are a data visualization expert.
Given these query results, return a Chart.js version 4 configuration object as valid JSON.
No markdown, no backticks, no explanation. Only raw JSON.

Choose the best chart type:
- "bar" for comparisons (categories, products, top N items)
- "line" for trends over time (monthly, weekly data)
- "pie" or "doughnut" for distributions or percentages

Return exactly null (not "null" string) if:
- Data has only 1 row
- Data is a single number or yes/no answer
- A chart would not add meaningful insight

The JSON must follow this exact structure:
{{
  "type": "bar",
  "data": {{
    "labels": ["Label1", "Label2"],
    "datasets": [{{
      "label": "Dataset name",
      "data": [10, 20],
      "backgroundColor": ["#4F46E5", "#7C3AED", "#2563EB", "#0891B2", "#059669", "#D97706", "#DC2626"]
    }}]
  }},
  "options": {{
    "responsive": true,
    "plugins": {{
      "legend": {{ "position": "top" }},
      "title": {{ "display": true, "text": "Chart title here" }}
    }}
  }}
}}

Question: {question}
Analysis: {analysis}
Data: {preview}"""

    raw = _call(prompt)
    clean = raw.replace("```json", "").replace("```", "").strip()
    if clean == "null":
        return None
    try:
        return json.loads(clean)
    except Exception:
        return None