import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PublishProductComponent } from '../publish-product/publish-product.component';
import { AuthService } from '../services/auth.service';
import { CardComponent } from './card/card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
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
  products$;
  @ViewChild('chatbot') chatbot!: ChatbotComponent;
  constructor(private productService: ProductService,private router: Router,
   public userService: UserService,private dialog: MatDialog,private authService: AuthService) {
    this.products$ = this.productService.getProducts();
   }
    ngOnInit() {}

  onProductClick(productId: string) {
    this.router.navigate(['/productDetails'], { state: { id: productId } });
  }
  toggleChatbot() {
    if (this.chatbot) {
      this.chatbot.toggle();
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

}
