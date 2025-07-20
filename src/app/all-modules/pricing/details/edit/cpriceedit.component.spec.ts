import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpriceeditComponent } from './cpriceedit.component';

describe('CpriceeditComponent', () => {
  let component: CpriceeditComponent;
  let fixture: ComponentFixture<CpriceeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpriceeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpriceeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
