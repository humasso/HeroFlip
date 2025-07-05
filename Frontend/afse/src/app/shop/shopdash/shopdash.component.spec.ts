import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ShopdashComponent } from './shopdash.component';

describe('ShopdashComponent', () => {
  let component: ShopdashComponent;
  let fixture: ComponentFixture<ShopdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ShopdashComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
