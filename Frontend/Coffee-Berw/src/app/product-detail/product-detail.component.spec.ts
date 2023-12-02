import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductDetailComponent } from './product-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { of } from 'rxjs';
import { ProductService } from '../product.service';
import { CommentaryService } from '../commentary.service';
import { BasketService } from '../basket.service';
import { ActivatedRoute } from '@angular/router';
import { Type } from '../models/Type';
import { Sort } from '../models/Sort';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import {Commentary} from '../models/Commentary';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: () => '1' } },
  };
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
  
  const mockComment: Commentary = {
    user: 'Mocked User 1',
    text: 'Mocked Comment 1',
    created_at: '2023-01-01T12:34:56',
    product: 1,
  };

  const mockPostOrderResponse: any = {
    success: true,
    message: 'Order placed successfully',
    orderId: 123,
  };
  

  const mockProductService = jasmine.createSpyObj('ProductService', ['getTheProduct', 'getAllProducts']);
  mockProductService.getTheProduct.and.returnValue(of(mockProduct) as any);
  mockProductService.getAllProducts.and.returnValue(of([mockProduct, mockProduct2] as Product[]));

  const mockCommentService = jasmine.createSpyObj('CommentaryService', ['getCommentariesForProduct', 'postCommentaryByUser']);
  mockCommentService.getCommentariesForProduct.and.returnValue(of([mockComment] as Commentary[]));
  mockCommentService.postCommentaryByUser.and.returnValue(of(mockComment) as any);

  const mockBasketService = jasmine.createSpyObj('BasketService', ['postOrderOfTheUser']);
  mockBasketService.postOrderOfTheUser.and.returnValue(of(mockPostOrderResponse) as any);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailComponent, TopBarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        { provide: CommentaryService, useValue: mockCommentService },
        { provide: BasketService, useValue: mockBasketService },
      ],
    });
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product on ngOnInit', () => {
    expect(mockProductService.getTheProduct).toHaveBeenCalledWith(1);
    expect(component.product).toBeDefined();
  });

  it('should toggle comments visibility', () => {
    expect(component.clicked).toBeFalse();
    component.Click();
    expect(component.clicked).toBeTrue();
    component.Click();
    expect(component.clicked).toBeFalse();
  });

  it('should fetch comments on Click if not present', () => {
    component.Click();
    expect(mockCommentService.getCommentariesForProduct).toHaveBeenCalledWith(1);
    expect(component.comments).toBeDefined();
  });
/*
  it('should submit comment', () => {
    component.submit('test comment');
    expect(mockCommentService.postCommentaryByUser).toHaveBeenCalledWith(component.username, 1, 'test comment');
  });
*/
  it('should order', () => {
    component.order('testUser', 100);
  });

  it('should add to card', () => {
    component.addToCard('testUser', 1);
    expect(mockBasketService.postOrderOfTheUser).toHaveBeenCalledWith('testUser', 1);
  });
  
});

