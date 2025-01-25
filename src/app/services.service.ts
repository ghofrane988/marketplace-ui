import { Injectable } from '@angular/core';

// Interface Product pour définir la structure des produits
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  phone: string;   // Ajouter le champ 'phone'
  email: string;   // Ajouter le champ 'email'
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private products: Product[] = []; // Tableau des produits

  constructor() {
    this.loadProducts(); // Charger les produits depuis localStorage lors de l'initialisation du service
  }

  // Charger les produits depuis le localStorage
  private loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    }
  }

  // Sauvegarder les produits dans le localStorage
  private saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  // Obtenir la liste des produits
  getProducts(): Product[] {
    return this.products;
  }

  // Ajouter un produit
  addProduct(name: string, price: number, description: string, image: string, phone: string, email: string): void {
    const newProduct: Product = {
      id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1, // Générer un nouvel ID
      name,
      price,
      description,
      image,
      phone,    // Ajouter le téléphone
      email     // Ajouter l'email
    };
    this.products.push(newProduct);
    this.saveProducts(); // Sauvegarder les produits après ajout
  }

  // Mettre à jour un produit
  updateProduct(id: number, updatedProduct: Partial<Product>): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts(); // Sauvegarder les produits après modification
      return true; // Modification réussie
    }
    return false; // Produit non trouvé
  }

  // Supprimer un produit
  deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    this.saveProducts(); // Sauvegarder les produits après suppression
    return this.products.length < initialLength; // Retourne true si produit supprimé
  }
}
