import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService,Product } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  showLogoutModal = false;
  imageUrl: string | null = null; // URL de l'image de profil
  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }
  products: Product[] = [];
  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/publish-product'], { 
      state: { 
        product: {
          ...product,
          images: product.images.map(img => ({ ...img }))
        }
      }
    });
  }

  onDelete(productId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(productId);
    }
  }

  // Fonction appelée lorsque l'utilisateur sélectionne un fichier
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Créer un objet FileReader pour lire le fichier sélectionné
      const reader = new FileReader();
      
      // Une fois le fichier lu, on met à jour l'URL de l'image
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };

      // Lire le fichier en tant que URL de données
      reader.readAsDataURL(file);
    }
  }

  // Mettre à jour l'URL de l'image dans Firestore
  updateUserProfile(photoUrl: string): void {
    // Implémente la mise à jour de Firestore ici, par exemple :
    // this.firestore.collection('users').doc(this.userId).set({ photoUrl }, { merge: true });
  }


  constructor( private productService: ProductService,
    private router: Router,public userService: UserService,
    private authService: AuthService, ) {}


  logout() {
    this.authService.signOut();
    this.router.navigate(['/home']);
  }
  cancelLogout() {
    this.showLogoutModal = false; // Masquer le modal si l'utilisateur annule
  }

  redirectToLogin() {
    this.router.navigate(['/login']); // Redirect to your login page
  }
  }