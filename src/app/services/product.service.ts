import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: {
    file?: File;
    url: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly localStorageKey = 'products';
  private products = new BehaviorSubject<Product[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.products = new BehaviorSubject<Product[]>(this.loadProductsFromLocalStorage());
    }
  }

  getProducts() {
    return this.products;
  }

  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser) return false;
    
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private loadProductsFromLocalStorage(): Product[] {
    if (!this.isLocalStorageAvailable()) return [];
    
    const productsJson = localStorage.getItem(this.localStorageKey);
    return productsJson ? JSON.parse(productsJson) : [];
  }

  private saveProductsToLocalStorage(products: Product[]) {
    if (!this.isLocalStorageAvailable()) return;
    
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(products));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', e);
    }
  }

  addProduct(product: Product) {
    const currentProducts = this.products.value;
    const newProduct: Product = { 
      ...product, 
      id: this.generateUniqueId() 
    };

    if (newProduct.images) {
      newProduct.images = newProduct.images.filter(img => img.url !== '');
      const pendingImages = newProduct.images.filter(img => img.file).length;
      let processedImages = 0;

      if (pendingImages === 0) {
        const updatedProducts = [...currentProducts, newProduct];
        this.updateProducts(updatedProducts);
        return;
      }

      newProduct.images.forEach((image, index) => {
        if (image.file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newProduct.images[index].url = e.target?.result as string;
            delete newProduct.images[index].file;
            processedImages++;

            if (processedImages === pendingImages) {
              const updatedProducts = [...currentProducts, newProduct];
              this.updateProducts(updatedProducts);
            }
          };
          reader.readAsDataURL(image.file);
        }
      });
    } else {
      const updatedProducts = [...currentProducts, newProduct];
      this.updateProducts(updatedProducts);
    }
  }

  deleteProduct(productId: string) {
    const updatedProducts = this.products.value.filter(product => product.id !== productId);
    this.updateProducts(updatedProducts);
  }

  editProduct(updatedProduct: Product) {
    const currentProducts = this.products.value;
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    
    if (index === -1) return;

    const pendingImages = updatedProduct.images.filter(img => img.file).length;
    let processedImages = 0;

    if (pendingImages === 0) {
      const newProducts = [...currentProducts];
      newProducts[index] = updatedProduct;
      this.updateProducts(newProducts);
      return;
    }

    updatedProduct.images.forEach((image, imgIndex) => {
      if (image.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          updatedProduct.images[imgIndex].url = e.target?.result as string;
          delete updatedProduct.images[imgIndex].file;
          processedImages++;

          if (processedImages === pendingImages) {
            const newProducts = [...currentProducts];
            newProducts[index] = updatedProduct;
            this.updateProducts(newProducts);
          }
        };
        reader.readAsDataURL(image.file);
      }
    });
  }

  private updateProducts(products: Product[]) {
    this.products.next(products);
    this.saveProductsToLocalStorage(products);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
