import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";
import {BasketService} from "../basket.service";
import {Basket} from "../models/Basket";
import {BasketWithProduct} from "../models/BasketWithProduct";
import {DiscountServiceService} from "../discount-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit{
  basketList!:Basket[]
  userId = AppComponent.usernameID;
  static discountPurchased = false;
  discount:string = "";
  basketListOrig!:BasketWithProduct[]
  isLogged = AppComponent.isLogged
  deletedSuccessMessage:string = ""

  constructor(private basketService: BasketService,
              public discountService: DiscountServiceService,
              private router: Router) {

  }

  username = AppComponent.username
  ngOnInit(){
    this.basketService.getBasketOfTheUser(this.username).subscribe((data)=>{
      console.log(data);
      BasketComponent.discountPurchased = false;
      this.basketList = data.sort((a, b) => a.products.price - b.products.price);
    })
    console.log(this.basketList);console.log(BasketComponent.discountPurchased)
  }

  get totalSum(): number {
    return this.basketList.reduce((sum, order) => sum + order.products.price, 0);
  }

  delete(productId:number){
    this.basketService.deleteOrderOfTheUser(this.username, productId).subscribe(
      data=>{
        BasketComponent.discountPurchased = false;
        this.deletedSuccessMessage = data.delete + ". Reloading page " + productId;
        setTimeout(function (){
          window.location.reload();
        }, 1000)

      }
    )
    alert("deleted successfully");
  }

  makeDiscount(){
    if(BasketComponent.discountPurchased){
      return;
    }
    BasketComponent.discountPurchased = !BasketComponent.discountPurchased;
    console.log(BasketComponent.discountPurchased)
    const len = this.basketList.length
    if(len == 0 || len == 1){
      this.discount = "";
    }
    else if(len == 2){
      this.basketList[0].products.price*=0.8;
      this.discount = "-20%";
    }
    else if(len == 3){
      this.basketList[0].products.price*=0.6;
      this.discount = "-40%";
    }
    else{
      this.basketList[0].products.price*=0.2;
      this.discount = "-80%";
    }
    return;
  }
  toPurchasePage(){

    if(this.basketList.length != 0)
      this.router.navigate(["payment"])
  }
}
