import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { UserService, UserProfile } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MessagingComponent } from '../messaging/messaging.component';
import { ConversationService } from '../services/messaging.service';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedImageIndex: number = 0;
  seller:  UserProfile | null = null; // Accepter null

  constructor(
    private router: Router,
    private productService: ProductService, private route: ActivatedRoute, 
    public userService: UserService, private authService: AuthService,private conversation:ConversationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { id: string };
    
    if (state?.id) {
      this.productService.getProducts().subscribe(products => {
        this.product = products.find(p => p.id === state.id);
      });
    }
  }
  async loadProduct(productId: string) {
    this.product = await this.productService.getProductById(productId);
  }

  // ngOnInit(): void {
  //   const productId = this.route.snapshot.paramMap.get('id');
  //   if (productId) {
  //     this.loadProduct(productId);
  //   }
  // }
  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product = await this.productService.getProductById(productId);
      if (this.product && this.product.userId) {
        this.seller = await this.userService.getUserProfile(this.product.userId);
      }
    }
  }
  goBack() {
    this.router.navigate(['/home']);
  }
  async contactSeller() {
   
      if (this.product && this.seller) {
        const conversationId = await this.conversation.createConversation(
          this.product.id!,
          this.seller.uid
        );
        this.router.navigate(['/conversation', conversationId]);
      
  }
  
}
redirectToLogin() {
  this.router.navigate(['/login']); 
}
}
