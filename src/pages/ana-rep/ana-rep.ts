import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
/*
  Generated class for the AnaRep page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ana-rep',
  templateUrl: 'ana-rep.html',
  providers: [ApiCalls]
})
export class AnaRepPage {
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
  constructor(public navCtrl: NavController, public api: ApiCalls, public navParams: NavParams) {
    var id = navParams.data.id;
    this.id = id;
  }

  ionViewDidLoad() {
    var params = {
      id: this.id,
      byid: true
    };

    var self = this;

    var request = this.api.getAction('get_microempresario_reportes_meta', params);
    request.subscribe( data => {
      var d = data.json();
        this.analisis = d;
      })
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

}
