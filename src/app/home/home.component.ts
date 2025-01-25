import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServicesService } from '../services.service';
import { NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, 
    FormsModule, 
    NgFor, 
    NgIf, 
    FooterComponent, 
    ChatbotComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  alertVisible = false;
  selectedProduct: any = null;

  @ViewChild('chatbot') chatbot!: ChatbotComponent;

  constructor(private servicesService: ServicesService) {}

  ngOnInit() {
    this.products = this.servicesService.getProducts();
  }

  openProductDetails(product: any) {
    this.selectedProduct = product;
    this.alertVisible = true;
  }

  closeAlert() {
    this.alertVisible = false;
    this.selectedProduct = null;
  }

  toggleChatbot() {
    if (this.chatbot) {
      this.chatbot.toggle();
    }
  }
}
