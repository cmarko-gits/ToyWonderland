import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToyService } from '../../core/services/toy/toy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-toy-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './toy-list.component.html',
  styleUrls: ['./toy-list.component.css']
})
export class ToyListComponent implements OnInit, OnDestroy {

  toys: any[] = [];
  loading = false;

  // Filters
  search: string = '';
  selectedCategory: string = '';
  selectedAgeGroup: string = '';
  selectedTargetGroup: string = '';
  inStockOnly: boolean = false;
  sortOption: string = '';

  minPrice?: number;
  maxPrice?: number;

  // Pagination
  page = 1;
  limit = 12;
  totalPages = 1;

  categories = ["puzzle", "picture book", "figure", "character", "vehicles", "pleated", "other"];
  ageGroups = ["0-2", "3-5", "6-8", "9-12", "12+"];
  targetGroups = ["devojčica", "dečak", "svi"];

  private filterChanged = new Subject<void>();
  private filterSub!: Subscription;

  constructor(private toyService: ToyService, private cdr: ChangeDetectorRef,private cartService:CartService) {}

  ngOnInit(): void {
    // 🔹 Initial load odmah
    this.getToys();

    // 🔹 Subscribe to filter changes with debounce
    this.filterSub = this.filterChanged.pipe(debounceTime(300)).subscribe(() => {
      this.page = 1; // reset page
      this.getToys();
    });
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  // 🔹 Fetch toys
  getToys(): void {
    this.loading = true;

    const filters: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.search?.trim()) filters.search = this.search;
    if (this.selectedCategory?.trim()) filters.category = this.selectedCategory;
    if (this.selectedAgeGroup?.trim()) filters.ageGroup = this.selectedAgeGroup;
    if (this.selectedTargetGroup?.trim()) filters.targetGroup = this.selectedTargetGroup;
    if (this.minPrice != null) filters.minPrice = this.minPrice;
    if (this.maxPrice != null) filters.maxPrice = this.maxPrice;
    if (this.inStockOnly != null) filters.inStock = String(this.inStockOnly);
    if (this.sortOption?.trim()) filters.sort = this.sortOption;

    this.toyService.getToys(filters).subscribe({
      next: res => {
        this.toys = res.items;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges(); // osveži view
      },
      error: err => {
        console.error('Error loading toys:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔹 Filter changed
  onFilterChange(): void {
    this.filterChanged.next();
  }

  // 🔹 Reset all filters
  resetFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.selectedAgeGroup = '';
    this.selectedTargetGroup = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.inStockOnly = false;
    this.sortOption = '';
    this.page = 1;

    this.getToys();
  }

  // 🔹 Pagination
  changePage(next: boolean): void {
    if (next && this.page < this.totalPages) this.page++;
    if (!next && this.page > 1) this.page--;
    this.getToys();
  }

  // 🔹 Add to cart
  addToCart(toyId: string): void {
    if (!toyId) return;
    this.cartService.addToCart(toyId).subscribe({
      next: () => alert('Igračka dodata u korpu!'),
      error: () => alert('Morate biti prijavljeni da biste dodali u korpu.')
    });
  }
}
