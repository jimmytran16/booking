import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-card',
  templateUrl: './time-card.component.html',
  styleUrl: './time-card.component.scss',
  host: { class: 'TimeCard' }
})
export class TimeCardComponent {
  @Input() time: string = '';
  @Input() selected: boolean = false;

  get className(): string {
    var className = `TimeCard TimeCard-`;
    className += this.selected ? 'selected' : 'unselected'
    return className;
  }
}
