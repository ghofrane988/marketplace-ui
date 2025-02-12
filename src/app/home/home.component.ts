import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PublishProductComponent } from '../publish-product/publish-product.component';
import { AuthService } from '../services/auth.service';
import { CardComponent } from './card/card.component';
type CategoryStructure = {
  [key: string]: string[];
};
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    FormsModule, 
    NgIf,
    NgFor,
    FooterComponent, 
    ChatbotComponent,
    CardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
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
  isMenuOpen = false; // Contrôle l'état du menu
  isDarkMode = false; // Contrôle l'état du mode sombre
 
  
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 10000;

  @ViewChild('chatbot') chatbot!: ChatbotComponent;
  
  constructor(
    private productService: ProductService,
    private router: Router,
    public userService: UserService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit():void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const subcategoryMatch = !this.selectedSubcategory || product.subcategory === this.selectedSubcategory;
      const priceMatch = product.price >= this.minPrice && product.price <= this.maxPrice;
      
      return categoryMatch && subcategoryMatch && priceMatch;
    });
  }

  onCategoryChange() {
    this.selectedSubcategory = ''; // Reset subcategory when category changes
    this.applyFilters();
  }

  onSubcategoryChange() {
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  getSubcategoriesForCategory(): string[] {
    return this.selectedCategory ? this.categoryStructure[this.selectedCategory] || [] : [];
  }

  onProductClick(productId: string) {
    console.log('Product clicked:', productId);
    this.router.navigate(['/productDetails'], { queryParams: { id: productId } ,state: { id: productId } });
  }
  toggleChatbot() {
    if (this.chatbot) {
      this.chatbot.toggle();
    } else {
      console.error("Chatbot component is not available.");
    }
  }
  redirectToPublishProduct() {
    
    this.router.navigate(['/publish-product']); 
    
  }
   redirectToLogin() {
    this.router.navigate(['/login']); 
  }
  onProfileIconClick(): void {
    if (this.authService.isLoggedIn()) {
      // Rediriger vers le profil de l'utilisateur
      this.router.navigate(['/profil']);
    } else {
      // Rediriger vers la page de connexion
      this.router.navigate(['/signin']);
    }
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Basculer le mode sombre
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  // Déconnecter l'utilisateur
  logout() {
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
}
