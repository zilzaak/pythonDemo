import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchCrudComponent } from './purch-crud.component';

describe('PurchCrudComponent', () => {
  let component: PurchCrudComponent;
  let fixture: ComponentFixture<PurchCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
