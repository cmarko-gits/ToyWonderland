import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToyService } from '../../core/services/toy/toy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CartService } from '../../core/services/cart/cart.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toy-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toy-list.component.html',
  styleUrls: ['./toy-list.component.css']
})
export class ToyListComponent implements OnInit, OnDestroy {

  toys: any[] = [];
  loading = false;

  search: string = '';
  selectedCategory: string = '';
  selectedAgeGroup: string = '';
  selectedTargetGroup: string = '';
  inStockOnly: boolean = false;
  sortOption: string = '';

  minPrice?: number;
  maxPrice?: number;

  page = 1;
  limit = 12;
  totalPages = 1;

  categories = ["puzzle", "picture book", "figure", "character", "vehicles", "pleated", "other"];
  ageGroups = ["0+", "3+", "4+", "5+", "6+", "7+", "8+"];
  targetGroups = ["devojčica", "dečak"]

  private filterChanged = new Subject<void>();
  private filterSub!: Subscription;
  favorites: string[] = [];

  constructor(
    private toyService: ToyService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFavorites();

    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.search = params['search'] || '';
      this.selectedTargetGroup = params['targetGroup'] || '';
      this.selectedAgeGroup = params['ageGroup'] || '';
      this.sortOption = params['sort'] || '';
      this.page = params['page'] ? Number(params['page']) : 1;
      this.inStockOnly = params['inStock'] === 'true';

      this.minPrice = params['minPrice'] ? Number(params['minPrice']) : undefined;
      this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : undefined;

      this.getToys();
    });

    this.filterSub = this.filterChanged.pipe(debounceTime(400)).subscribe(() => {
      this.updateUrlAndSearch();
    });
  }

  ngOnDestroy(): void {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }

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
    if (this.inStockOnly) filters.inStock = 'true';
    if (this.sortOption?.trim()) filters.sort = this.sortOption;

    this.toyService.getToys(filters).subscribe({
      next: res => {
        this.toys = res.items;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.loadFavorites();
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading toys:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.filterChanged.next();
  }

  private updateUrlAndSearch(): void {
    const queryParams: any = {};

    if (this.search) queryParams.search = this.search;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.selectedTargetGroup) queryParams.targetGroup = this.selectedTargetGroup;
    if (this.selectedAgeGroup) queryParams.ageGroup = this.selectedAgeGroup;
    if (this.minPrice) queryParams.minPrice = this.minPrice;
    if (this.maxPrice) queryParams.maxPrice = this.maxPrice;
    if (this.sortOption) queryParams.sort = this.sortOption;
    if (this.inStockOnly) queryParams.inStock = 'true';

    queryParams.page = 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

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

    this.router.navigate([], { queryParams: {} });
  }

  changePage(next: boolean): void {
    if (next && this.page < this.totalPages) this.page++;
    if (!next && this.page > 1) this.page--;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge'
    });
  }

  addToCart(toyId: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(toyId, 1).subscribe({
      next: () => {
        console.log('Toy added to cart!');
      },
      error: (err) => {
        console.error('Add to cart error:', err);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleFavorite(toy: any, event: Event) {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.toyService.toggleFavorite(toy._id).subscribe({
      next: (res: any) => {
        toy.isFavorite = res.isFavorite;
        this.cdr.detectChanges();
      }
    });
  }

  loadFavorites(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.toyService.getFavorites().subscribe({
      next: (res: any) => {
        this.favorites = res.favorites.map((t: any) => t._id);
        this.toys.forEach(toy => {
          toy.isFavorite = this.favorites.includes(toy._id);
        });
        this.cdr.detectChanges();
      }
    });
  }

  openToy(toyId: string): void {
    this.router.navigate(['/toy', toyId]);
  }
}