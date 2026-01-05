import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Reservation } from '../../../model/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private api: ApiService) {}

  createReservation(): Observable<any> {
    return this.api.post('reservations/add-reservation', {}, true);
  }

  getMyReservations(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(
      'reservations/my-reservations',
      true
    );
  }

  updateReservation(reservationId: string, status: string): Observable<Reservation> {
    return this.api.put<Reservation>(`reservations/update/${reservationId}`, { status }, true);
  }

  rateToy(toyId: string, rating: number, comment: string): Observable<any> {
    return this.api.post(`toys/${toyId}/review`, { rating, comment }, true);
  }
}