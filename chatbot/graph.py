from typing import TypedDict, Optional, Any
from langgraph.graph import StateGraph, END
from agents import guardrails_agent, sql_agent, error_agent, analysis_agent, viz_agent
from db import execute_sql


class AgentState(TypedDict):
    question: str
    user_role: str
    user_id: Optional[int]
    history: list
    sql_query: str
    query_result: Optional[Any]
    error: Optional[str]
    final_answer: str
    visualization_code: Optional[dict]
    is_in_scope: Optional[bool]
    iteration_count: int


def run_guardrails(state: AgentState) -> AgentState:
    result = guardrails_agent(state["question"], state.get("history", []))
    return {
        **state,
        "is_in_scope": result.get("in_scope", True),
        "final_answer": result.get("message", "")
    }

def run_sql(state: AgentState) -> AgentState:
    sql = sql_agent(state["question"], state["user_role"], state["user_id"], state["history"])
    if sql.startswith("ACCESS_DENIED:"):
        return {
            **state,
            "sql_query": "",
            "final_answer": sql.replace("ACCESS_DENIED: ", ""),
            "is_in_scope": False
        }
    return {**state, "sql_query": sql, "error": None}

def run_execute(state: AgentState) -> AgentState:
    try:
        rows = execute_sql(state["sql_query"])
        return {**state, "query_result": rows, "error": None}
    except Exception as e:
        return {**state, "error": str(e), "query_result": None}

def run_error(state: AgentState) -> AgentState:
    fixed = error_agent(state["sql_query"], state["error"])
    return {
        **state,
        "sql_query": fixed,
        "iteration_count": state["iteration_count"] + 1
    }

def run_analysis(state: AgentState) -> AgentState:
    answer = analysis_agent(state["question"], state["query_result"], state["history"])
    return {**state, "final_answer": answer}

def run_viz(state: AgentState) -> AgentState:
    chart = viz_agent(
        state["question"],
        state["query_result"],
        state.get("final_answer", "")
    )
    return {**state, "visualization_code": chart}
    
def run_give_up(state: AgentState) -> AgentState:
    return {
        **state,
        "final_answer": "I wasn't able to generate a valid query for that question. Could you try rephrasing it?",
        "visualization_code": None
    }


def route_after_guardrails(state: AgentState) -> str:
    return "sql" if state["is_in_scope"] else END

def route_after_sql(state: AgentState) -> str:
    if not state["sql_query"]:
        return END
    return "execute"

def route_after_execute(state: AgentState) -> str:
    if state["error"]:
        return "error" if state["iteration_count"] < 3 else "give_up"
    return "analysis"


def build_graph():
    g = StateGraph(AgentState)

    g.add_node("guardrails", run_guardrails)
    g.add_node("sql",        run_sql)
    g.add_node("execute",    run_execute)
    g.add_node("error",      run_error)
    g.add_node("analysis",   run_analysis)
    g.add_node("viz",        run_viz)
    g.add_node("give_up",    run_give_up)

    g.set_entry_point("guardrails")

    g.add_conditional_edges("guardrails", route_after_guardrails,
        {"sql": "sql", END: END})

    g.add_conditional_edges("sql", route_after_sql,
        {"execute": "execute", END: END})

    g.add_conditional_edges("execute", route_after_execute,
        {"error": "error", "analysis": "analysis", "give_up": "give_up"})

    g.add_edge("error", "execute")
    g.add_edge("analysis", "viz")
    g.add_edge("viz", END)
    g.add_edge("give_up", END)

    return g.compile()