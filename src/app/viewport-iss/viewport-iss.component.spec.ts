import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportIssComponent } from './viewport-iss.component';

describe('ViewportIssComponent', () => {
  let component: ViewportIssComponent;
  let fixture: ComponentFixture<ViewportIssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewportIssComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewportIssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
