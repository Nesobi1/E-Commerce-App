import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedProductCard } from './detailed-product-card';

describe('DetailedProductCard', () => {
  let component: DetailedProductCard;
  let fixture: ComponentFixture<DetailedProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
