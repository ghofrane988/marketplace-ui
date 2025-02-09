import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { 
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup, User, sendEmailVerification
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc,
  getDoc 
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public get currentUser() {
    return this.currentUserSubject.asObservable();
  }
  public get currentUserSubjectValue() {
    return this.currentUserSubject.value;
  }
  constructor(
    private auth: Auth,
    private firestore: Firestore
    , private userService: UserService
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string
  ) {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
  
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      await sendEmailVerification(user);
  
      // Store additional user data in Firestore
      await this.createUserData({
        uid: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
      });
  
      return userCredential;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async createUserData(userData: UserData) {
    const userDocRef = doc(this.firestore, 'users', userData.uid);
    await setDoc(userDocRef, userData);
  }

  async getUserData(uid: string): Promise<UserData | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() as UserData : null;
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      throw new Error(errorMessage);
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  isLoggedIn(): Observable<User | null> {
    return this.currentUser$;
    
  }  
  // Handle errors
  public handleError(error: any): string {
    let errorMessage = 'An error occurred';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Wrong password';
          break;
        default:
          errorMessage = error.message;
      }
    }
    return errorMessage;
  }
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      await this.createUserData({
        uid: user.uid,
        email: user.email!,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        phoneNumber: user.phoneNumber || '',
        address: ''
      });
      return userCredential;
    } catch (error: any) {
      throw new Error(this.handleError(error));
    }
  }
 
}

