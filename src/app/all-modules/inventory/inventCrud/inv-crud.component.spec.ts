import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvCrudComponent } from './inv-crud.component';

describe('InvCrudComponent', () => {
  let component: InvCrudComponent;
  let fixture: ComponentFixture<InvCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
