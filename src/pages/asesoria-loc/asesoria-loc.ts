import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, App, AlertController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HomeRepPage } from '../home-rep/home-rep';
import { EncuestaPage } from '../encuesta/encuesta';
import { Events } from 'ionic-angular';
declare var google;
/*
  Generated class for the AsesoriaLoc page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-asesoria-loc',
  templateUrl: 'asesoria-loc.html',
  providers: [Geolocation]
})
export class AsesoriaLocPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latlng: any;
  form = { latlng: {}, validlatlng: false };
  constructor(public navCtrl: NavController, public events: Events,  private geolocation: Geolocation, public appCtrl: App,public alert: AlertController,  public loading: LoadingController, public navParams: NavParams) {}

  ngOnInit(){
      this.getPosition();

  }

  getPosition() {
    var loading = this.loading.create({
                    content: "Detectando ubicación actual..."
                  });
    loading.present();
    var options = {
      enableHighAccuracy: true,
      maximumAge: 0
    };
    var self = this;
    self.geolocation.getCurrentPosition().then((resp) => {
      loading.dismiss();
      console.log(resp);
      var latlng = { lat: resp.coords.latitude , lng: resp.coords.longitude};
      self.form.latlng = latlng;
      self.form.validlatlng = true;
      self.latlng = latlng;
      self.loadMap();
    }).catch((error) => function(resp){
      loading.dismiss();
      let alert = self.alert.create({
        title: 'Error',
        subTitle: 'No pudimos determinar tu ubicación, por favor activa tu localización.',
        buttons: [
          {
            text: 'Cancelar asesoría',
            handler: () => {
              self.appCtrl.getRootNav().setRoot(HomeRepPage);
            }
          },
          {
          text: 'Intentar de nuevo',
          handler: () => {
            self.getPosition();
          }
        }]
      });
      alert.present();
    });


    /*
    this.geolocation.getCurrentPosition({timeout: 30000}).then((resp) => {
      loading.dismiss();
      console.log(resp);
      var latlng = { lat: resp.coords.latitude , lng: resp.coords.longitude};
      this.form.latlng = latlng;
      this.form.validlatlng = true;
      this.latlng = latlng;
      this.loadMap();

    }).catch((error) => {
      loading.dismiss();
      let alert = this.alert.create({
        title: 'Error',
        subTitle: 'No pudimos determinar tu ubicación, por favor activa tu localización.',
        buttons: [
          {
            text: 'Cancelar asesoría',
            handler: () => {
              this.appCtrl.getRootNav().setRoot(HomeRepPage);
            }
          },
          {
          text: 'Intentar de nuevo',
          handler: () => {
            this.getPosition();
          }
        }]
      });
      alert.present();

    });
    */

  }

  loadMap(){

    let latLng = new google.maps.LatLng(this.latlng.lat, this.latlng.lng);

    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    var color = '#72BF44';
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let marker = new google.maps.Marker({
        map: this.map,
        position: this.map.getCenter(),
        icon: 'assets/marker.png'
      });

      var cityCircle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.45,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.15,
      map: this.map,
      center: this.map.getCenter(),
      radius: 500
      });
  }


  goToNext(index){
    this.events.publish('geolocSubmit', JSON.stringify(this.form.latlng));
    this.navCtrl.parent.select(index);
  }

}
