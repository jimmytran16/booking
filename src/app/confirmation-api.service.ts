import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface TokenResponse {
  accessToken: string;
  success: boolean;
}

export interface AppointmentResponse {
  success: boolean;
  unavailables: string[]
}

export interface ServiceResponse {
  success: boolean;
  services: Service[];
}

export interface AppointmentData {
  worker: string;
  services: string[];
  time: string;
  name: string;
  number: string;
  date: string;
}

export interface Service {
  _id: any;
  category: string;
  cost: number;
  name: string;
  required_time: number;
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

  getServices(): Observable<Service[]> {
    return this.http.get<ServiceResponse>('http://localhost:5000/getServices')
      .pipe(map(response => response.services))
  }

  appointmentSubmit(data: AppointmentData): Observable<any> {
    return this.http.post('http://localhost:5000/appointmentSubmission', data);
  } 

  getUnavailabilities(date: string, staff: string, requestedTime: number): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(`http://localhost:5000/getUnavailabilities`, { date: date, staff: staff, requested_time: requestedTime});
  } 
}
