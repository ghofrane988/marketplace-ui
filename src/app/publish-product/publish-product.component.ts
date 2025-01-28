import { Component,OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-publish-product',
  templateUrl: './publish-product.component.html',
  imports:[CommonModule,  FormsModule,
  ],
  styleUrls: ['./publish-product.component.css'],
})
export class PublishProductComponent implements OnInit {
  product: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    images: Array(6).fill({ url: '' })
  };
  
  isEditing = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    
    if (state && 'product' in state) {
      this.product = { 
        ...state['product'],
        images: [...state['product'].images]
      };
      while (this.product.images.length < 6) {
        this.product.images.push({ url: '' });
      }
      this.isEditing = true;
    }
  }

  ngOnInit() {}

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.product.images[index] = {
        file: file,
        url: URL.createObjectURL(file)
      };
    }
  }

  removeImage(index: number) {
    this.product.images[index] = { url: '' };
  }

  onSubmit() {
    // Filtrer les images vides
    this.product.images = this.product.images.filter(img => img.url !== '');
    
    if (this.isEditing) {
      this.productService.editProduct(this.product);
      this.router.navigate(['/profil']);
    } else {
      this.productService.addProduct(this.product);
      this.router.navigate(['/profil']);
    }
  }

  onCancel() {
    this.router.navigate(['/profil']);
  }

  resetForm() {
    this.product = {
      id: '',
      name: '',
      description: '',
      price: 0,
      images: Array(6).fill({ url: '' })
    };
    this.isEditing = false;
  }
}
