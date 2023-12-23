import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DiscountServiceService} from "../discount-service.service";
import {AppComponent} from "../app.component";
import {BasketComponent} from "../basket/basket.component";
import {Router} from "@angular/router";
import {BasketService} from "../basket.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  userId = AppComponent.usernameID;
  constructor(private discountService: DiscountServiceService,
              private router: Router,
              private basketService: BasketService) {
  }

  purchase(){
    if(BasketComponent.discountPurchased) {
      this.discountService.purchaseDiscount(this.userId);
      console.log(BasketComponent.discountPurchased + "aZA")
    }
    this.basketService.getBasketOfTheUser(AppComponent.username).subscribe((data)=>{
      console.log(data);
      data.forEach((item, index) => {
        this.basketService.deleteOrderOfTheUser(AppComponent.username, item.products.id).subscribe();
      });
    })
    this.router.navigate([""]);
  }
}
