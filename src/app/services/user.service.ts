import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Subscribe to auth state changes
    this.auth.onAuthStateChanged(user => {
      this.currentUser.next(user);
    });
  }
  get isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  // Sign up new user
  async signUp(email: string, password: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        uid: user.uid,
        email: user.email!,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  // Create user profile in Firestore
  private async createUserProfile(uid: string, profile: UserProfile): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, profile);
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Get current user profile
  getCurrentUserProfile(): Observable<UserProfile | null> {
    return this.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return from(this.getUserProfile(user.uid));
      })
    );
  }
}
