import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: any = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    oldPassword: '',
    newPassword: ''
  };

  loading: boolean = false;
  statusMessage: string = '';
  isError: boolean = false;
  private sub = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.userData.fullName = user.fullName;
          this.userData.email = user.email;
          this.userData.phone = user.phone || '';
          this.userData.address = user.address || '';
        }
      })
    );
  }

  onUpdate(): void {
    this.loading = true;
    this.statusMessage = '';
    
    // We send the whole object. Backend will check if oldPassword is provided if needed.
    this.authService.updateProfile(this.userData).subscribe({
      next: (res) => {
        this.loading = false;
        this.isError = false;
        this.statusMessage = 'Profile updated successfully!';
        this.userData.oldPassword = '';
        this.userData.newPassword = '';
      },
      error: (err) => {
        this.loading = false;
        this.isError = true;
        // Display the specific error message from your Node.js backend (e.g., "Current password is incorrect")
        this.statusMessage = err.error?.msg || 'Failed to update profile.';
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}