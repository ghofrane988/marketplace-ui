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
    images: Array(6).fill({ url: '' }),
    userId: 'currentUserId'
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {}

  onCategoryChange(): void {
    this.subcategories = this.categoryStructure[this.product.category] || [];
  }

  onSubmit(): void {
    this.productService.addProduct(this.product).then(() => {
      this.router.navigate(['/home']); // Redirect to home page after adding product
    });
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.images[index] = { file, url: e.target.result };
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.product.images.splice(index, 1);
  }
  onCancel(): void {
    this.router.navigate(['/home']); // Redirect to the home page or any other page
  }
}
