import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiCalls } from '../../providers/api-calls';
import { AnaRepPage } from '../ana-rep/ana-rep';

/*
  Generated class for the VerMicroempresario page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ver-microempresario',
  templateUrl: 'ver-microempresario.html',
  providers: [ApiCalls]
})
export class VerMicroempresarioPage {
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
  id = 0;
  constructor(public navCtrl: NavController, public api: ApiCalls, public navParams: NavParams) {
    this.id = navParams.data.id;
    var r = this.api.getAction('get_full_me', {id: navParams.data.id});
    r.subscribe( data => {
      var d = data.json();
      console.log(d);
      this.m = d;
    })

  }

  ionViewDidLoad() {


  }
  goToAnalisis(){
    this.navCtrl.push(AnaRepPage, {id: this.id});
  }
  sino_bool(bool){
    if(bool){
      return 'Sí';
    }else{
      return 'No';
    }
  }

}
