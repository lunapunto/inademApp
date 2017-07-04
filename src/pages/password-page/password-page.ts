import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';
import { ApiCalls } from '../../providers/api-calls';
import { LoginPage } from '../login/login';
import { StatusBar, Splashscreen } from 'ionic-native';

/*
  Generated class for the PasswordPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-password-page',
  templateUrl: 'password-page.html',
  providers: [AlertController, NetworkService, ApiCalls]
})
export class PasswordPagePage {
  title : any;
  instructions: any;
  emaildisabled = true;
  email: any;
  emailv: any;
  table: any;
  password: any;
  isLoading = false;
  rpassword: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert : AlertController, public network : NetworkService, public api : ApiCalls) {
    StatusBar.backgroundColorByHexString('#222222');

  }

  ionViewDidLoad() {
    var type = this.navParams.data.type;
    if(type == 'NoPassword'){
      this.title = 'Nueva contraseña';
      this.instructions = 'Bienvenido, por favor ingresa una contraseña para tu cuenta.'
      this.email = this.navParams.data.email;
      this.table = this.navParams.data.table;
    }else if('PasswordChange' == type){
      this.title = 'Nueva contraseña';
      this.instructions = 'Bienvenido al nuevo sistema, por favor introduce una nueva contraseña.'
      this.email = this.navParams.data.email;
      this.table = this.navParams.data.table;
    }else if('ForgottenPassword' == type){
      this.title = 'Recuperar contraseña';
      this.instructions = 'Introduce tu usuario y tu nueva contraseña.'
      this.emaildisabled = false;
    }

  }


  setpassword(){


    if(!this.password || !this.rpassword || !this.email){
      let alert = this.alert.create({
                title: 'Error',
                subTitle: 'Falta algún campo. Por favor revísalo y vuélvelo a intentar.',
                buttons: ['Entendido']
                });
                alert.present();

    }else{
    if(this.password !== this.rpassword){
      let alert = this.alert.create({
                title: 'Error',
                subTitle: 'Las contraseñas no coinciden.',
                buttons: ['Entendido']
                });
                alert.present();
    }else{

      this.isLoading = true;

      var isonline = this.network.isOnline();

      if(isonline){
        this.api.getAction('changePassword', {email: this.email, password: this.password}).subscribe( data => {
            var d = data.json();
            if(d.msg == 'OK'){
              let alert = this.alert.create({
                        title: 'Cambios guardados',
                        subTitle: 'Tu contraseña ha sido cambiada con éxito, por favor ingresa de nuevo al sistema.',
                        buttons: [{
                                    text: 'Entendido',
                                    handler: () => {
                                      this.navCtrl.push(LoginPage, {
                                        email: this.email
                                      });
                                    }
                                  }]
                        });
                        alert.present();
            }else if(d.msg == 'User'){
              let alert = this.alert.create({
                        title: 'No existe el usuario',
                        subTitle: 'No tenemos registro del usuario '+this.email+', por favor verifica tu información.',
                        buttons: ['Entendido']
                        });
                        alert.present();

              this.isLoading = false;
            }else{
              let alert = this.alert.create({
                        title: 'Error desconocido',
                        subTitle: 'Ocurrió un error desconocido, es probable que se deba a un problema con tu conexión de internet. Por favor intenta de nuevo.',
                        buttons: ['Entendido']
                        });
                        alert.present();

              this.isLoading = false;
            }
        });
      }else{
        let alert = this.alert.create({
                  title: 'Sin internet',
                  subTitle: 'Necesitas una conexión de internet para poder cambiar tu contraseña.',
                  buttons: ['Entendido']
                  });
                  alert.present();

        this.isLoading = false;
      }


    } //END IF
    }

  }

}
