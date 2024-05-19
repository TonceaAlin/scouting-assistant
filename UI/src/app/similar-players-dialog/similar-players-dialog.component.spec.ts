import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPlayersDialogComponent } from './similar-players-dialog.component';

describe('SimilarPlayersDialogComponent', () => {
  let component: SimilarPlayersDialogComponent;
  let fixture: ComponentFixture<SimilarPlayersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimilarPlayersDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimilarPlayersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
