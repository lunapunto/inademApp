import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
/*
  Generated class for the Avisos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
  providers: [ApiCalls]
})
export class AvisosPage {
  avisos: any;
  constructor(public navCtrl: NavController, public api: ApiCalls,public navParams: NavParams) {}

  ionViewDidLoad() {
    var r = this.api.getAction('getAvisos', {});
    r.subscribe( data => {
      var d = data.json();
      this.avisos = d;
    })
  }

}
