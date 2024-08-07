import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() name: string = '';
  @Input() time: number = 0;
  @Input() price: number = 0;
  @Input() selected: boolean = false;

  get selectionOrNoSelectionClass(): string {
    var className = "ServiceCard ServiceCard-";
    className += this.selected ? "selected" : 'unselected';
    return className;
  }

  get selectedIconBackgroundColor(): string {
    var className = "ServiceCard-icon";
    if (this.selected) {
      className+= " ServiceCard-iconSelected"
    }
    return className
  }
}
