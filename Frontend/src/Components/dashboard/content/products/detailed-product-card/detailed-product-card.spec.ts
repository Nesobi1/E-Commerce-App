import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedProductCardComponent } from './detailed-product-card';

describe('DetailedProductCard', () => {
  let component: DetailedProductCardComponent;
  let fixture: ComponentFixture<DetailedProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedProductCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
