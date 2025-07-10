import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettagliPacchettiComponent } from './dettagli-pacchetti.component';

describe('DettagliPacchettiComponent', () => {
  let component: DettagliPacchettiComponent;
  let fixture: ComponentFixture<DettagliPacchettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettagliPacchettiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettagliPacchettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
