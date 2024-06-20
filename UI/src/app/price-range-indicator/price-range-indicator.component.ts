import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-price-range-indicator',
  templateUrl: './price-range-indicator.component.html',
  styleUrl: './price-range-indicator.component.scss'
})
export class PriceRangeIndicatorComponent implements OnInit{
  @Input() minValue: number = 710;
  @Input() maxValue: number = 1650;
  @Input() currentValue: number = 712;

  constructor() { }

  ngOnInit(): void {
  }

  getPointerPosition(): number {
    if (this.currentValue <= this.maxValue) {
      return ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
    } else {
      return 100; // Cap at 100%
    }
  }

  getPointerStyle() {
    const position = this.getPointerPosition();
    return {
      left: `${position}%`,
      backgroundColor: this.currentValue > this.maxValue ? '#ff0000' : '#ffffff', // Red background for overflow
      color: this.currentValue > this.maxValue ? '#ffffff' : '#000000' // White text color if overflow
    };
  }
}
