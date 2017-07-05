import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { ApiCalls } from '../../providers/api-calls';
import { StatusBar } from '@ionic-native/status-bar';
import { Events } from 'ionic-angular';


/*
  Generated class for the MicroAnalisisMercado page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-analisis-mercado',
  templateUrl: 'micro-analisis-mercado.html',
  providers: [AlertController, CookieJS, Storage, ApiCalls, NetworkService, LoadingController]
})
export class MicroAnalisisMercadoPage {
  analisis = 'Lo sentimos, no hay información disponible.';
  isasesor = false;
  id = 0;
  textSave = '';
  constructor(public navCtrl: NavController, public events: Events,public storage: Storage, public loadingCtrl: LoadingController, public alert: AlertController, public network: NetworkService,  public api: ApiCalls, public cookie: CookieJS, public navParams: NavParams) {
    var isasesor = navParams.data.from;
    if(isasesor == 'asesor'){
      this.isasesor = true;
      this.id = navParams.data.id;
    }
  }
  saveReporte(){
    if(this.textSave.length < 200){
      let alert = this.alert.create({
        title: 'Faltan carácteres',
        subTitle: 'Por favor sé más detallado en tu reporte.',
        buttons: ['Entendido']
      });
      alert.present();
    }else{
      var col = 'analisis';
      var r = this.api.postAction('saveAnalisis', {col: col, text: this.textSave, id: this.id});
      r.subscribe(data => {
        this.events.publish('saveReporte', {});

        this.navCtrl.pop();
      })
      this.analisis = this.textSave;
    }
  }
  ionViewDidLoad() {
    var slug = 'microempresario_plan_accion';
    var inadem_sc_ = this.cookie.get('inadem_sc');
    var inadem_sc = JSON.parse(inadem_sc_);
    var params = {
      email: inadem_sc['email'],
      col: 'analisis_plan_accion',
      id: 0
    }
    if(this.id && this.isasesor){
      params.id = this.id
    }
    this.storage.ready().then( () => {
      var pred = this.storage.get(slug);
      pred.then( (val) => {
        if(val){
          var d = val._body;
           d = JSON.parse(d);
          this.analisis = d.msg;
        }else{
          if(this.network.isOffline()){
            let alert = this.alert.create({
              title: 'Sin conexión',
              subTitle: 'Lo sentimos, necesitas tener una conexión a internet para ver por primera vez esta información.',
              buttons: ['Entendido']
            });
            alert.present();
          }
        }
      })
    });

    if(this.network.isOnline()){
      let loading = this.loadingCtrl.create({
          content: 'Actualizando...'
      });
      var request = this.api.getAction('get_microempresario_reporte', params);
      request.subscribe( data => {
        var d = data.json();
        this.analisis = d.msg;
        this.storage.set(slug, data);
      })
    }




  }

}
