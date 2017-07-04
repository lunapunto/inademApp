import { Component } from '@angular/core';
import { NavController, App, LoadingController, Platform, MenuController, AlertController, NavParams } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { LoginPage } from'../login/login';
import { CallNumber } from 'ionic-native';
import { OneSignal } from 'ionic-native';
import { AvisosPage } from '../avisos/avisos';
import { NuevoEmpresarioPage } from '../nuevo-empresario/nuevo-empresario';
import { AsesoriaPage } from '../asesoria/asesoria';
import { NetworkService } from '../../providers/network-service';
import { Geolocation } from '@ionic-native/geolocation';
import { VerMicroempresarioPage} from '../ver-microempresario/ver-microempresario';
import { AppAvailability } from '@ionic-native/app-availability';
import { PhotosPage } from '../photos/photos';
/*
  Generated class for the HomeRep page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home-rep',
  templateUrl: 'home-rep.html',
  providers: [Geolocation,CookieJS,ApiCalls,Storage,AppAvailability,CallNumber,NetworkService]
})
export class HomeRepPage {
  arrayOfKeys: any[];
  email = '';
  isvisitas = false;
  visitas = [];
  dates = [];
  isfake = 0;
  localdev = false;
  bundleids = [
    'com.lkr.fakelocation',
    'com.fakegps.mock',
    'com.incorporateapps.fakegps.fre',
    'com.idans.locationfaker',
    'com.lexa.fakegps',
    'org.hola.gpslocation',
    'com.usefullapps.fakegpslocationpro',
    'sinhhuynh.map.fakelocation',
    'com.idans.fakelocation',
    'com.ltp.fakelocation'
  ];

  constructor(public platform: Platform, public geolocation: Geolocation, public navCtrl: NavController,private appAvailability: AppAvailability,public loading: LoadingController,   public network: NetworkService, public appCtrl: App, public menuCtrl: MenuController, public alert: AlertController,public storage: Storage, public navParams: NavParams, public cookie: CookieJS, public api: ApiCalls) {
    var scs = this.cookie.get('inadem_sc');
        scs = JSON.parse(scs);
    this.email = scs['email'];
    this.fetchVisitas(false);

    var pushto = navParams.data.pushtomicro;
    if(pushto){
      this.showAsesoria(pushto);
    }
    if(this.platform.is('android')){
      this.setDeviceID();
    }

  }
  ionViewDidLoad(){
    var self = this;
    self.checkFake();
  }
  showLegal(){
    window.open('https://app.descifrainadem.mx/legal.pdf', '_system', 'location=yes')
  }

  checkFake(){
    var self = this;
    if(window['plugins']){
      window['plugins'].fakeLocation.check(function(IsEnabledMockLocations){
          var isfake = IsEnabledMockLocations;

          if(self.platform.is('android') && !isfake){
            var bids = self.bundleids;
            bids.forEach(function(e, index){

              if(!isfake){
                self.appAvailability.check(e)
                    .then( data => {
                      isfake = 1;
                      self.isfake = 1;
                      console.log('Aplicación '+ e +' está instalada.');
                    }, error => {
                      console.log('Aplicación '+ e +' no está instalada.');

                    })
              }
            });



          }else{
            self.isfake = isfake;
          }

      });
    }

  }

  fetchVisitas(refresher) {
    this.checkFake();
    var r = this.api.getAction('getVisitasFromAsesor', {email: this.email});
    r.subscribe(data => {
      var d = data.json();
      this.visitas = d;
      this.arrayOfKeys = Object.keys(d);
      if(refresher){
        refresher.complete();
      }
      if(this.arrayOfKeys.length){
        this.isvisitas = true;
      }
    })
  }
  promptSoporte(){
    var number = '5556610138';
    let prompt = this.alert.create({
      title: '¿Llamar a soporte?',
      message: '¿Marcar al número '+number+' de soporte del INADEM?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            CallNumber.callNumber(number, true);
          }
        }
      ]
    });
    prompt.present();
  }
  doRefresh(refresher){
    this.fetchVisitas(refresher);
  }
  proceedLogout(){
    if(this.network.isOnline()){
      var r = this.api.getAction('logoutRep', {email: this.email});
      r.subscribe(data => {
        this.cookie.create('inadem_sc', '', -1);
        this.storage.clear();
        this.navCtrl.setRoot(LoginPage, {isLogout: true});
      })
    }else{
      let alert = this.alert.create({
        title: 'Sin conexión',
        subTitle: 'Por seguridad es necesario que cierres sesión con una conexión a internet.',
        buttons: ['Entendido']
      }).present();
    }
  }
  logout(){
    var self = this;
    let alert = this.alert.create({
      title: '¿Cerrar sesión?',
      subTitle: '¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            self.proceedLogout();
          }
        }
      ]
    });
    alert.present();

  }

  setDeviceID(){
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
  }
  menuTo(page, index){
    this.menuCtrl.close();

      if(this.isfake){
          let alert = this.alert.create({
            title: 'Localización',
            subTitle: 'Parece que tienes que activada una app de FakeLocation, no podrás iniciar visitas ni crear un nuevo microempresario hasta que la desactives.',
            buttons: ['Entendido']
          });
          alert.present();
      }else{
      var p;
      switch(page){
        case "home":
          p = HomeRepPage;
        case "avisos":
          p = AvisosPage;
        break;
        case "nuevo-empresario":
          p = NuevoEmpresarioPage;
        break;
      }
      if(page == "nuevo-empresario"){

        let confirm = this.alert.create({
        title: '¿Nueva asesoría?',
        message: 'Vas a iniciar una nueva asesoría, a partir de este momento se iniciará el tiempo de visita y no podrás realizar otras acciones. Por favor no cierres la aplicación, ni apagues tu celular ya que deberás reiniciar tu visita. ¿Aceptas los términos y condiciones?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Aceptar y continuar',
            handler: () => {
              this.appCtrl.getRootNav().setRoot(p, {index: index});
            }
          }
        ]
      });
      confirm.present();

      }else if(page !== "home"){
        this.navCtrl.push(p, {index: index});
      }else{

      }
    }
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

  showMicroempresario(idnegocio){
    this.navCtrl.push(VerMicroempresarioPage, {id: idnegocio});
  }

  showCalcEnergetica(idnegocio){
    this.navCtrl.push(PhotosPage, {id: idnegocio});
  }

  showAsesoria(idnegocio){
    if(this.isfake){
        let alert = this.alert.create({
          title: 'Localización',
          subTitle: 'Parece que tienes que activada una app de FakeLocation, no podrás iniciar visitas ni crear un nuevo microempresario hasta que la desactives.',
          buttons: ['Entendido']
        });
        alert.present();
    }else{
    if(this.network.isOnline()){
      let r = this.api.getAction('get_negocio_coords', {id: idnegocio});
      r.subscribe(data => {
        var d = data.json();
        var old_lat = d.lat;
        var old_lng = d.lng;
        var loading = this.loading.create({
                        content: "Detectando ubicación actual..."
                      });
        loading.present();
        var self = this;
        var options = {
          enableHighAccuracy: true,
          maximumAge: 0
        };
        self.geolocation.getCurrentPosition().then((resp) => {
          var latlng = { lat: resp.coords.latitude , lng: resp.coords.longitude};
          var lat = latlng.lat;
          var lng = latlng.lng;

          var difference = self.measure(lat, lng, old_lat, old_lng);

          loading.dismiss();


          if(1000 < Math.round(difference) && !self.localdev){
            let alert = self.alert.create({
              title: 'Error',
              subTitle: 'Para iniciar esta visita necesitas estar a un máximo de 1km. del negocio, actualmente te encuentras a '+ Math.round(difference)+' metros de distancia.',
              buttons: ['Entendido']
            });
            alert.present();
          }else{

            var r = self.api.getAction('new_visita', {id: idnegocio, lat: lat, lng: lng, email: self.email});
            r.subscribe(data => {
              var d = data.json();
              self.navCtrl.push(AsesoriaPage, {idnegocio: idnegocio, newvisitaParams: d});
            })



          }
        }).catch((resp) => {
          loading.dismiss();
          let alert = self.alert.create({
            title: 'Error',
            subTitle: 'No pudimos determinar tu ubicación, por favor activa tu localización para poder iniciar esta visita.',
            buttons: ['Entendido']
          });
          alert.present();
        });

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

  archivarAsesoria(id){
    var self = this;
    let alert = this.alert.create({
      title: 'Archivar ME',
      subTitle: '¿Deseas archivar esta visita? No podrás visualizarla de nuevo.',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Sí',
        handler: () => {
          var r = self.api.getAction('toggle_me', {id: id});
          r.subscribe( data => {
            self.fetchVisitas(false);
          })
        }
      }]
    });
    alert.present();

  }




}
