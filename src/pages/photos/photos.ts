import { Component } from '@angular/core';
import { NavController,AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Events } from 'ionic-angular';
import { NetworkService } from '../../providers/network-service';

/*
  Generated class for the Photos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-photos',
  templateUrl: 'photos.html',
  providers: [NetworkService,Camera]
})
export class PhotosPage {
  photoLocal = '';
  photoMicroempresario = '';
  showingPL = true;
  showingPM = false;
  iscreating = false;
  constructor(public navCtrl: NavController,public camera: Camera,public alert: AlertController, public network: NetworkService, public events: Events, public loadingCtrl: LoadingController,  public navParams: NavParams) {}

  ionViewDidLoad() {

  }
  shotPhoto(){
    var loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    var options = {
      destinationType: 0,
      sourceType : this.camera.PictureSourceType.CAMERA,
      allowEdit : false
    }
    this.camera.getPicture(options).then((imageData) => {
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photoLocal = base64Image;
     loading.dismiss();
    }, (err) => {
      loading.dismiss();
      console.log(err);
    });
  }
  deleteSnap(){
    this.photoLocal = 'sasa929322931';
    this.photoLocal = '';

  }
  shotPhotoA(){
    var loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();
    var options = {
      destinationType: 0
    }
    this.camera.getPicture(options).then((imageData) => {
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photoMicroempresario = base64Image;
     loading.dismiss();
    }, (err) => {
      loading.dismiss();
      console.log(err);
    });
  }
  toggleViews(){
    this.showingPL = !this.showingPL;
    this.showingPM = !this.showingPM;
  }
  deleteSnapA(){
    this.photoMicroempresario = 'SAasSA';
    this.photoMicroempresario = '';
  }
  FinishEncuesta(){
    var data = {pic1: this.photoLocal, pic2: this.photoMicroempresario};

    if(this.network.isOnline()){
      this.iscreating = true;
      this.events.publish('photosSubmit', JSON.stringify(data));
    }else{
      let alert = this.alert.create({
        title: 'Sin conexión',
        subTitle: 'Para concluir es necesario que tengas conexión a internet. Puedes poner en pausa tu asesoría hasta que consigas internet.',
        buttons: ['Entendido']
      });
      alert.present();
    }


  }
}
