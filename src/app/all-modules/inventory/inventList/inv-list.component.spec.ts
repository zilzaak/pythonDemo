import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvListComponent } from './inv-list.component';

describe('InvListComponent', () => {
  let component: InvListComponent;
  let fixture: ComponentFixture<InvListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
