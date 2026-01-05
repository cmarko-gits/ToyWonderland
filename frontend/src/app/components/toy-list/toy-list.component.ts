import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToyService } from '../../core/services/toy/toy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject, forkJoin, of } from 'rxjs';
import { debounceTime, catchError } from 'rxjs/operators';
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
  sortOption: string = '';
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean = false;

  page = 1;
  limit = 12;
  totalPages = 1;

  categories = ["puzzle", "picture book", "figure", "character", "vehicles", "pleated", "other"];
  ageGroups = ["0+", "3+", "4+", "5+", "6+", "7+", "8+"];
  targetGroups = ["devojčica", "dečak"];

  private filterChanged = new Subject<void>();
  private filterSub!: Subscription;

  constructor(
    private toyService: ToyService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Slušamo promene u URL-u
    this.route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.selectedTargetGroup = params['targetGroup'] || '';
      this.selectedAgeGroup = params['ageGroup'] || '';
      this.sortOption = params['sort'] || '';
      this.page = params['page'] ? Number(params['page']) : 1;
      this.minPrice = params['minPrice'] ? Number(params['minPrice']) : undefined;
      this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : undefined;
      this.inStockOnly = params['inStock'] === 'true';

      this.getToys();
    });

    // Debounce za kucanje u search baru
    this.filterSub = this.filterChanged.pipe(debounceTime(400)).subscribe(() => {
      this.updateUrl();
    });
  }

  getToys(): void {
    this.loading = true;
    const token = localStorage.getItem('token');

    const filters: any = {
      page: this.page,
      limit: this.limit,
      search: this.search,
      category: this.selectedCategory,
      ageGroup: this.selectedAgeGroup,
      targetGroup: this.selectedTargetGroup,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sort: this.sortOption,
      inStock: this.inStockOnly ? 'true' : undefined
    };

    // Istovremeno učitavamo igračke i favorite da bi srca odmah bila ispravne boje
    const requests = {
      toys: this.toyService.getToys(filters),
      favs: token ? this.toyService.getFavorites().pipe(catchError(() => of({ favorites: [] }))) : of({ favorites: [] })
    };

    forkJoin(requests).subscribe({
      next: (res: any) => {
        const favoriteIds = res.favs.favorites.map((f: any) => f._id);
        this.toys = res.toys.items.map((toy: any) => ({
          ...toy,
          isFavorite: favoriteIds.includes(toy._id)
        }));
        this.totalPages = res.toys.totalPages;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(toy: any, event: Event): void {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // --- INSTANT UI PROMENA ---
    const originalValue = toy.isFavorite;
    toy.isFavorite = !toy.isFavorite;

    this.toyService.toggleFavorite(toy._id).subscribe({
      next: (res: any) => {
        // Potvrđujemo vrednost sa servera (obično res.isFavorite)
        toy.isFavorite = res.isFavorite;
        this.cdr.detectChanges();
      },
      error: () => {
        // Ako server ne odgovori, vraćamo na staro
        toy.isFavorite = originalValue;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.filterChanged.next();
  }

  private updateUrl(): void {
    const queryParams: any = {
      search: this.search || null,
      category: this.selectedCategory || null,
      targetGroup: this.selectedTargetGroup || null,
      ageGroup: this.selectedAgeGroup || null,
      minPrice: this.minPrice || null,
      maxPrice: this.maxPrice || null,
      sort: this.sortOption || null,
      inStock: this.inStockOnly ? 'true' : null,
      page: 1
    };
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }

  addToCart(toyId: string): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(toyId, 1).subscribe({
      next: () => console.log('Ubačeno u korpu'),
      error: (err) => err.status === 401 && this.router.navigate(['/login'])
    });
  }

  changePage(next: boolean): void {
    const newPage = next ? this.page + 1 : this.page - 1;
    this.router.navigate([], { queryParams: { page: newPage }, queryParamsHandling: 'merge' });
  }

  openToy(toyId: string): void {
    this.router.navigate(['/toy', toyId]);
  }

  ngOnDestroy(): void {
    if (this.filterSub) this.filterSub.unsubscribe();
  }
}