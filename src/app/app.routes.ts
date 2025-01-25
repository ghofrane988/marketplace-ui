import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';

import { VerificationComponent } from './verification/verification.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponent } from './test/test.component';
import { FooterComponent } from './footer/footer.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },         
  { path:'profil' , component:ProfilComponent},
  { path:'signup',component:SignupComponent},
  {path:'verification',component:VerificationComponent},
  {path:'test',component:TestComponent},
  {path:'footer',component:FooterComponent},
  {path:'chatbot',component:ChatbotComponent}

 
];

