import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../../../Services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent {
  messages = signal<{role: string, text: string}[]>([]);
  text = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService){}

  onSend() {
    const userMsg = this.text;
    this.messages.set([...this.messages(), { role: 'user', text: userMsg }]);
    this.text = '';

    this.chatbotService.sendMessage(userMsg).subscribe({
      next: (response) => {
        console.log(response);
        this.messages.set([...this.messages(), { role: 'ai', text: response }]);
      }
    });

    setTimeout(() => {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }



}
