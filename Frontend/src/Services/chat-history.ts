import { Injectable } from '@angular/core';

export interface ChatMessage {
  role: string;
  text: string;
  chart?: any;
  chartId?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatHistoryService {
  private messages: ChatMessage[] = [];

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  addMessage(msg: ChatMessage): void {
    this.messages.push(msg);
  }

  clear(): void {
    this.messages = [];
  }
}
