import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ToyService {

  constructor(private api: ApiService) {}

  // 🔹 GET all toys with filters
  getToys(filters: any = {}): Observable<any> {
    return this.api.get<any>('toys', false, filters);
  }

  // 🔹 GET toy by ID
  getToyById(id: string): Observable<any> {
    return this.api.get<any>(`toys/${id}`);
  }

  // 🔹 Add TOY to cart (requires authentication)
  addToCart(toyId: string, quantity: number = 1): Observable<any> {
    return this.api.post<any>('cart/add', { toyId, quantity });
  }
}
