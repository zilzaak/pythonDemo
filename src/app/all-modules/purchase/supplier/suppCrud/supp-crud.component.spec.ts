import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppCrudComponent } from './supp-crud.component';

describe('SuppCrudComponent', () => {
  let component: SuppCrudComponent;
  let fixture: ComponentFixture<SuppCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
