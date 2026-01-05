import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../api/api.service';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { UserFormValues, User } from '../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const token = this.getToken();
      const savedUser = localStorage.getItem('user');

      if (token && !this.jwtHelper.isTokenExpired(token)) {
        if (savedUser) {
          this.currentUserSubject.next(JSON.parse(savedUser));
        }

        this.apiService.get<{ user: User }>('auth/me', true).subscribe({
          next: res => {
            localStorage.setItem('user', JSON.stringify(res.user));
            this.currentUserSubject.next(res.user);
          },
          error: () => this.logout()
        });
      }
    }
  }

  login(userData: UserFormValues): Observable<any> {
    return this.apiService.post<any>('auth/login', userData).pipe(
      tap(res => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.currentUserSubject.next(res.user);
      })
    );
  }

  register(userData: UserFormValues): Observable<any> {
    return this.apiService.post<any>('auth/register', userData).pipe(
      tap(res => {
        if (res.token && this.isBrowser) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

 updateProfile(userData: Partial<User>): Observable<{ msg: string; user: User }> {
  return this.apiService.put<{ msg: string; user: User }>('auth/update-profile', userData, true).pipe(
    tap(res => {
      if (this.isBrowser) {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
        window.location.reload();
      }
    })
  );
}

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.apiService.get<{ user: User }>('auth/me', true).pipe(
      tap(res => {
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.currentUserSubject.next(res.user);
      })
    );
  }
}