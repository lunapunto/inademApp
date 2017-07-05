import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { ApiCalls } from '../../providers/api-calls';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';

/*
  Generated class for the MicroEvaluacion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-evaluacion',
  templateUrl: 'micro-evaluacion.html',
  providers: [NetworkService, CookieJS, Storage,ApiCalls]
})
export class MicroEvaluacionPage {

  data = {
      temas: '',
      six_hours: '',
      exp: '',
      reco: '',
      dispositivo: '',
      exphard: '',
      exphardware_combo: '',
      email: '',
      temashoras: ''
  };

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public api: ApiCalls, public storage: Storage, public cookie: CookieJS, public network: NetworkService, public navParams: NavParams, public alert: AlertController) {

  }

  ionViewDidLoad() {

    var slug = 'microempresario_asesor_calif';


    this.storage.ready().then( () => {
      var pred = this.storage.get(slug);
      pred.then( (val) => {
        if(val){
          this.data = val;
        }
      })
    })
  }

  submitEvaluacion(){
    console.log(this.data);
    var isonline = this.network.isOnline();
    var slug = 'microempresario_asesor_calif';
    var inadem_sc = this.cookie.get('inadem_sc');
    inadem_sc = JSON.parse(inadem_sc);
    var email = inadem_sc['email'];
    this.data.email = email;
      if(isonline){
        var loading = this.loadingCtrl.create({
                        content: 'Enviando...'
                      });
       loading.present();

       this.storage.set(slug, this.data);

       var request = this.api.getAction('set_encuesta_micro', this.data);
       request.subscribe( data => {
         var d = data.json();
         console.log(d);
         loading.dismiss();
         let alert = this.alert.create({
           title: '¡Muchas gracias!',
           subTitle: 'Tu evaluación ha sido enviada exitosamente.',
           buttons: ['Entendido']
         })
         alert.present();
         this.navCtrl.setRoot(HomePage, {isEncuesta: true});
       })

      }else{
        let alert = this.alert.create({
          title: 'Sin conexión',
          subTitle: 'Lo sentimos, es necesario que tengas conexión a internet para enviar tu evaluación.',
          buttons: ['Entendido'],
        });
        alert.present();
      }




  }

}
