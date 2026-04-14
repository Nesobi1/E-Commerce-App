import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {


  constructor(private http: HttpClient){}

  sendMessage(message: string): Observable<any> {
    return this.http.post(
    'http://localhost:8080/api/chat',
    { message },
    { responseType: 'text' }
  );
  }

}
