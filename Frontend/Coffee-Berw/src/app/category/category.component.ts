import {Component, EventEmitter, Output} from '@angular/core';
import {Product} from "../models/Product";
import { Sort } from '../models/Sort';
import { Type } from '../models/Type';
import { CategoryService } from '../category.service';
import { ProductService } from '../product.service';
import {AppRoutingModule} from "../app-routing.module";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  sorts: Sort[] = [];
  selectedSort: string = '';
  selectedType: string = '';
  selectedSortBy:string ='';
  types: Type[] = [];
  sorts_by = ['None','price'];
  @Output() productsFiltered = new EventEmitter<Product[]>();
  products!: Product[];
  copy_products!:Product[];
  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit(): void {
    this.categoryService.getAllSorts().subscribe((sorts) => {
      this.sorts = [{ sort: 'None' }, ...sorts];
    });

    this.categoryService.getAllTypes().subscribe((types) => {
      this.types = [{ type: 'None' }, ...types];
    });
    this.productService.getAllProducts().subscribe((data)=>{
      console.log("category", data)
      this.products = data;
      this.copy_products = data;
    })
  }

  isDropdownOpen = { type: false, sort: false, sort_by: false};

  toggleDropdown(dropdown: 'type' | 'sort' | 'sort_by') {
    this.isDropdownOpen[dropdown] = !this.isDropdownOpen[dropdown];
  }

  selectType(event: Event, type: string) {
    if (type === 'None') {
      this.selectedType = '';
    } else {
      this.selectedType = type;
    }
    this.isDropdownOpen.type = false;
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.filterProducts();
  }

  selectSort(event: Event, sort: string) {
    if (sort === 'None') {
      this.selectedSort = '';
    } else {
      this.selectedSort = sort;
    }
    this.isDropdownOpen.sort = false;
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.filterProducts();
  }

  filterProducts() {
    if (!this.selectedType && !this.selectedSort) {
      this.productsFiltered.emit(this.products);
      return;
    } else {
      const filteredProducts = this.products.filter(product => {
        if (this.selectedType && this.selectedSort) {
          return (
            product.category.type.type === this.selectedType && product.category.sort.sort === this.selectedSort
          );
        } else if (this.selectedType) {
          return product.category.type.type === this.selectedType;
        } else if (this.selectedSort) {
          return product.category.sort.sort === this.selectedSort;
        }
        return false;
      });

      console.log("filtered products:", filteredProducts)
      this.productsFiltered.emit(filteredProducts);
    }
  }
  sortItemsByNumericProperty(sort:string) {

    if(sort === 'None'){
      this.products.sort((a, b) => {
        return a.id - b.id;
      });
    }
    else {
      this.products.sort((a, b) => {
        return a.price - b.price;
      });
    }
    this.productsFiltered.emit(this.products);
  }
}
