import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedImageIndex: number = 0;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: string };
    
    if (state?.id) {
      this.productService.getProducts().subscribe(products => {
        this.product = products.find(p => p.id === state.id);
        if (!this.product) {
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {}

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
