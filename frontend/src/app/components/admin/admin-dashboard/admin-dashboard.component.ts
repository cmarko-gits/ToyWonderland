import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  toys: any[] = [];
  reservations: any[] = [];
  activeView: 'reservations' | 'inventory' = 'reservations';
  
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'danger' = 'success';
  pendingId: string | null = null;

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.adminService.getToys().subscribe({
      next: (res) => {
        this.toys = res.toys || [];
        this.cdr.detectChanges();
      }
    });

    this.adminService.getAllReservations().subscribe({
      next: (res: any) => {
        this.reservations = res.reservations || [];
        this.cdr.detectChanges();
      }
    });
  }

  onUpdateStatus(id: string, status: 'reserved' | 'arrived' | 'canceled'): void {
    this.adminService.updateReservationStatus(id, status).subscribe({
      next: () => {
        this.loadInitialData();
        this.openModal('Success', `Status updated to ${status}`, 'success');
      },
      error: (err) => this.openModal('Error', err.error?.msg || 'Update failed', 'danger')
    });
  }

  calculateTotal(reservation: any): number {
    return reservation.items.reduce((acc: number, item: any) => 
      acc + (item.toy?.price * item.quantity), 0);
  }

  goToAddToy(): void {
    this.router.navigate(['/admin/add-toy']);
  }

  onEditToy(toy: any): void {
    this.router.navigate(['/admin/edit-toy', toy._id]);
  }

  onDeleteToy(id: string): void {
    this.openModal('Delete Toy', 'Are you sure you want to remove this item?', 'danger', id);
  }

  openModal(title: string, msg: string, type: 'success' | 'danger', id: string | null = null): void {
    this.modalTitle = title;
    this.modalMessage = msg;
    this.modalType = type;
    this.pendingId = id;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.pendingId = null;
    this.cdr.detectChanges();
  }

  confirmAction(): void {
    if (this.pendingId) {
      this.adminService.deleteToy(this.pendingId).subscribe({
        next: () => {
          this.toys = this.toys.filter(t => t._id !== this.pendingId);
          this.closeModal();
          this.openModal('Deleted', 'Item removed successfully', 'success');
          this.cdr.detectChanges();
        },
        error: () => {
          this.closeModal();
          this.openModal('Error', 'Could not delete item', 'danger');
        }
      });
    }
  }
}