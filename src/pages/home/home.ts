import { Component , ViewChild} from '@angular/core';
import { NavController, AlertController, ModalController, Tabs, NavParams, App } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { CookieJS } from '../../providers/cookie-js';
import { LoginPage } from '../login/login';
import { MicroPerfilPage } from '../micro-perfil/micro-perfil';
import { MicroReportePage } from '../micro-reporte/micro-reporte';
import { MicroEvaluacionPage } from '../micro-evaluacion/micro-evaluacion';
import { ApiCalls } from '../../providers/api-calls';
import { MicroEditPage } from '../micro-edit/micro-edit';
import { CalculadoraEnergeticaPage } from '../calculadora-energetica/calculadora-energetica';
import { MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { AvisosPage } from '../avisos/avisos';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserAuth, CookieJS, ViewChild, ApiCalls, Storage]

})
export class HomePage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = MicroPerfilPage;
  tab2Root = MicroReportePage;

  currentUser = {
    user: ''
  }

  isevaluacion = false;

  constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public alert: AlertController, public api: ApiCalls, public navParams: NavParams, public appCtrl: App, public modCtrl: ModalController,  public userAuth: UserAuth, public cookie: CookieJS) {
    var isok = this.userAuth.islogged;
    var inadem_sc = this.cookie.get('inadem_sc');
        inadem_sc = JSON.parse(inadem_sc);
    if(!isok){
      this.navCtrl.push(LoginPage, {});
    }
    var r = this.api.getAction('isEvaluacionPending', {email: inadem_sc['email']});
    r.subscribe( data => {
      this.isevaluacion = data.json().msg;
      this.reminderEvaluacion();
    })
    /*
    this.setDeviceID();
    OneSignal.handleNotificationReceived().subscribe(() => {
      this.appCtrl.getRootNav().push(AvisosPage);
    });
    OneSignal.handleNotificationOpened().subscribe(() => {
      this.appCtrl.getRootNav().push(AvisosPage);
    });
    */
  }
  reminderEvaluacion(){
    var iscookieex = this.cookie.get('inadem_e_encuestaasesor');

    if(!iscookieex.length && this.isevaluacion){
      this.cookie.create('inadem_e_encuestaasesor', 'ok', 50);
      let alert = this.alert.create({
        title: 'Evalúa a tu asesor',
        subTitle: 'No olvides evaluar la visita que te otorgó el asesor. Esto nos ayuda a mejorar.',
        buttons: [ {
        text: 'Entendido',
        role: 'cancel',
          handler: () => {
          }
        },
      {
        text: 'Evaluar',
        handler: () => {
          this.appCtrl.getRootNav().push(MicroEvaluacionPage)
        }
      }
    ]
    });
  alert.present();
    }
  }
  ionViewDidLoad() {

    var index = this.navParams.data.index;
    if(index){
      this.tabRef.select(index);
    }

    var sc = this.cookie.get('inadem_sc');
    var sc_ = JSON.parse(sc);
    this.currentUser.user = sc_.email;
  }
  logout(){
    this.cookie.create('inadem_sc', '', -1);
    this.storage.clear();
    this.navCtrl.setRoot(LoginPage, {isLogout: true});
  }

  menuTo(page, index){
    this.menuCtrl.close();

    var p;
    switch(page){
      case "home":
        p = HomePage;
      break;
      case "evaluar":
        p = MicroEvaluacionPage;
      break;
      case "editar-informacion":
        p = MicroEditPage;
      break;
      case "calculadora":
        p = CalculadoraEnergeticaPage;
      break;
      case "avisos":
        p = AvisosPage;
      break;
    }
    if(p == HomePage){
      this.tabRef.select(index);
    }else{
      this.appCtrl.getRootNav().push(p, {index: index});
    }

  }

  setDeviceID(){
    /*
  OneSignal.startInit('2f9c5b83-2619-44ad-8506-ab3fd819ba3e', '593478426682');
  OneSignal.setSubscription(true);

  OneSignal.endInit();

  OneSignal.getIds().then(data => {
    if(data.userId){
      var r = this.api.getAction('setDeviceToken', {email: this.email, pushId: data.userId, table: 'asesor'});
      r.subscribe(data => {
        console.log(data);
      })
    }
  });
  */
  }

}
