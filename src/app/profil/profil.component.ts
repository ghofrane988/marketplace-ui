import { Component , OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Ajoute FormsModule ici
@Component({
  selector: 'app-profil',
  imports: [ CommonModule,FormsModule,RouterLink],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  products: any[] = []; // Liste des produits
  alertVisible = false;
  isEditing = false;
  editingProductId: number | null = null;

  productName = '';
  productPrice = '';
  productDescription = '';
  productPhone = '';  // Ajouter la variable pour le téléphone
  productEmail = '';  // Ajouter la variable pour l'email
  previewImage = 'https://via.placeholder.com/150';

  constructor(private servicesService: ServicesService) {}

  ngOnInit() {
    // Charger les produits depuis le service (qui récupère les produits du localStorage)
    this.products = this.servicesService.getProducts();
  }

  openAlert(isEditing: boolean, product?: any) {
    this.alertVisible = true;
    this.isEditing = isEditing;

    if (isEditing && product) {
      this.editingProductId = product.id;
      this.productName = product.name;
      this.productPrice = product.price.toString();
      this.productDescription = product.description;
      this.productPhone = product.phone;  // Charger le téléphone
      this.productEmail = product.email;  // Charger l'email
      this.previewImage = product.image;
    } else {
      this.resetForm();
    }
  }

  closeAlert() {
    this.alertVisible = false;
    this.resetForm();
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.productName || !this.productPrice) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    if (this.isEditing && this.editingProductId !== null) {
      const updatedProduct = {
        name: this.productName,
        price: parseFloat(this.productPrice),
        description: this.productDescription,
        phone: this.productPhone,  // Inclure le téléphone dans la mise à jour
        email: this.productEmail,  // Inclure l'email dans la mise à jour
        image: this.previewImage
      };
      this.servicesService.updateProduct(this.editingProductId, updatedProduct);
      alert('Produit modifié avec succès!');
    } else {
      const newProduct = {
        id: 0, // L'ID est généré par le service
        name: this.productName,
        price: parseFloat(this.productPrice),
        description: this.productDescription,
        phone: this.productPhone,  // Inclure le téléphone dans l'ajout
        email: this.productEmail,  // Inclure l'email dans l'ajout
        image: this.previewImage
      };
      this.servicesService.addProduct(
        this.productName,
        parseFloat(this.productPrice),
        this.productDescription,
        this.previewImage,
        this.productPhone,
        this.productEmail
      );
      alert('Produit ajouté avec succès!');
    }

    this.products = this.servicesService.getProducts();  // Mettre à jour la liste des produits
    this.closeAlert();
  }

  deleteProduct(id: number) {
    if (this.servicesService.deleteProduct(id)) {
      this.products = this.servicesService.getProducts(); // Mettre à jour la liste des produits
      alert('Produit supprimé avec succès!');
    } else {
      alert('Erreur : produit introuvable.');
    }
  }

  resetForm() {
    this.productName = '';
    this.productPrice = '';
    this.productDescription = '';
    this.productPhone = '';  // Réinitialiser le téléphone
    this.productEmail = '';  // Réinitialiser l'email
    this.previewImage = 'https://via.placeholder.com/150';
    this.isEditing = false;
    this.editingProductId = null;
  }
}