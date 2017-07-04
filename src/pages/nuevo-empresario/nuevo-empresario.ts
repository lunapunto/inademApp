import { Component } from '@angular/core';
import { NavController, App, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { AsesoriaLocPage } from '../asesoria-loc/asesoria-loc';
import { HomeRepPage } from '../home-rep/home-rep';
import { EncuestaPage } from '../encuesta/encuesta';
import { PhotosPage } from '../photos/photos';
import { Events } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Geolocation } from 'ionic-native';
import { Storage } from '@ionic/storage';

declare var Timer;
/*
  Generated class for the NuevoEmpresario page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nuevo-empresario',
  templateUrl: 'nuevo-empresario.html',
  providers: [ApiCalls, CookieJS, Storage]
})
export class NuevoEmpresarioPage {
  tab1Root = AsesoriaLocPage;
  tab2Root = EncuestaPage;
  tab3Root = PhotosPage;

  self : any;
  isoktime = false;
  time = '00:00:00';
  timer : any;
  inpause = false;
  timestamp : any;
  finalsendServer = {
    encuesta: '',
    photos: '',
    geoloc: '',
    timestamp: 0,
    finaltime: '',
    emailAsesor: ''
  }
  no_geo: any;
  inter = false;
  starttime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    secondsTenths: 0
  };
  constructor(public navCtrl: NavController, public storage: Storage, public cookie: CookieJS, public events: Events, public loading: LoadingController, public api: ApiCalls, public appCtrl: App, public alert: AlertController, public navParams: NavParams) {
    var scs = this.cookie.get('inadem_sc');
        scs = JSON.parse(scs);
    var self = this;
    this.finalsendServer.emailAsesor = scs;
    this.finalsendServer.timestamp = Math.floor(Date.now() / 1000);
    events.subscribe('encuestaSubmit', data => {
      this.finalsendServer.encuesta = data;

    });

    events.subscribe('geolocSubmit', data => {
      this.finalsendServer.geoloc = data;
      data = JSON.parse(data);
      this.addGeofence(data.lat, data.lng);
    });
    events.subscribe('photosSubmit', data => {
      this.finalsendServer.photos = data;
      this.timer.pause();

      if(!this.inpause){
        this.finishIt();
        this.inpause = true;
      }


    });
  }
  measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
  }

  addGeofence(latitude, longitude) {
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    var self = this;
    let watch = Geolocation.watchPosition();

    watch.subscribe( data => {
      var lat = data.coords.latitude;
      var lng = data.coords.longitude;
      var d = self.measure(latitude, longitude, lat, lng);

      if(1000 < d && this.inter == false){
        self.inter = true;
        let alert = self.alert.create({
          title: 'Fuera de radio',
          subTitle: 'Tu visita fue cerrada porque estás a más de 1km. del negocio.',
          buttons: ['OK']
        });
        //alert.present();
        //self.appCtrl.getRootNav().setRoot(HomeRepPage);
      }
    })
  }

  finishIt(){
    var self = this;



    let loading = this.loading.create({
      content: 'Creando microempresario...'
    });
    loading.present();
    var r = this.api.postAction('new_microempresario', this.finalsendServer);
    r.subscribe(data => {
      var d = data.json();
      loading.dismiss();
      var $convocatoria = d.conv;
      if($convocatoria == '4.1 Desarrollo de Capacidades Empresariales para Microempresas' || $convocatoria == '5.2 Desarrollo de Capacidades Empresariales para Microempresas a través de la incorporación de Tecnologías de la Información y Comunicaciones(TIC’s)'){
        var msg = 'El microempresario ha sido creado y ahora puede iniciar sesión. Menciónale que su usuario es su correo electrónico, podrá configurar su contraseña iniciando sesión por primera vez.';
      }else{
        var msg = 'El microempresario ha sido creado y ahora puede iniciar sesión.';

      }
      var d = data.json();
      let alert = this.alert.create({
        title: 'Microempresario creado',
        subTitle: msg,
        buttons: ['Entendido']
      });
      alert.present();
      var storage = self.storage;
      storage.ready().then(() => {
         storage.set('form', []);
      });
      self.starttime = {
        seconds: 0,
        minutes: 0,
        hours:  0,
        secondsTenths: 0
      };
      self.saveTime();
      this.navCtrl.setRoot(HomeRepPage);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoEmpresarioPage');
    this.timer = new Timer();
    var self = this;
    var timer = this.timer;
    var storage = this.storage;

    storage.get('startTime').then((val) => {

      if(!val){
        self.starttime = {
          seconds: 0,
          minutes: 0,
          hours:  0,
          secondsTenths: 0
        };
      }else{
        self.starttime = val;
      }
      timer.start({startValues: self.starttime, precision: 'seconds'});

      timer.addEventListener('secondsUpdated', function (e) {
        self.time = timer.getTimeValues().toString();
        self.finalsendServer.finaltime =  timer.getTimeValues();
        self.starttime = {
          seconds: timer.getTimeValues().seconds,
          minutes: timer.getTimeValues().minutes,
          hours:  timer.getTimeValues().hours,
          secondsTenths: timer.getTotalTimeValues().secondTenths
        };
        self.saveTime();
      });
      timer.addEventListener('started', function (e) {
        self.time = timer.getTimeValues().toString();
        self.finalsendServer.finaltime =  timer.getTimeValues();
      });

    });

  }

  saveTime(){
    var storage = this.storage;
    storage.ready().then(() => {
       storage.set('startTime', this.starttime);
    });
  }

  pauseTime(){
    this.timer.pause();
    this.inpause = true;
    var self = this;
    let alert = this.alert.create({
      title: 'Asesoría en pausa',
      subTitle: 'Tu asesoría está en pausa. Para volver a ella da click en reanudar.',
      buttons: [
        {
          text: 'Cancelar asesoría',
          handler: () => {
            var storage = self.storage;
            storage.ready().then(() => {
               storage.set('form', []);
            });
            self.starttime = {
              seconds: 0,
              minutes: 0,
              hours:  0,
              secondsTenths: 0
            };
            self.saveTime();
            this.appCtrl.getRootNav().setRoot(HomeRepPage);
          }
        },
        {
        text: 'Reanudar',
        handler: () => {
          this.inpause = false;
          this.timer.start();
          alert.dismiss();
        }
      }]
    });
    alert.present();
  }

}
