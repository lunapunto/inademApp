import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiCalls provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiCalls {
  //public url = 'http://192.168.100.2/INADEM/api';
  //public url = 'https://beta.lunapunto.com/inadem/api';
  public url = 'https://app.descifrainadem.mx/api';
  constructor(public http: Http) {

  }
  simpleGet(endpoint){
    var response = this.getRequest(endpoint);
    response.subscribe( data => {
      return data.json();
    })
  }

  buildUrl(url, parameters){
  var qs = "";
  for(var key in parameters) {
    var value = parameters[key];
    qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
  }
  if (qs.length > 0){
    qs = qs.substring(0, qs.length-1); //chop off last "&"
    url = url + "?" + qs;
  }
  return url;
  }

  getRequest(endpoint){
    var $http = this.http;
    var url = this.url+'/'+endpoint;
    return $http.get(url);
  }

  getAction(action, params){
    var $http = this.http;

    params.action = action;
    var url = this.buildUrl( this.url + '/actions.php', params)
    console.log('URL:'+url);
    return $http.get(url);
  }

  postAction(action, params){
    var $http = this.http;
    params.action = action;
    params = JSON.stringify(params);
    return $http.post(this.url + '/index.php?action='+action, params);
  }

}
