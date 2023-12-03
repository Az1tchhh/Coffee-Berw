import {Component, OnInit} from '@angular/core';
import {Product} from "../models/Product";
import {Commentary} from "../models/Commentary";
import {AppComponent} from "../app.component";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../product.service";
import {CommentaryService} from "../commentary.service";
import {BasketService} from "../basket.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(400)), // 300ms is the duration of the animation
    ])
  ]
})
export class ProductDetailComponent implements OnInit{
  product!: Product;
  productId = 0;
  comments!: Commentary[];
  commentFromUser = ''
  username = AppComponent.username;
  clicked = false
  isLogged = AppComponent.isLogged;
  successAddToCardMessage:string = ""
  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private commentService: CommentaryService,
              private basketService: BasketService) {
  }
  ngOnInit(){
    const routeParams = this.route.snapshot.paramMap;
    this.productId = Number(routeParams.get('id'))

    this.productService.getTheProduct(this.productId).subscribe((data)=>{
      this.product = data;
    })
  }
  Click(){
    this.clicked = !this.clicked;
    if(this.clicked)
      if(!this.comments)
        this.commentService.getCommentariesForProduct(this.productId).subscribe((data)=>{
          console.log(data);
          data.forEach(comm => {
            comm.created_at = this.reformatDate(comm.created_at);
          })
          this.comments = data;
        })
  }
  submit(comment: string){

    if(!AppComponent.usernameID){
      window.alert("You need to sign in!")
      return;
    }
    if(comment.length > 0){
      this.commentService.postCommentaryByUser(this.username, this.productId, comment).subscribe(
        data =>{
          console.log(data);
          this.commentFromUser = "";
        }
      )
      window.location.reload();
      // this.commentService.getCommentariesForProduct(this.productId).subscribe(
      //   data =>{
      //     data.forEach(comm => {
      //       comm.created_at = this.reformatDate(comm.created_at);
      //     })
      //     this.comments = data;
      //   }
      // )
    }
  }
  order(username: string, total_price: number){
    console.log(username)
    // this.orderService.order(username, total_price).subscribe((data)=>{
    //   console.log(data)
    // })
  }
  private reformatDate(date:string): string{
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
  }

  addToCard(username:string, productId: number){
    console.log(productId)
    this.basketService.postOrderOfTheUser(username, productId).subscribe(
      data=>{
        this.successAddToCardMessage = "Product was added to your card " + productId
      },
      error => {
        this.successAddToCardMessage = error +" "+ productId;
        console.log(this.successAddToCardMessage)
      }
    )

  }
}
