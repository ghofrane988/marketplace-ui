
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  // Importez withFetch

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,HttpClientModule,RouterLink],  // Correct
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  apiloginobj: any = {
    email: '',
    password: '',
  };
  rememberMe: boolean = false;
  
  constructor(private router: Router ,private http: HttpClient) {}  // Assurez-vous d'avoir importé le bon Router

  onlogin() {
  //   if (this.loginobj.email === 'admin' && this.loginobj.password === '1234') {
  //     this.router.navigateByUrl('/profil');
  //   } else {
  //     alert('Email ou mot de passe incorrect');
  //   }
  debugger;
  this.http.post("https://projectapi.gerasim.in/api/UserApp/login", this.apiloginobj)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.data && res.data.userId) {
            localStorage.setItem('angular19user', res.data.userId);
            this.router.navigateByUrl('/profil');
          } else {
            alert('Utilisateur non trouvé');
0          }
        },
        error => {
          console.error('API Error:', error);
          if (error.status === 401) {
            alert('Email ou mot de passe incorrect');
          }  else if (error.status === 400) {
            alert('Requête incorrecte. Vérifiez vos données.');
          }
          else {
            alert(`Une erreur est survenue (code: ${error.status}). Veuillez réessayer.`);
          }
        }
      );
  }
 
}
