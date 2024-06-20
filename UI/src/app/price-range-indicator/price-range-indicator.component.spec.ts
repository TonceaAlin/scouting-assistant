import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRangeIndicatorComponent } from './price-range-indicator.component';

describe('PriceRangeIndicatorComponent', () => {
  let component: PriceRangeIndicatorComponent;
  let fixture: ComponentFixture<PriceRangeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriceRangeIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceRangeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
