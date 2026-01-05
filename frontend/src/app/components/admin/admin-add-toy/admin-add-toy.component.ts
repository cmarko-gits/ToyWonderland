import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';

@Component({
  selector: 'app-admin-add-toy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-toy.component.html',
  styleUrls: ['./admin-add-toy.component.css']
})
export class AdminAddToyComponent implements OnInit {
  isEditMode = false;
  toyId: string | null = null;
  loading = false;

  newToy: any = {
    name: '',
    description: '',
    type: 'puzzle',
    ageGroup: '3+',
    targetGroup: 'svi',
    productionDate: '',
    price: 0,
    image: '',
    inStock: 0
  };

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toyId = this.route.snapshot.paramMap.get('id');
    if (this.toyId) {
      this.isEditMode = true;
      this.loadToyData();
    } else {
      this.newToy.productionDate = new Date().toISOString().split('T')[0];
    }
  }

  loadToyData(): void {
    this.loading = true;
    this.adminService.getToys().subscribe({
      next: (res) => {
        const toy = res.toys.find((t: any) => t._id === this.toyId);
        if (toy) {
          this.newToy = {
            ...toy,
            productionDate: toy.productionDate ? new Date(toy.productionDate).toISOString().split('T')[0] : ''
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit(): void {
    const action = this.isEditMode && this.toyId
      ? this.adminService.updateToy(this.toyId, this.newToy)
      : this.adminService.addToy(this.newToy);

    action.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => alert(err.error?.msg || 'Operation failed')
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}