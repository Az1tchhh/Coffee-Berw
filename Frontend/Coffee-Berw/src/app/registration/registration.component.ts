import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../login.service";
import {UserRegister} from "../models/UserRegister";
import {catchError, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  username!:string;
  password!:string;
  email!:string;
  somethingWentWrong:string = "";
  success:string=""
  constructor(private loginService: LoginService,
              private router: Router) {
  }

  register(){
    if(this.username || this.email || this.password) {
      this.loginService.register(this.username, this.email, this.password).subscribe(

        data => {
          console.log(data);
          this.success = "You registered successfully"
          this.somethingWentWrong = "";
        },
        error => {
          this.somethingWentWrong = error;
          this.success = ""
        })
    }
    else{
      this.somethingWentWrong = "Please fill all fields";
    }
  }
}
