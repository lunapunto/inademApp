import { Component, ViewChild } from '@angular/core';
import { NavController, App, AlertController, LoadingController, NavParams, Tabs } from 'ionic-angular';
import { AsesoriaProfilePage } from '../asesoria-profile/asesoria-profile';
import { AsesoriaAnalisisPage } from '../asesoria-analisis/asesoria-analisis';
import { NetworkService } from '../../providers/network-service';
import { ApiCalls } from '../../providers/api-calls';
import { Geolocation } from 'ionic-native';
import { HomeRepPage } from '../home-rep/home-rep';
import { Events } from 'ionic-angular';

declare var Timer;

/*
  Generated class for the Asesoria page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-asesoria',
  templateUrl: 'asesoria.html',
  providers: [NetworkService,ApiCalls]
})
export class AsesoriaPage {
  visita: any;
  tab1Root = AsesoriaProfilePage;
  tab2Root = AsesoriaAnalisisPage;
  id = 0;
  self : any;
  isoktime = false;
  time = '00:00:00';
  timer : any;
  inpause = false;
  loadingCreating: any;
  vparams: any;
  is_analisis = false;
  inter = false;
  constructor(public navCtrl: NavController, public events: Events, public appCtrl: App, public alert: AlertController, public api: ApiCalls, public loading: LoadingController, public network: NetworkService, public navParams: NavParams) {
    var id = navParams.data.idnegocio;
    this.timer = null;
    var params = navParams.data.newvisitaParams;
    this.vparams = params;
    this.id = id;

    this.is_analisis = this.vparams.ent.isokconv;
    var self = this;
    this.events.subscribe('endVisita',function(){
      self.cancelVisita(false);
    });

  }
  ionViewDidLoad() {
    this.timer = new Timer();
    var timer = this.timer;
    var tims = this.vparams.currents;
    timer.start({startValues: {hours: tims.hours, minutes: tims.minutes, seconds: tims.seconds}});
    var self = this;
    timer.addEventListener('secondsUpdated', function (e) {
      self.time = timer.getTimeValues().toString();
      var seconds = timer.getTimeValues().seconds;
      if(seconds == 30 || seconds == 0){
        self.preSave();
      }
    });
  }

  ionViewDidEnter

  addGeofence(latitude, longitude) {
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    var self = this;
    let watch = Geolocation.watchPosition({enableHighAccuracy: true});

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
        alert.present();
        self.cancelVisita(true);
      }
    })
  }

  measure(lat1, lon1, lat2, lon2){
    var R = 6378.137;
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
  }

  pauseTime(){
    this.timer.pause();
    this.inpause = true;
    let alert = this.alert.create({
      title: 'Visita en pausa',
      subTitle: 'Tu visita está en pausa. Para volver a ella da click en reanudar.',
      buttons: [
        {
          text: 'Terminar visita',
          handler: () => {
            this.preCancelVisita()
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

  preCancelVisita(){
    let alert = this.alert.create({
      title: '¿Concluir visita?',
      subTitle: '¿Deseas concluir esta visita?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.cancelVisita(false)
          }
        }
      ]
    });
    alert.present();
  }

  preSave(){
    let r = this.api.getAction('presave_visita', {id: this.vparams.idvisita, totalTime: this.time });
    r.subscribe(data => {
    })
  }

  cancelVisita(ignoreGeo){
    var idnegocio = this.id;
    var self = this;
    if(this.network.isOnline()){
      let r = this.api.getAction('get_negocio_coords', {id: idnegocio});
      r.subscribe(data => {
        var d = data.json();
        var old_lat = d.lat;
        var old_lng = d.lng;


        var loading = this.loading.create({
                        content: "Detectando ubicación actual..."
                      });
        if(!ignoreGeo){
          loading.present();
        }

        var options = {
          enableHighAccuracy: true,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(function(resp){
          var latlng = { lat: resp.coords.latitude , lng: resp.coords.longitude};
          var lat = latlng.lat;
          var lng = latlng.lng;

          var difference = self.measure(lat, lng, old_lat, old_lng);

          loading.dismiss();


          if(1000 < Math.round(difference) && !ignoreGeo){
            let alert = self.alert.create({
              title: 'Error',
              subTitle: 'Para terminar esta visita necesitas estar a un máximo de 1km del negocio, actualmente te encuentras a '+ Math.round(difference)+' metros de distancia.',
              buttons: ['Entendido']
            });
            alert.present();
          }else{
            var r = self.api.getAction('cancel_visita', {totalTime: self.time, id: self.vparams.idvisita, lat: lat, lng: lng});
            r.subscribe(data => {
              var d = data.json();
              self.navCtrl.setRoot(HomeRepPage, {});
            })
          }
        }, function(resp){
          loading.dismiss();
          let alert = self.alert.create({
            title: 'Error',
            subTitle: 'No pudimos determinar tu ubicación, por favor activa tu localización para poder concluir esta visita.',
            buttons: ['Entendido']
          });
          alert.present();
        }, options)




      }) // END API REQUEST
    }else{
      let alert = this.alert.create({
        title: 'Error',
        subTitle: 'Para iniciar tu visita es necesario que cuentes con una conexión a internet.',
        buttons: ['Entendido']
      });
      alert.present();
    }


  }


}
