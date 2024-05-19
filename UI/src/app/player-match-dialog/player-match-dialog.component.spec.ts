import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMatchDialogComponent } from './player-match-dialog.component';

describe('PlayerMatchDialogComponent', () => {
  let component: PlayerMatchDialogComponent;
  let fixture: ComponentFixture<PlayerMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerMatchDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
