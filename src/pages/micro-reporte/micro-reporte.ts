import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, App } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network-service';
import { MicroPlanAccionPage } from '../micro-plan-accion/micro-plan-accion';
import { MicroPlanFinanciamientoPage } from '../micro-plan-financiamiento/micro-plan-financiamiento';
import { MicroReporteMicroPage } from '../micro-reporte-micro/micro-reporte-micro';
import { MicroAnalisisMercadoPage } from '../micro-analisis-mercado/micro-analisis-mercado';
import { InAppBrowser } from 'ionic-native';

/*
  Generated class for the MicroReporte page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-reporte',
  templateUrl: 'micro-reporte.html',
  providers: [UserAuth,ApiCalls, CookieJS, Storage, NetworkService, AlertController]

})
export class MicroReportePage {
  analisis = {
    fecha_analisis_plan_accion: '',
    fecha_analisis_financiamiento: '',
    analisis_plan_accion_status: false,
    analisis_financiamiento_status: false,
    analisis_status: false,
    reportePDF: false,
    existeReportePDF: false,
    isok_plan_accion: false,
    isok_financiamiento: false,
    isok_analisis: false,
    isok_reporte: false
  };
  email = '';
  constructor(public navCtrl: NavController, public appCtrl: App, public navParams: NavParams, public alert: AlertController, public storage: Storage, public userAuth: UserAuth, public api: ApiCalls, public cookie: CookieJS, public network: NetworkService) {}

  ionViewDidLoad() {
    var inadem_sc_ = this.cookie.get('inadem_sc');
    var inadem_sc = JSON.parse(inadem_sc_);
    this.email = inadem_sc['email'];
    var params = {
      email: inadem_sc['email']
    }

    this.storage.ready().then( () => {
      // Try to get microempresario analisis meta
      var pred = this.storage.get('microempresario_analisis_group');
      pred.then( (val) => {
        if(val){
          var d = val._body;
           d = JSON.parse(d);

          this.analisis = d;
        }else{
          if(this.network.isOffline()){
            let alert = this.alert.create({
              title: 'Sin conexión',
              subTitle: 'Lo sentimos, necesitas tener una conexión a internet para ver por primera vez tu perfil.',
              buttons: ['Entendido']
            });
            alert.present();
          }
        }
      })
    })

    var request = this.api.getAction('get_microempresario_reportes_meta', params);
    request.subscribe( data => {
      var d = data.json();
        this.analisis = d;
        this.storage.set('microempresario_analisis_group', data);
    })

  }

  pushAnalisis(slug){
    var self = this;
    var ap = this.api.getAction('get_link_anarep', {table: slug, email: this.email});
    ap.subscribe( data => {
      var d = data.json();
      var url = d.url;
      window.open(url, '_system', 'location=yes')

    })

  }

}
