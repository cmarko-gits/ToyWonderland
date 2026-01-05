import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Reservation } from '../../../model/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

  getAdmin(): Observable<any> {
    return this.api.get('admin/profile', true);
  }

  getToys(): Observable<any> {
    return this.api.get('admin/toys', true);
  }

  addToy(data: any): Observable<any> {
    return this.api.post('admin/toys', data, true);
  }

  deleteToy(id: string): Observable<any> {
    return this.api.delete(`admin/toys/${id}`, true);
  }

  updateToy(id: string, data: any): Observable<any> {
    return this.api.put(`admin/toys/${id}`, data, true);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>('admin/reservations', true);
  }

  updateReservationStatus(reservationId: string, status: 'reserved' | 'arrived' | 'canceled') {
    return this.api.put(`reservations/update/${reservationId}`, { status }, true);
  }
}