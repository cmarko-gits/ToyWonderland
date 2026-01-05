import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) {}

  private setAuthHeaders(authRequired: boolean): HttpHeaders {
    let headers = new HttpHeaders();
    if (authRequired && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  get<T>(endpoint: string, authRequired: boolean = false, params?: any): Observable<T> {
    const headers = this.setAuthHeaders(authRequired);
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers, params });
  }

  post<T>(url: string, body: any, authRequired: boolean = false): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, {
      headers: this.setAuthHeaders(authRequired)
    });
  }

  put<T>(url: string, body: any, authRequired: boolean = false): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url}`, body, {
      headers: this.setAuthHeaders(authRequired)
    });
  }

  delete<T>(url: string, authRequired: boolean = false): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.setAuthHeaders(authRequired)
    });
  }
}