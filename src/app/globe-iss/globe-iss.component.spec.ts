import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobeIssComponent } from './globe-iss.component';

describe('GlobeIssComponent', () => {
  let component: GlobeIssComponent;
  let fixture: ComponentFixture<GlobeIssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobeIssComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobeIssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
