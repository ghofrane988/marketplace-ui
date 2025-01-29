import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type CategoryStructure = {
  [key: string]: string[];
};

@Component({
  selector: 'app-publish-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './publish-product.component.html',
  styleUrls: ['./publish-product.component.css']
})
export class PublishProductComponent implements OnInit {
  categoryStructure: CategoryStructure = {
    'Électronique': [
      'Smartphones et accessoires',
      'Ordinateurs et périphériques',
      'Téléviseurs et équipements audio',
      'Consoles et jeux vidéo',
      'Électroménagers'
    ],
    'Vêtements': [
      'Vêtements homme',
      'Vêtements femme',
      'Vêtements enfant',
      'Chaussures',
      'Accessoires de mode'
    ],
    'Maison et Jardin': [
      'Meubles',
      'Décoration',
      'Jardinage',
      'Bricolage',
      'Articles ménagers'
    ],
    'Sports et Loisirs': [
      'Équipement sportif',
      'Vêtements de sport',
      'Camping et randonnée',
      'Vélos',
      'Fitness et musculation'
    ],
    'Livres': [
      'Romans',
      'BD et Mangas',
      'Livres scolaires',
      'Magazines',
      'Livres pour enfants'
    ],
    'Jeux et Jouets': [
      'Jeux de société',
      'Jouets pour enfants',
      'Jeux éducatifs',
      'Peluches',
      'Jeux de construction'
    ],
    'Auto et Moto': [
      'Pièces auto',
      'Accessoires auto',
      'Équipement moto',
      'GPS et électronique',
      'Entretien véhicule'
    ],
    'Beauté et Bien-être': [
      'Soins du visage',
      'Soins du corps',
      'Parfums',
      'Maquillage',
      'Matériel de soin'
    ],
    'Autres': [
      'Divers'
    ]
  };

  categories = Object.keys(this.categoryStructure);
  subcategories: string[] = [];
  isEditing = false;

  product: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    images: Array(6).fill({ url: '' })
  };

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
      if (this.product.category) {
        this.updateSubcategories(this.product.category);
      }
      while (this.product.images.length < 6) {
        this.product.images.push({ url: '' });
      }
      this.isEditing = true;
    }
  }

  ngOnInit(): void {}

  updateSubcategories(category: string): void {
    this.subcategories = this.categoryStructure[category] || [];
    if (!this.subcategories.includes(this.product.subcategory)) {
      this.product.subcategory = '';
    }
  }

  onCategoryChange(): void {
    this.updateSubcategories(this.product.category);
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.product.images[index] = {
        file: file,
        url: URL.createObjectURL(file)
      };
    }
  }

  removeImage(index: number): void {
    this.product.images[index] = { url: '' };
  }

  onSubmit(): void {
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

  onCancel(): void {
    this.router.navigate(['/profil']);
  }

  resetForm(): void {
    this.product = {
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      subcategory: '',
      images: Array(6).fill({ url: '' })
    };
    this.subcategories = [];
    this.isEditing = false;
  }
}
