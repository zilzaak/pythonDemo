import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpricelistComponent } from './cpricelist.component';

describe('CpricelistComponent', () => {
  let component: CpricelistComponent;
  let fixture: ComponentFixture<CpricelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpricelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
