import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserFormValues } from '../../model/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  showMessage: boolean = false;

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
      this.showPopup('Please fill in all required fields correctly.');
      return;
    }

    const userData: UserFormValues = this.loginForm.value;

    this.authService.login(userData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.showPopup('Login successful!');
        this.router.navigate(['/']); // ili neka glavna stranica
      },
      error: (err) => {
        this.showPopup(err.error.msg || 'Login failed. Try again.');
      }
    });
  }

  showPopup(msg: string) {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000); // popup nestaje nakon 3 sekunde
  }
}
