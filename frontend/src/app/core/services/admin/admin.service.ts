import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private api: ApiService) {}

getAdmin(): Observable<any> {
  return this.api.get('admin/profile', true); // true -> šalje token
}


  getToys(): Observable<any> {
    return this.api.get('admin/toys', true); // token šalje Authorization header
  }

  addToy(data: any): Observable<any> {
    return this.api.post('admin/toys', data);
  }

  deleteToy(id: string): Observable<any> {
    return this.api.delete(`admin/toys/${id}`);
  }

  updateToy(id: string, data: any): Observable<any> {
    return this.api.put(`admin/toys/${id}`, data);
  }
}
