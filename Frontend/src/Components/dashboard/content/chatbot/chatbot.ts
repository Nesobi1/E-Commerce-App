import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../../../Services/chatbot.service';
import { AuthService } from '../../../../Services/auth';
import { ChatHistoryService, ChatMessage } from '../../../../Services/chat-history';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent implements OnInit {
  messages = signal<ChatMessage[]>([]);
  text = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private chatbotService: ChatbotService,
    private authService: AuthService,
    private chatHistoryService: ChatHistoryService
  ) {}

  ngOnInit() {
    this.messages.set([...this.chatHistoryService.getMessages()]);

    setTimeout(() => {
      this.messages().forEach(msg => {
        if (msg.chart && msg.chartId) {
          this.renderChart(msg.chartId, msg.chart);
        }
      });
    }, 100);
  }

  onSend() {
    const userMsg = this.text;
    if (!userMsg.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: userMsg };
    this.chatHistoryService.addMessage(userMessage);
    this.messages.set([...this.chatHistoryService.getMessages()]);
    this.text = '';

    const userRole = this.authService.getRole();
    const userId = this.authService.getUserId();

    const history = this.chatHistoryService.getMessages()
      .slice(0, -1)
      .map(m => ({ role: m.role, text: m.text }));

    this.chatbotService.sendMessage(userMsg, userRole, userId, history).subscribe({
      next: (response: any) => {
        const chartId = response.chart ? 'chart-' + Date.now() : undefined;
        const aiMessage: ChatMessage = {
          role: 'ai',
          text: response.answer,
          chart: response.chart ?? null,
          chartId
        };

        this.chatHistoryService.addMessage(aiMessage);
        this.messages.set([...this.chatHistoryService.getMessages()]);

        if (response.chart && chartId) {
          setTimeout(() => this.renderChart(chartId, response.chart), 100);
        }

        setTimeout(() => {
          const el = this.messagesContainer?.nativeElement;
          if (el) el.scrollTop = el.scrollHeight;
        }, 0);
      },
      error: () => {
        const errMessage: ChatMessage = {
          role: 'ai',
          text: 'Sorry, something went wrong. Please try again.'
        };
        this.chatHistoryService.addMessage(errMessage);
        this.messages.set([...this.chatHistoryService.getMessages()]);
      }
    });
  }

  renderChart(canvasId: string, config: any) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas && !canvas.dataset['rendered']) {
      canvas.dataset['rendered'] = 'true';
      new Chart(canvas, config);
    }
  }
}
