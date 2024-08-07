import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalCardsComponent } from './professional-cards.component';

describe('ProfessionalCardsComponent', () => {
  let component: ProfessionalCardsComponent;
  let fixture: ComponentFixture<ProfessionalCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
