import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductListComponent } from './product-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { CategoryComponent } from '../category/category.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductService } from '../product.service';
import { BasketService } from '../basket.service';
import { Sort } from '../models/Sort';
import { Type } from '../models/Type';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let basketService: jasmine.SpyObj<BasketService>;
  const mockType: Type = {
    type: 'Mocked Type'
  };
  
  const mockSort: Sort = {
    sort: 'Mocked Sort'
  };
  
  const mockCategory: Category = {
    type: mockType,
    sort: mockSort
  };
  
  const mockProduct: Product = {
    id: 1,
    name: 'Mocked Product',
    price: 19.99,
    category: mockCategory,
    description: 'Mocked Product Description',
    count: 10,
    image_url: 'mocked-image.jpg',
    url: 'mocked-url'
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Mocked Product2',
    price: 19.99,
    category: mockCategory,
    description: 'Mocked Product Description',
    count: 10,
    image_url: 'mocked-image2.jpg',
    url: 'mocked-url2'
  };

  beforeEach(() => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    const basketServiceSpy = jasmine.createSpyObj('BasketService', ['postOrderOfTheUser']);

    TestBed.configureTestingModule({
      declarations: [ProductListComponent, TopBarComponent, CategoryComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: BasketService, useValue: basketServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    productService.getAllProducts.and.returnValue(of([mockProduct, mockProduct2] as Product[]) as any);

    basketService = TestBed.inject(BasketService) as jasmine.SpyObj<BasketService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.currentProducts).toEqual([mockProduct, mockProduct2] as Product[]);
  }));

  it('should update products when onProductsFound is called', () => {
    component.onProductsFound([mockProduct, mockProduct2] as Product[]);

    expect(component.currentProducts).toEqual([mockProduct, mockProduct2] as Product[]);
  });

  it('should set isItemOnHover when toggleSpecialItem is called', () => {
    component.toggleSpecialItem(true);
    expect(component.isItemOnHover).toBe(true);

    component.toggleSpecialItem(false);
    expect(component.isItemOnHover).toBe(false);
  });

  it('should call basketService.postOrderOfTheUser when addToCard is called', () => {
    const username = 'testUser';
    const productId = 1;

    basketService.postOrderOfTheUser.and.returnValue(of({}));

    component.addToCard(username, productId);

    expect(basketService.postOrderOfTheUser).toHaveBeenCalledWith(username, productId);
    expect(component.successAddToCardMessage).toBe(`Product was added to your card ${productId}`);
  });
});
