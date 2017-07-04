import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network-service';
import { StatusBar, Splashscreen } from 'ionic-native';

/*
  Generated class for the MicroEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-edit',
  templateUrl: 'micro-edit.html',
  providers: [UserAuth, ApiCalls, CookieJS, Storage, NetworkService, AlertController]
})
export class MicroEditPage {
  email: any;
  tel: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alert: AlertController, public storage: Storage, public userAuth: UserAuth, public api: ApiCalls, public cookie: CookieJS, public network: NetworkService) {
    StatusBar.backgroundColorByHexString('#222222');

  }

  ionViewDidLoad() {
    var inadem_sc = this.cookie.get('inadem_sc');
        inadem_sc = JSON.parse(inadem_sc);

    var params = {
      email: inadem_sc['email']
    }
    if(this.network.isOnline()){
      var request = this.api.getAction('get_microempresario', params);
      request.subscribe( data => {
        var d = data.json();
        this.email = d.usuario;
        this.tel = d.tel;
      })
    }else{
      let alert = this.alert.create({
        title: 'Sin conexión',
        subTitle: 'Lo sentimos, no es posible editar tus datos sin una conexión a internet.',
        buttons: [ {
        text: 'Entendido',
        role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
      });
      alert.present();
    }

  }
  editMicroInfo(){

    if(this.email){
      var inadem_sc = this.cookie.get('inadem_sc');
          inadem_sc = JSON.parse(inadem_sc);
      var params = {
        email: this.email,
        tel: this.tel,
        oldemail: inadem_sc['email']
      }
      if(this.network.isOnline()){
        let loading = this.loadingCtrl.create({
          content: 'Editando...'
        });
        loading.present();
        var request = this.api.getAction('edit_microempresario', params);
        request.subscribe( data => {
          this.userAuth.logUser(this.email, 'iaskjsaksd', 'usuarios_microempresarios');
          loading.dismiss();
          let alert = this.alert.create({
            title: 'Éxito',
            subTitle: 'Los datos han sigo guardados.',
            buttons: ['Entendido']
          });
          alert.present();
          this.navCtrl.pop();

        })
      }else{
        let alert = this.alert.create({
          title: 'Sin conexión',
          subTitle: 'Lo sentimos, no es posible editar tus datos sin una conexión a internet.',
          buttons: [ {
          text: 'Entendido',
          role: 'cancel',
            handler: () => {
              this.navCtrl.popToRoot();
            }
          }
        ]
        });
        alert.present();
      }
    }else{
      let alert = this.alert.create({
        title: 'Faltan campos',
        subTitle: 'Por favor revisa que todos los campos estén completos.',
        buttons: ['Entendido']
      });
      alert.present();
    }


  }

}
