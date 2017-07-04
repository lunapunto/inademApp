import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAuth } from '../../providers/user-auth';
import { ApiCalls } from '../../providers/api-calls';
import { CookieJS } from '../../providers/cookie-js';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network-service';
/*
  Generated class for the MicroPerfil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-micro-perfil',
  templateUrl: 'micro-perfil.html',
  providers: [UserAuth, ApiCalls, CookieJS, Storage, NetworkService, AlertController]
})
export class MicroPerfilPage {

  m = {
    isokconv            : false,
    longitud            : '',
    latitud             : '',
    convocatoria_year   : '',
    convocatoria        : '',
    sectorEmpresa       : '',
    cantidad_empleados  : '',
    giroid              : '',
    giro                : '',
    numero_folio        : '',
    fechaalta           : '',
    dueno_empleado      : '',
    nombre              : '',
    edad                : '',
    sexo                : '',
    estudios_usu        : '',
    usuario             : '',
    status              : '',
    numero_telefonico   : '',
    expe_anios          : '',
    tiempo_dedicado     : '',
    motivo_negocio      : '',
    dependientes_eco    : '',
    otro_negocio        : '',
    visita_InstitucionDependencia : '',
    visita_InstitucionDependencia_Quien : '',
    servicio_internet_casa : '',
    haz_programa_prospera  : '',
    // Negocio indent
    nombre_negocio      : '',
    pertenece_negocio   : '',
    tipoNegocio        : '',
    rfc                 : '',
    email               : '',
    EmailEmpresa        : '',
    TelEmpresa          : '',
    //Direccion
    dir_calle           : '',
    dir_num_ext         : '',
    dir_num_int         : '',
    dir_colonia         : '',
    dir_delegacion      : '',
    dir_CP              : '',
    // Negocio X
    metros_cuadrados    : '',
    atraso_pago_proveedores : '',
    cuanto_debe         : '',
    como_registra       : '',
    cuantos_clientes    : '',
    vende_digitales     : '',
    cobra_servicios     : '',
    recibe_tarjetassociales   : '',
    servicio_internet   : '',
    //Salario
    SalarioTiene        : '',
    SalarioMensual      : '',
    SalarioEs           : '',
    SalarioRazones      : '',
    SalarioRazonCual    : '',
    //Seguro
    SeguroCotizaIMSS      : '',
    SeguroCotizaTrabIMSS  : '',
    SeguroTrabajadores   : '',
    PorqueNoCotizaIMSS    : '',

    firma_sat             : '',
    firma_sat_negocio    : '',
    cuenta_bancaria       : '',
    cuenta_bancaria_personal : ''

  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public storage: Storage, public userAuth: UserAuth, public api: ApiCalls, public cookie: CookieJS, public network: NetworkService) {}

  ionViewDidLoad() {
    var inadem_sc = this.cookie.get('inadem_sc');
        inadem_sc = JSON.parse(inadem_sc);

    var params = {
      email: inadem_sc['email']
    }


    this.storage.ready().then( () => {
      // Try to get microempresario profile
      var pred = this.storage.get('microempresario_profile');
      pred.then( (val) => {
        if(val){
          var d = val._body;
           d = JSON.parse(d);

          this.m = d;
        }else{
          if(this.network.isOffline()){
            let alert = this.alert.create({
              title: 'Sin conexión',
              subTitle: 'Lo sentimos, necesitas tener una conexión a internet para ver por primera vez tu perfil.',
              buttons: ['Entendido']
            });
            alert.present();
          }
        }
      })
    })


    var request = this.api.getAction('get_full_me', params);
    request.subscribe( data => {
      var d = data.json();
        this.m = d;
        this.storage.set('microempresario_profile', data);
    })


  }
  sino_bool(bool){
    if(bool){
      return 'Sí';
    }else{
      return 'No';
    }
  }

}
