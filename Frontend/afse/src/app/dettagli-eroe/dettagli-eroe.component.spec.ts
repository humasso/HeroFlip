import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliEroeComponent } from './dettagli-eroe.component';

describe('DettagliEroeComponent', () => {
  let component: DettagliEroeComponent;
  let fixture: ComponentFixture<DettagliEroeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettagliEroeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettagliEroeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
