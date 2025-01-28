import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };
  errorMessage: string = '';
  loading: boolean = false;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onLogin() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.signIn(this.loginData.email, this.loginData.password);
      this.router.navigate(['/profil']);
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during login';
    } finally {
      this.loading = false;
    }
  }
}
