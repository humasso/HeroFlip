import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScambiHistoryComponent } from './scambi-history.component';

describe('ScambiHistoryComponent', () => {
  let component: ScambiHistoryComponent;
  let fixture: ComponentFixture<ScambiHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScambiHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScambiHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
