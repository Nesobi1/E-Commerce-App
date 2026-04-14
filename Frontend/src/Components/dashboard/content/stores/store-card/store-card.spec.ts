import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCardComponent } from './store-card';

describe('ShopCard', () => {
  let component: StoreCardComponent;
  let fixture: ComponentFixture<StoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
