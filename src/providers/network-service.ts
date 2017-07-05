import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

declare var Connection;

@Injectable()
export class NetworkService {
  onDevice: boolean;

  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');

  }

  isOnline(): boolean {
    /*
    if(Network.type){
      return Network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }*/
    return  true;
  }
  checkConnection() {
    return true;
  }


  isOffline(): boolean {
    /*
    if(this.onDevice && Network.type){
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
    */
    return false;
  }

}
