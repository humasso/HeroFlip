import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScambioCreateComponent } from './scambio-create.component';

describe('ScambioCreateComponent', () => {
  let component: ScambioCreateComponent;
  let fixture: ComponentFixture<ScambioCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScambioCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScambioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
