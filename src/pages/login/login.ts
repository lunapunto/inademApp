import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { CookieJS } from '../../providers/cookie-js';
import { AlertController, LoadingController } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
import { NetworkService } from '../../providers/network-service';
import { PasswordPagePage } from '../password-page/password-page';
import { HomePage } from '../home/home';
import { HomeRepPage } from '../home-rep/home-rep';
import { StatusBar } from '@ionic-native/status-bar';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserAuth, CookieJS, ApiCalls, NetworkService]
})
export class LoginPage {
  email: any;
  password: any;
  isLoading = false;
  loading: any;
  self = this;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userAuth: UserAuth, public alert: AlertController, public api : ApiCalls, public network: NetworkService, public loadingCtrl: LoadingController) {
    var islogout = navParams.data.isLogout;
    var paramEmail = this.navParams.data.email;

    if(paramEmail){
      this.email = paramEmail;
    }
    if(islogout){
      let alert = this.alert.create({
        title: 'Cerraste sesión',
        subTitle: 'Cerraste sesión exitosamente',
        buttons: ['Entendido']
      })
      alert.present();
    }
  }

  ionViewDidLoad() {


  }

  login(){

    var isValid = true;

    if(!this.email || !this.password){
      isValid = false;
      var str = 'Por favor ingresa los siguientes campos:<br/><br>';
      if(!this.email){
        str += '- E-mail<br/>';
      }
      if(!this.password){
        str += '- Contraseña';
      }
      let alert = this.alert.create({
        title: 'Faltan campos',
        subTitle: str,
        buttons: ['Entendido']
      });
      alert.present();
    }else{
      //BACKEND

      this.loading = this.loadingCtrl.create({
                      content: 'Ingresando'
                    });

      this.loading.present();

      var isonline = this.network.isOnline();

        if(isonline){
          this.backendLoading();
        }else{
          let alert = this.alert.create({
                    title: 'Sin internet',
                    subTitle: 'Necesitas una conexión de internet para poder ingresar.',
                    buttons: ['Entendido']
                    });
                    alert.present();

          this.loading.dismiss();
        }





    }
  }
  backendLoading(){
    // IS ONLINE, CONTINUE
    this.api.getAction('checkUser', {email: this.email, password: this.password}).subscribe( data => {
      console.log(data);
      var d = data.json();
      console.log(d);
      if(d.msg == 'OK'){

        //IS OK
        this.userAuth.logUser(this.email, this.password, d.table);

        if(d.table == 'usuarios_representantes'){
          this.navCtrl.setRoot(HomeRepPage);
        }else if(d.table == 'usuarios_microempresarios'){
          this.navCtrl.setRoot(HomePage);
        }


      }else if(d.msg == 'Device'){
        let alert = this.alert.create({
                  title: 'No permitido',
                  subTitle: 'No puedes iniciar sesión en más de un dispositivo, por favor cierra sesión en tus otros dispositivos para poder ingresar.',
                  buttons: ['Entendido']
                  });
                  alert.present();
      }else if(d.msg == 'User'){
        let alert = this.alert.create({
                  title: 'No existe el usuario',
                  subTitle: 'No pudimos encontrar al usuario '+this.email+'.',
                  buttons: ['Entendido']
                  });
                  alert.present();
      }else if(d.msg == 'PasswordChange'){
        let alert = this.alert.create({
                  title: 'Nuevo sistema',
                  subTitle: 'Por actualización es necesario que actualices tu contraseña.',
                  buttons: [{
                              text: 'Entendido',
                              handler: () => {
                                this.navCtrl.push(PasswordPagePage, {
                                  type : 'PasswordChange',
                                  email: this.email,
                                  table: d.table
                                });
                              }
                            }]
                  });
                  alert.present();
      }else if(d.msg == 'NoPassword'){
        let alert = this.alert.create({
                  title: 'Sin contraseña',
                  subTitle: 'Es necesario que configures una nueva contraseña.',
                  buttons: [{
                              text: 'Entendido',
                              handler: () => {
                                this.navCtrl.push(PasswordPagePage, {
                                  type : 'NoPassword',
                                  email: this.email,
                                  table: d.table
                                });
                              }
                            }]
                  });
                  alert.present();
      }else if(d.msg == 'Password'){
        let alert = this.alert.create({
                  title: 'Contraseña incorrecta',
                  subTitle: 'La contraseña es incorrecta.',
                  buttons: ['Entendido']
                  });
                  alert.present();

      }else if(d.msg == 'Status'){
        let alert = this.alert.create({
                  title: 'Error',
                  subTitle: 'Tu cuenta ha sido desactivada por la administración.',
                  buttons: ['Entendido']
                  });
                  alert.present();
      }else{
        let alert = this.alert.create({
                  title: 'Error desconocido',
                  subTitle: 'El servidor respondió con un mensaje desconocido: '+d.msg,
                  buttons: ['Entendido']
                  });
                  alert.present();
      }
      this.loading.dismiss();
    });
  }
  showForgottenPassword(){
    this.navCtrl.push(PasswordPagePage, {
      type : 'ForgottenPassword'
    });
  }

}
