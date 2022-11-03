import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAstronautsComponent } from './list-astronauts.component';

describe('ListAstronautsComponent', () => {
  let component: ListAstronautsComponent;
  let fixture: ComponentFixture<ListAstronautsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAstronautsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAstronautsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
