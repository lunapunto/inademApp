import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams, App } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network-service';
import { MicroPlanAccionPage } from '../micro-plan-accion/micro-plan-accion';
import { MicroPlanFinanciamientoPage } from '../micro-plan-financiamiento/micro-plan-financiamiento';
import { MicroReporteMicroPage } from '../micro-reporte-micro/micro-reporte-micro';
import { MicroAnalisisMercadoPage } from '../micro-analisis-mercado/micro-analisis-mercado';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Events } from 'ionic-angular';
import { ViewPDFPage } from '../view-pdf/view-pdf';
import { FileOpener } from '@ionic-native/file-opener';


declare var Timer;

/*
  Generated class for the AsesoriaAnalisis page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-asesoria-analisis',
  templateUrl: 'asesoria-analisis.html',
  providers: [UserAuth, FileOpener, ApiCalls, CookieJS, Storage, NetworkService, AlertController, BatteryStatus]
})
export class AsesoriaAnalisisPage {
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
  id = 0;
  isclosing = false;
  timer : any;
  isgenerating = false;
  localdev = false;
  timeOut : any;
  constructor(public navCtrl: NavController, private fileOpener: FileOpener, public events: Events, public loading: LoadingController, public appCtrl: App, public navParams: NavParams, public alert: AlertController, public storage: Storage, public userAuth: UserAuth, public api: ApiCalls, public cookie: CookieJS, public network: NetworkService) {
    var id = navParams.data.idnegocio;
    this.id = id;
    var self = this;
    events.subscribe('saveReporte', function(){
      self.loadReportes();
    })
  }

  ionViewDidLoad(){
    this.loadReportes();

  }
  ionViewDidEnter(){
    this.loadReportes();
  }
  loadReportes() {
    var params = {
      id: this.id,
      byid: true
    };

    var self = this;

    var request = this.api.getAction('get_microempresario_reportes_meta', params);
    request.subscribe( data => {
      var d = data.json();
        this.analisis = d;

        console.log(d);
        /*
        var isgenerating = d.isgenerating;
        if(isgenerating && !d.isok_reporte){
          this.isgenerating = true;
          this.okGenerate();
        }*/

        this.storage.set('microempresario_analisis_group', data);

        var a = d;

    })
  }

  okGenerate(){
    var self = this;
    clearTimeout(this.timeOut);
    this.isgenerating = true;
    /*
    this.timer = new Timer();
    var timer = this.timer;
    timer.start();
    var self = this;
    timer.addEventListener('secondsUpdated', function (e) {
      self.time = timer.getTimeValues().toString();
    });
    */
    var r = this.api.getAction('createReporte', {id: this.id});
    r.subscribe(data => {
      var d = data.json();
      if(d.msg == 'ok'){
        let alert = this.alert.create({
          title: 'Reporte Creado',
          subTitle: 'El reporte fue creado con éxito. Para visualizarlo selecciona la opción "Reporte de micromercado" en la pantalla de Visualización de Microempresario.',
          buttons: ['Entendido']
        });
        alert.present();
        self.loadReportes();
        self.isgenerating = false;
        clearTimeout(self.timeOut);
      }else{
        self.timeOut = setTimeout(function(){
          self.okGenerate();
        }, 60000);
      }
    });


  }
  generateReporte(){
    if(this.network.isOnline() && !this.isgenerating){

      let alert = this.alert.create({
        title: '¿Generar reporte?',
        subTitle: 'Para generar el reporte necesitarás tener una conexión a internet y estar a menos de un 1km del negocio durante todo el tiempo de la generación.',
        buttons: [
          {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
        text: 'Continuar',
        handler: () => {
          this.okGenerate();
        }
      }
    ]
      });
      alert.present();
    }else if(this.isgenerating){
      let alert = this.alert.create({
        title: 'Reporte',
        subTitle: 'Tu reporte sigue siendo generado, por favor sé paciente.',
        buttons: ['Entendido']
      });
      alert.present();
    }else{
      let alert = this.alert.create({
        title: 'Sin conexión',
        subTitle: 'Para generar el reporte necesitas una conexión a internet.',
        buttons: ['Entendido']
      });
      alert.present();
    }

  }
  pushAnalisis(slug){
    var self = this;
    var ap = this.api.getAction('get_link_anarep', {table: slug, id: this.id});
    ap.subscribe( data => {
      var d = data.json();
      var url = d.url;

      window.open(url, '_system', 'location=yes')
    });
  }
  pushAnalisisDos(slug){
    var page;
    switch(slug){
      case "plan_accion":
        page = MicroPlanAccionPage;
      break;
      case "plan_financiamiento":
        page = MicroPlanFinanciamientoPage;
      break;
      case "analisis_micromercado":
        page = MicroAnalisisMercadoPage;
      break;
      case "reporte_micromercado":
        page = MicroReporteMicroPage;
      break;
    }
    this.appCtrl.getRootNav().push(page, {from: 'asesor', id: this.id});
  }

}
