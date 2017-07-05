import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { NavController } from 'ionic-angular';
import { StandbyPage } from '../pages/standby/standby';
import { HomePage } from '../pages/home/home';
import { HomeRepPage } from '../pages/home-rep/home-rep';
import { LoginPage } from '../pages/login/login';
import { UserAuth } from '../providers/user-auth';
import { CookieJS } from '../providers/cookie-js';



@Component({
  template: '<ion-nav #myNav [root]="rootPage"></ion-nav>',
  providers: [ UserAuth, CookieJS, Keyboard, StatusBar, SplashScreen ]
})

export class MyApp {
  @ViewChild('myNav') nav: NavController
  rootPage = StandbyPage;
  self = this;

  constructor(public platform: Platform, public userAuth : UserAuth, public statusbar: StatusBar, public keyboard: Keyboard, public splashscreen: SplashScreen, public cookie: CookieJS) {
    platform.ready().then(() => {
      this.statusbar.styleDefault();
      this.splashscreen.hide();
      this.statusbar.backgroundColorByHexString('#72bf44');
      if(this.userAuth.islogged){
        var authCookie = this.cookie.get('inadem_sc');
            authCookie = JSON.parse(authCookie);
        var table = authCookie['table'];
        if(table == 'usuarios_representantes'){
          this.nav.setRoot(HomeRepPage);
        }else{
          this.nav.setRoot(HomePage);
        }
      }else{
        this.nav.setRoot(LoginPage);
      }
    });
  }
  ngOnInit() {
    this.platform.ready().then(() => {
          this.keyboard.disableScroll(false);
        });
   }
}
