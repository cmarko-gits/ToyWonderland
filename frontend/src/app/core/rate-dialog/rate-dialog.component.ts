import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rate-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./rate-dialog.component.html`,
  styleUrls: ['./rate-dialog.component.css']
})
export class RateDialogComponent {
  rating = 0;
  comment = '';
  commentTouched = false; 

  constructor(
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { toyId: string, reviewed: boolean }
  ) {}

  setRating(stars: number) {
    this.rating = stars;
  }

  submit() {
    this.commentTouched = true;

    if (!this.comment.trim()) {
      return;
    }

    const ratingToSend = this.data.reviewed ? 0 : this.rating;

    this.reservationService.rateToy(this.data.toyId, ratingToSend, this.comment)
      .subscribe({
        next: () => {
          this.dialogRef.close({ 
            rating: ratingToSend, 
            comment: this.comment 
          });
        },
        error: err => {
          console.error('Greška:', err);
          alert(err.error?.message || 'Error submitting review');
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}