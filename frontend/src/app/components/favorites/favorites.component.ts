import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToyService } from "../../core/services/toy/toy.service";
import {Router} from '@angular/router';
@Component({
    selector: 'app-favorites',
    imports:[CommonModule],
    templateUrl:'./favorites.component.html',
  styleUrls: ['./favorites.component.css']
})

export class FavoriteComponent implements OnInit{

    favorites:any[]=[];
    loading = false;

    constructor(
        private toyService:ToyService,
        private cdr:ChangeDetectorRef,
        private router:Router
    ){}

    ngOnInit(): void {
        this.loadFavorites()
    }

    
  loadFavorites(): void {
    this.loading = true;
    this.toyService.getFavorites().subscribe({
      next: (res: any) => {
        this.favorites = res.favorites || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Greška pri učitavanju favorites', err);
        this.loading = false;
        if (err.status === 401) {
          alert('Vaša sesija je istekla. Molimo prijavite se ponovo.');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggleFavorite(toy: any): void {
    this.toyService.toggleFavorite(toy._id).subscribe({
      next: (res: any) => {
        toy.isFavorite = res.isFavorite;
        if (!res.isFavorite) {
          this.favorites = this.favorites.filter(t => t._id !== toy._id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Greška pri togglanju favorite', err)
    });
  }
}
