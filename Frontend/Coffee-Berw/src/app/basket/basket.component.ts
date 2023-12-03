import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";
import {BasketService} from "../basket.service";
import {Basket} from "../models/Basket";
import {BasketWithProduct} from "../models/BasketWithProduct";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit{
  basketList!:Basket[]
  basketListOrig!:BasketWithProduct[]
  isLogged = AppComponent.isLogged
  deletedSuccessMessage:string = ""
  constructor(private basketService: BasketService) {
  }
  username = AppComponent.username
  ngOnInit(){
    this.basketService.getBasketOfTheUser(this.username).subscribe((data)=>{
      console.log(data);
      this.basketList = data;
    })

  }

  get totalSum(): number {
    return this.basketList.reduce((sum, order) => sum + order.products.price, 0);
  }

  delete(productId:number){
    this.basketService.deleteOrderOfTheUser(this.username, productId).subscribe(
      data=>{
        this.deletedSuccessMessage = data.delete + ". Reloading page " + productId;
        setTimeout(function (){
          window.location.reload();
        }, 1000)

      }
    )
    alert("deleted successfully");
  }
}
