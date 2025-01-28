import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';
import { SignupComponent } from './signup/signup.component';

import { FooterComponent } from './footer/footer.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { authGuard } from './guards/auth.guard';
import { PublishProductComponent } from './publish-product/publish-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { 
    path: 'profil', 
    component: ProfilComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'profil', 
    component: ProfilComponent
  },
  { path: 'footer', component: FooterComponent },
  { path: 'chatbot', component: ChatbotComponent } ,
  { path:'publish-product', component: PublishProductComponent},
  {path:'productDetails',component:ProductDetailsComponent}
];
