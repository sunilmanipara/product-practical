import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftDeletedProductComponent } from './soft-deleted-product.component';

describe('SoftDeletedProductComponent', () => {
  let component: SoftDeletedProductComponent;
  let fixture: ComponentFixture<SoftDeletedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftDeletedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftDeletedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
