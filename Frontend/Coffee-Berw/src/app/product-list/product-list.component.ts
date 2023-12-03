import {Component, OnInit} from '@angular/core';
import {ProductService} from "../product.service";
import {Product} from "../models/Product";
import {AppComponent} from "../app.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BasketService} from "../basket.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ])
  ]
})
export class ProductListComponent implements OnInit{
  currentProducts!: Product[];
  isItemOnHover:boolean = false;
  isLogged = AppComponent.isLogged;
  username = AppComponent.username;
  successAddToCardMessage:string = ""
  constructor(private productService: ProductService,
              private basketService: BasketService) {
  }
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data)=>{
      console.log("init products", data);
      this.currentProducts = data;
    })
  }

  onProductsFound(products: Product[]){
    this.currentProducts = products;
    console.log("products in product component", this.currentProducts);
  }

  toggleSpecialItem(exp:boolean){
    this.isItemOnHover = exp;
  }

  addToCard(username:string, productId: number){
    console.log(productId)
    this.basketService.postOrderOfTheUser(username, productId).subscribe(
    
      data=>{
        this.successAddToCardMessage = "Product was added to your card ";
      },
      error => {
        this.successAddToCardMessage = error +" "+ productId;
        console.log(this.successAddToCardMessage)
      }
    )
    window.alert(this.successAddToCardMessage);

  }
}
