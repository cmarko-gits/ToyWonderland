import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../core/services/toy/toy.service';
import { Toy } from '../../model/toy.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toy-detail',
  imports:[CommonModule],
  templateUrl: './toy-detail.component.html',
  styleUrls: ['./toy-detail.component.css']
})
export class ToyDetailComponent implements OnInit {
  toy?: Toy;

  constructor(private route: ActivatedRoute, private toyService: ToyService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.toyService.getToyById(id).subscribe({
        next: (data) => this.toy = data,
        error: (err) => console.error('Error loading toy', err)
      });
    }
  } addToCart(): void {
    if (this.toy) {
      console.log(`Added ${this.toy.name} to cart`);
    }
  }
}
