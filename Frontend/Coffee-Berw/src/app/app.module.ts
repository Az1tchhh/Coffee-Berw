import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BasketComponent } from './basket/basket.component';
import { CategoryComponent } from './category/category.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from '@angular/service-worker';
import {PaymentComponent} from "./payment/payment.component";

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    TopBarComponent,
    AuthenticationComponent,
    BasketComponent,
    CategoryComponent,
    ProductDetailComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: ProductListComponent},
      {path: 'basket', component: BasketComponent},
      {path: 'login', component: AuthenticationComponent},
      {path: 'registration', component: RegistrationComponent},
      {path: 'user/:id/basket', component: BasketComponent},
      {path: 'product/:id', component: ProductDetailComponent},
      {path: 'payment', component:PaymentComponent}
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
