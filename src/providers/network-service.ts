import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
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
    var conn = this.checkConnection();
    return  conn  !== 'none';
  }
  checkConnection() {
    var networkState = Network.type;
    return networkState;
  }


  isOffline(): boolean {
    /*
    if(this.onDevice && Network.type){
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
    */
    var conn = this.checkConnection();
    return  conn  == 'none';
  }

}
