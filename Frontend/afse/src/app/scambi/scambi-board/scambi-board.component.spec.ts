import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScambiBoardComponent } from './scambi-board.component';

describe('ScambiBoardComponent', () => {
  let component: ScambiBoardComponent;
  let fixture: ComponentFixture<ScambiBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScambiBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScambiBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
