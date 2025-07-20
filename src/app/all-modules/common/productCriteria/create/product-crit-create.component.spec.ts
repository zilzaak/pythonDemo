import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCritCreateComponent } from './product-crit-create.component';

describe('ProductCritCreateComponent', () => {
  let component: ProductCritCreateComponent;
  let fixture: ComponentFixture<ProductCritCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCritCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCritCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
