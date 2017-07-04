import { Component , ViewChild} from '@angular/core';
import { NavController, ModalController,  AlertController, Tabs, NavParams, App } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { CookieJS } from '../../providers/cookie-js';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { ApiCalls } from '../../providers/api-calls';
import { NetworkService } from '../../providers/network-service';
import { MicroPerfilPage } from '../micro-perfil/micro-perfil';
import { MicroReportePage } from '../micro-reporte/micro-reporte';
import { MicroEvaluacionPage } from '../micro-evaluacion/micro-evaluacion';
import { InAppBrowser } from 'ionic-native';

/*
  Generated class for the MicroReporteMicro page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-reporte-micro',
  templateUrl: 'micro-reporte-micro.html',
  providers: [UserAuth, NetworkService, CookieJS, ViewChild, Storage, ApiCalls]

})
export class MicroReporteMicroPage {
  currentUserEmail: any;
  constructor(public navCtrl: NavController, public storage: Storage, public api: ApiCalls, public alert: AlertController,  public navParams: NavParams, public appCtrl: App, public modCtrl: ModalController,  public userAuth: UserAuth, public cookie: CookieJS, public network: NetworkService) {
    var sc = this.cookie.get('inadem_sc');
    var sc_ = JSON.parse(sc);
    this.currentUserEmail = sc_.email;
  }
  ionViewDidLoad() {
    var slug = 'microempresario_pdf_reporte';
    var isonline = this.network.isOnline();

    //Get the downloaded file

    this.storage.ready().then( () => {
      var pred = this.storage.get(slug);
      pred.then( (val) => {

      })
    })


    if(isonline){
      var request = this.api.getAction('get_microempresario_reporte_pdf', {email: this.currentUserEmail});

      request.subscribe(data => {
        var d = data.json();
        var msg = d.msg;
        if(msg == 'NoFile'){
          let alert = this.alert.create({
            title: 'Error',
            subTitle: 'Parece que tu reporte no ha sido generado, se está generando o hay algún problema con nuestro servidor. Intenta de nuevo.',
            buttons: [
                        {
                        text: 'Entendido',
                        handler: data => {
                                    this.navCtrl.pop();
                                  }
                          }
                        ]
          });
          alert.present();
        }else if(msg){

          new InAppBrowser(msg,'_system','location=yes');
          this.navCtrl.pop();
        }
      })
    }else{
      let alert = this.alert.create({
        title: 'Error',
        subTitle: 'Necesitas una conexión de internet para poder visualizar tu reporte.',
        buttons: [
                    {
                    text: 'Entendido',
                    handler: data => {
                                this.navCtrl.pop();
                              }
                      }
                    ]
      });
      alert.present();
    }




  }

}
