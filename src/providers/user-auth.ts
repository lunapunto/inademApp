import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CookieJS } from './cookie-js';
import { NetworkService } from './network-service';
import { Storage } from '@ionic/storage';
import { ApiCalls } from './api-calls';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the UserAuth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class UserAuth {
  public islogged : any;
  public data : any;
  constructor(public http: Http, public cookies : CookieJS) {
    this.islogged = this.isUserLogged();
    return this.islogged;
  }

  isUserLogged(){
    var scc = this.cookies.exists('inadem_sc');
    if(scc){
      return true;
    }else{
      return false;
    }
  }

  logUser(email, password, table){
    var obj = {email: email, table: table};
    var str = JSON.stringify(obj);
    this.cookies.create('inadem_sc', str, 30);
  }
}
