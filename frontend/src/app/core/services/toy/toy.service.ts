import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ToyService {

  constructor(private api: ApiService) {}

  getToys(filters: any = {}): Observable<any> {
    return this.api.get<any>('toys', false, filters);
  }

  getToyById(id: string): Observable<any> {
    return this.api.get<any>(`toys/${id}`);
  }

  addToCart(toyId: string, quantity: number = 1): Observable<any> {
    return this.api.post<any>('cart/add', { toyId, quantity });
  }
toggleFavorite(toyId: string) {
  return this.api.post(`toys/${toyId}/favorite`, {} , true);
}
  getFavorites(): Observable<any> {
    return this.api.get<any>('toys/favorites/list', true);
  }
  addReview(toyId: string, rating: number, comment: string): Observable<any> {
    return this.api.post(`toys/${toyId}/review`, { rating, comment }, true);
  }

  
}
