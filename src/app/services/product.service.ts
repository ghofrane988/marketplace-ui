import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, collectionData, Firestore, addDoc, getDoc, doc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

export interface Product {
  id?: string;
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
  sellerName?: string;
  sellerPhone?: string;
  sellerAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private storage = inject(Storage);

  constructor(private firestore: Firestore, private authService: AuthService, private userService: UserService) {}

  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsByUser(userId: string): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async addProduct(product: Omit<Product, 'userId' | 'sellerName' | 'sellerPhone' | 'sellerAddress'>) {
    const user$: Observable<User | null> = this.authService.currentUser;
    const user = await new Promise<User | null>((resolve) => user$.subscribe(resolve));
    if (!user) {
      throw new Error('User not logged in');
    }

    const userData = await this.userService.getUserProfile(user.uid);
    if (!userData) {
      throw new Error('User data not found');
    }

    const productData: Product = {
      ...product,
      userId: user.uid,
      sellerName: `${userData.firstName} ${userData.lastName}`,
      sellerPhone: userData.phoneNumber,
      sellerAddress: userData.address,
    };

    for (let i = 0; i < product.images.length; i++) {
      const file = product.images[i].file;
      if (file) {
        const base64 = await this.fileToBase64(file);
        const imageKey = `product_image_${Date.now()}_${i}`;
        localStorage.setItem(imageKey, base64);
        product.images[i] = { url: imageKey };
      }
    }

    const firestoreRef = collection(this.firestore, 'products');
    try {
      const docRef = await addDoc(firestoreRef, { ...productData });
      console.log('Product added with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding product: ', e);
    }
  }

  async deleteProduct(productId: string) {
    const ref = doc(this.firestore, `products/${productId}`);
    try {
      await deleteDoc(ref);
      console.log('Product deleted with ID: ', productId);
    } catch (e) {
      console.error('Error deleting product: ', e);
    }
  }

  async getProductById(productId: string): Promise<Product | undefined> {
    const ref = doc(this.firestore, `products/${productId}`);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      const product = { id: snapshot.id, ...snapshot.data() } as Product;
      product.images = product.images.map(image => {
        if (image.url.startsWith('product_image_')) {
          const base64 = localStorage.getItem(image.url);
          return { url: base64 || '' };
        }
        return image;
      });
      return product;
    } else {
      console.error('Product not found');
      return undefined;
    }
  }
}
