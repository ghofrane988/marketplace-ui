import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() imgUrl: string | undefined;
  price = input.required;
  name = input.required;
  description = input.required;

}
