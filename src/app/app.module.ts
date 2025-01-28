import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { setLogLevel, LogLevel } from '@angular/fire';

const firebaseConfig = {
  apiKey: "AIzaSyAzsgpt5yK2qKdknt0GA2KKRYuqFohcXaw",
  authDomain: "marketplace-f1bf9.firebaseapp.com",
  projectId: "marketplace-f1bf9",
  storageBucket: "marketplace-f1bf9.firebasestorage.app",
  messagingSenderId: "1067876615699",
  appId: "1:1067876615699:web:98042de3b29c9b626661e6",
  measurementId: "G-VTC8HVWPEN"
};

setLogLevel(LogLevel.VERBOSE); // Set log level to verbose

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }