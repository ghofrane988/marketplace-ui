import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, Firestore, addDoc, doc, deleteDoc, updateDoc , query, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

export interface Product {
  id?: string; // Firestore génère automatiquement un ID, donc il est optionnel
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: {
    file?: File;
    url: string;
  }[];
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private storage = inject(Storage);

  constructor(private firestore: Firestore) {}

  // Récupérer tous les produits
  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  }
  // Get products by user ID
  getProductsByUser(userId: string): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  // Ajouter un produit
  async addProduct(product: Product) {
    for (let i = 0; i < product.images.length; i++) {
      const file = product.images[i].file;
      if (file) {
          // const storageRef = ref(this.storage, file.name);
          // const imageRef = await uploadBytesResumable(storageRef, file);
          product.images[i] = {
            // url: imageRef.ref.fullPath
            url: "",
          }
      }
  }

    const firestoreRef = collection(this.firestore, 'products');
    console.log(product)
    try {
      const docRef = await addDoc(firestoreRef, {...product});
      console.log('Product added with ID: ', docRef);
    } catch (e) {
      console.error('Error adding product: ', e);
    }
  }

  // Supprimer un produit
  async deleteProduct(productId: string) {
    const ref = doc(this.firestore, `products/${productId}`);
    try {
      await deleteDoc(ref);
      console.log('Product deleted with ID: ', productId);
    } catch (e) {
      console.error('Error deleting product: ', e);
    }
  }

  // Mettre à jour un produit
  async editProduct(updatedProduct: Product) {
    if (!updatedProduct.id) {
      console.error('Product ID is required for update');
      return;
    }
    const ref = doc(this.firestore, `products/${updatedProduct.id}`);
    try {
      await updateDoc(ref, { ...updatedProduct });
      console.log('Product updated with ID: ', updatedProduct.id);
    } catch (e) {
      console.error('Error updating product: ', e);
    }
  }
}