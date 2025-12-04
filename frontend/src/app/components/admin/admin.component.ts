import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  toys: any[] = [];
  message: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadToys();
  }

 loadToys() {
  this.adminService.getToys().subscribe({
    next: (res) => {
      this.toys = res.data; // ili res.user.toys, zavisi od backend odgovora
    },
    error: (err) => console.error('Greška pri učitavanju igračaka', err)
  });
}


  deleteToy(id: string): void {
    if(confirm('Da li ste sigurni da želite da obrišete ovu igračku?')) {
      this.adminService.deleteToy(id).subscribe({
        next: () => {
          this.message = '✔ Igračka obrisana!';
          this.loadToys();
        },
        error: (err) => {
          this.message = '❌ Greška pri brisanju!';
          console.error(err);
        }
      });
    }
  }
}
