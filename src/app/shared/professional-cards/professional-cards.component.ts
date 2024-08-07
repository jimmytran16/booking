import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-professional-cards',
  templateUrl: './professional-cards.component.html',
  styleUrl: './professional-cards.component.scss'
})
export class ProfessionalCardsComponent {
  @Input() name: string = '';
  @Input() imgSrc: string = '';
  @Input() selected: string = '';

  get className(): string {
    var className = `ProfessionalCard ProfessionalCard-`;
    className += this.selected == this.name ? 'selected' : 'unselected'
    return className;
  }
}
