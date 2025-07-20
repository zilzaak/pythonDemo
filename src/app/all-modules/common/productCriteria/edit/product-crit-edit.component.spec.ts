import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCritEditComponent } from './product-crit-edit.component';

describe('ProductCritEditComponent', () => {
  let component: ProductCritEditComponent;
  let fixture: ComponentFixture<ProductCritEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCritEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCritEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
