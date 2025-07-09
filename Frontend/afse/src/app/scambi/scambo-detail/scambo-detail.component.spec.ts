import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScamboDetailComponent } from './scambo-detail.component';

describe('ScamboDetailComponent', () => {
  let component: ScamboDetailComponent;
  let fixture: ComponentFixture<ScamboDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScamboDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScamboDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
