import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  constructor(private http: HttpClient) {}

  sendMessage(
    message: string,
    userRole: string,
    userId: number,
    history: { role: string; text: string }[]
  ): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/chat', {
      message,
      user_role: userRole,
      user_id: userId,
      history: history.slice(-10)
    });
  }
}
