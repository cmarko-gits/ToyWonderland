import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserFormValues } from '../../model/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';
  showPopup: boolean = false;
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showMessage('Please fill in all required fields correctly.', false);
      return;
    }

    const userData: UserFormValues = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.showMessage(res.msg || 'Registration successful!', true);

        if (res.token) {
          // Sačuvaj token
          localStorage.setItem('token', res.token);

          // Odmah učitaj korisnika i updateuj AuthService
          this.authService.getCurrentUser().subscribe({
            next: (userRes) => {
              // Header će automatski prikazati ime i admin status
              console.log('User logged in after registration:', userRes.user);
              setTimeout(() => this.router.navigate(['/']), 500); // idi na Home
            },
            error: (err) => {
              console.error('Greška pri dohvatanju korisnika posle registracije', err);
              setTimeout(() => this.router.navigate(['/login']), 500);
            }
          });
        }
      },
      error: (err) => {
        const errorMsg = err?.error?.msg || 'Registration failed. Try again.';
        this.showMessage(errorMsg, false);
        console.error(err);
      }
    });
  }

  private showMessage(msg: string, isSuccess: boolean) {
    this.message = msg;
    this.success = isSuccess;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 2000);
  }
}
