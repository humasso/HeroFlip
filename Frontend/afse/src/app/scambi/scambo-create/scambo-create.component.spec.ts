import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScamboCreateComponent } from './scambo-create.component';

describe('ScamboCreateComponent', () => {
  let component: ScamboCreateComponent;
  let fixture: ComponentFixture<ScamboCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScamboCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScamboCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
