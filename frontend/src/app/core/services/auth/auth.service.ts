import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserFormValues, User } from '../../../model/user.model';
interface LoginResponse {
  msg: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService, private router: Router) {
    // inicijalizuj korisnika ako postoji token
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.apiService.get<{ user: User }>('auth/me', true).subscribe({
        next: res => this.currentUserSubject.next(res.user),
        error: () => this.logout()
      });
    }
  }

  login(userData: UserFormValues): Observable<User> {
    return this.apiService.post<User>('auth/login', userData).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res); // odmah postavi korisnika
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // nema localStorage na serveru
  }
  return localStorage.getItem('token');
}


 isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;
  return !this.jwtHelper.isTokenExpired(token);
}


    register(userData: UserFormValues): Observable<{ msg: string; token?: string; user?: User }> {
    return this.apiService.post<{ msg: string; token?: string; user?: User }>('auth/register', userData).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res.user || null);
        }
      })
    );
  }

  // ⬅ javna metoda za dohvat trenutnog korisnika
  getCurrentUser(): Observable<{ user: User }> {
    return this.apiService.get<{ user: User }>('auth/me', true).pipe(
      tap(res => this.currentUserSubject.next(res.user))
    );
  }
}
