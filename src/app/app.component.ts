import { CommonModule } from '@angular/common';
import {Component, inject  } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RouterModule, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'marketPlace';
  firestore: Firestore = inject(Firestore);
  
  
}
