import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScambioDetailComponent } from './scambio-detail.component';

describe('ScambioDetailComponent', () => {
  let component: ScambioDetailComponent;
  let fixture: ComponentFixture<ScambioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScambioDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScambioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
