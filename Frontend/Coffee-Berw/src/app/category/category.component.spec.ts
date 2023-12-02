import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CategoryComponent } from './category.component';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import { of } from 'rxjs';
import { Type } from '../models/Type';
import { Sort } from '../models/Sort';
import { Product } from '../models/Product';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockSorts: Sort[] = [{ sort: 'Mocked Sort' }];
  const mockTypes: Type[] = [{ type: 'Mocked Type' }];

  beforeEach(() => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAllSorts', 'getAllTypes']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getAllProducts']);
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
      ],
    });
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService.getAllSorts.and.returnValue(of(mockSorts));
    categoryService.getAllTypes.and.returnValue(of(mockTypes));
    productService.getAllProducts.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch sorts and types on init', fakeAsync(() => {
    categoryService.getAllSorts.and.returnValue(of(mockSorts));
    categoryService.getAllTypes.and.returnValue(of(mockTypes));
    productService.getAllProducts.and.returnValue(of([]));

    fixture.detectChanges();
    tick();

    expect(component.sorts).toEqual([{ sort: 'None' }, ...mockSorts]);
    expect(component.types).toEqual([{ type: 'None' }, ...mockTypes]);
  }));

  it('should filter products based on type and sort', () => {
    const mockProducts: Product[] = [
      { category: { type: { type: 'Type1' }, sort: { sort: 'Sort1' } } } as Product,
      { category: { type: { type: 'Type2' }, sort: { sort: 'Sort2' } } } as Product,
    ];

    component.products = mockProducts;
    component.selectedType = 'Type1';
    component.selectedSort = 'Sort1';

    spyOn(component.productsFiltered, 'emit');

    component.filterProducts();

    expect(component.productsFiltered.emit).toHaveBeenCalledWith([mockProducts[0]]);
  });

  it('should reset type and sort on selecting None', () => {
    component.selectedType = 'Type1';
    component.selectedSort = 'Sort1';

    spyOn(component, 'filterProducts');

    component.selectType({} as Event, 'None');
    expect(component.selectedType).toEqual('');
    expect(component.filterProducts).toHaveBeenCalled();

    component.selectSort({} as Event, 'None');
    expect(component.selectedSort).toEqual('');
    expect(component.filterProducts).toHaveBeenCalled();
  });
});
