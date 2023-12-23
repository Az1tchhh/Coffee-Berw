import {Component, EventEmitter, Output} from '@angular/core';
import {Product} from "../models/Product";
import {ProductService} from "../product.service";
import {normalizePolyfills} from "@angular-devkit/build-angular/src/utils/normalize-polyfills";
import {AppComponent} from "../app.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Output() productsFiltered = new EventEmitter<Product[]>();
  searchText: string = '';
  products!: Product[];
  isLogged:boolean = AppComponent.isLogged;
  constructor(private productService: ProductService,
              private router: Router) {
  }
  ngOnInit() {
    this.productService.getAllProducts().subscribe((data)=>{
      console.log("top_bar", data)
      this.products = data;
    })
  }

  Search(){
    if (!this.searchText){
      this.productsFiltered.emit(this.products);
      return;
    }

    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    console.log("filtered products:", filteredProducts)
    this.productsFiltered.emit(filteredProducts);
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    AppComponent.isLogged = false;
    this.router.navigate([""]);
  }
}
