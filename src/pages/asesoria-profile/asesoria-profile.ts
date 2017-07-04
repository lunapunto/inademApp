import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network-service';

/*
  Generated class for the AsesoriaProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-asesoria-profile',
  templateUrl: 'asesoria-profile.html',
  providers: [UserAuth, ApiCalls, CookieJS, Storage, NetworkService, AlertController]
})
export class AsesoriaProfilePage {
  microempresario = {
    nombre: '',
    usuario: '',
    tel: '',
    giro: '',
    pic: '',
    edad: '',
    nombre_negocio: '',
    convocatoria: '',
    entregables: ''
  }
  id: any;
  isloaded = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public storage: Storage, public userAuth: UserAuth, public api: ApiCalls, public cookie: CookieJS, public network: NetworkService) {
    var id = navParams.data.idnegocio;
    this.id = id;
  }


  ionViewDidLoad() {


    var params = {
      id: this.id,
      byid: true
    }


    var request = this.api.getAction('get_microempresario', params);
    request.subscribe( data => {
      var d = data.json();
        this.microempresario = d;
        console.log(d);
        this.isloaded = true;
    })


  }

}
