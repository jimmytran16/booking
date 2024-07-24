import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface TokenResponse {
  accessToken: string;
  success: boolean;
}

export interface AppointmentData {
  worker: string;
  services: string[];
  time: string;
  name: string;
  number: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationApiService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<string> {
    return this.http.get<any>('http://localhost:5000/getToken?apiKey=')
      .pipe(map(response => response.accessToken))
  }

  appointmentSubmit(data: AppointmentData): Observable<any> {
    return this.http.post('http://localhost:5000/appointmentSubmission', data);
  } 
}
