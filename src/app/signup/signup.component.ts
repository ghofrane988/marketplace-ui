import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  host: {
    '[class.boxicons-css]': 'true'
  },
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent {
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSignup() {
    this.loading = true;
    this.errorMessage = '';

    if (!this.validateForm()) {
      this.loading = false;
      return;
    }

    try {
      await this.authService.signUp(
        this.signupData.email,
        this.signupData.password,
        this.signupData.firstName,
        this.signupData.lastName
      );
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.errorMessage = error;
    } finally {
      this.loading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.signupData.firstName.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }
    if (!this.signupData.lastName.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }
    if (!this.signupData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }
    return true;
  }
}
