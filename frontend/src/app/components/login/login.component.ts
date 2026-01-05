import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserFormValues } from '../../model/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  showMessage: boolean = false;
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showPopup('Please enter valid credentials.', true);
      return;
    }

    this.isLoading = true;
    const userData: UserFormValues = this.loginForm.value;

    this.authService.login(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.showPopup('Welcome back!', false);
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.error?.msg || 'Invalid email or password.';
        this.showPopup(errorMsg, true);
      }
    });
  }

  showPopup(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 4000);
  }
}