import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { ReservationItem, Reservation } from '../../model/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { RateDialogComponent } from '../../core/rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {

  reservations$: Observable<Reservation[]>;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {
    this.reservations$ = this.reservationService.getMyReservations();
  }

  cancelReservation(reservationId: string) {
    this.reservationService.updateReservation(reservationId, 'canceled')
      .subscribe(() => this.reservations$ = this.reservationService.getMyReservations());
  }

  openRateDialog(item: ReservationItem) {
  const dialogRef = this.dialog.open(RateDialogComponent, {
    width: '400px',
    data: { toyId: item.toy._id, reviewed: !!item.reviewed }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    if (!item.reviewed && result.rating) {
      item.reviewed = true;
    }

    item.toy.reviews = item.toy.reviews || [];
    item.toy.reviews.push(result);
  });
}

}
