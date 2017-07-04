import { Component } from '@angular/core';
import { NavController, Slides, Keyboard, LoadingController, AlertController, App, NavParams } from 'ionic-angular';
import { HomeRepPage } from '../home-rep/home-rep';
import { CookieJS } from '../../providers/cookie-js';
import { ViewChild } from '@angular/core';
import { NetworkService } from '../../providers/network-service';
import { ApiCalls } from '../../providers/api-calls';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the Encuesta page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-encuesta',
  templateUrl: 'encuesta.html',
  providers: [NetworkService,ApiCalls,Storage, CookieJS]
})
export class EncuestaPage {
  @ViewChild(Slides) slides: Slides;
  email = '';
  form = {
    year : '',
    sector: '',
    empresaSize: '',
    convocatoria: '',
    giro: '',
    giroc: '',
    folio: '',
    noserieLector: '',
    microempresario : {
      nombre : '',
      edad: '',
      sexo: '',
      estudios: '',
      email: '',
      emailr: '',
      phone: '',
      phoner: '',
      experiencia: '',
      tiempodedica: '',
      porquenegocio: '',
      porquenegocioc: '',
      dependientes: '',
      espropietariootro: '',
      visitasinstitucionales: '',
      visitasinstitucionales_c: '',
      internetcasa: '',
      ayudaprospera: ''
    },
    negocio: {
      nombre: '',
      negocionombre: '',
      personalidadjuridica: '',
      rfc: '',
      tienecorreoempresa: '',
      correoempresa: '',
      correoempresar: '',
      tienetelefonoempresa: '',
      telefonoempresa: '',
      telefonoempresar: ''
    },
    direccion: {
      calle: '',
      ext: '',
      int: '',
      colonia: '',
      mpo: '',
      cp: ''
    },
    negociox: {
      m2:'',
      tecs: '',
      debe: '',
      cuanto: '',
      registro: '',
      registroc: '',
      clientes: '',
      digitales: '',
      pagoserv: '',
      pagosprogramas: '',
      proteccion: [],
      formaspago: '',
      formaspagoc: '',
      serviciosinternet: ''
    },
    salario: {
      asigna: '',
      promedio: '',
      esparte: '',
      esutilidades: '',
      razon: '',
      razonc: ''
    },
    seguro: {
      cotiza: '',
      trabajadorescot: '',
      cuantoscot: '',
      pqnocot: '',
      segpopmicro: '',
      segpoptra: ''
    },
    financiera: {
      tienefirmafis: '',
      tienefirmaneg: '',
      banconeg: '',
      bancoper: '',
      ventasmes: '',
      extrasmes: '',
      comprasmes: '',
      gastosfijos: '',
      divideingresos: '',
      otrosgastos: '',
      hacredito: '',
      creditospers: '',
      montocred: '',
      conquiencreditoc: '',
      credsneg: '',
      credsnegmonto: '',
      credsneginst: '',
      credsneginstc: ''
    },
    extras:{
      abarrotes: {
        enfriadores: '',
        enfriadorespropios: '',
        enfriadorespropiosc: '',
        vitrinas: '',
        vitrinaspropias: '',
        vitrinaspropiasc: '',
        vitrinacarnes: '',
        estantes: '',
        rebanadora: '',
        productosdiferentes: '',
        productosvende: '',
        cobrabarras: ''
      },
      restaurantes: {
        mesas: '',
        refrigeradores: '',
        platillos: '',
        exclusividad: ''
      },
      ropa: {
        prendas: '',
        marcas: '',
        piezas: '',
        venta: ''
      },
      papelerias: {
        marcas: '',
        productos: '',
        productosdiario: '',
        rentacomputadoras: '',
        copias: ''
      },
      mecanico: {
        refacciones: '',
        escaner: '',
        control: '',
        tiempos: '',
        presupuestar: '',
        aceites: '',
        reparacionesdia: ''
      },
      ferreteria: {
        marcas: '',
        productos: '',
        productosdia: '',
        distribuidor: ''
      },
      tortilleria: {
        kilos: '',
        diferente: '',
        diferente_: ''
      }
    }
  }

  empresaSizes = [];
  convocatorias = [];
  giros = [];
  showLectorTarjetas = false;
  instcredito = [
    'Institución Bancaria',
    'Proveedores',
    'Gobierno',
    'Departamental',
    'Particular',
    'Tarjeta de crédito',
    'Microfranquicia',
    'Otros'
  ];
  instcreditopers = [
    'Institución Bancaria',
    'Microfinanciera',
    'Prestamistas (usureros)',
    'Otros'
  ];
  gastosfijos = [
    'Luz',
    'Teléfono',
    'Sueldos',
    'Renta',
    'Predial'
  ];
  razonsalario = [
    'Los ingresos del Microempresario son las ganancias del negocio',
    'Los ingresos del negocio no son suficientes para cubrir un salario',
    'No sé cómo atribuirme un salario por mi trabajo',
    'Otras razones'
  ];
  estudios = [
    'Sin estudios',
    'Primaria Trunca',
    'Primaria Completa',
    'Secundaria Trunca',
    'Secundaria Completa',
    'Preparatoria Trunca',
    'Preparatoria Completa',
    'Licenciatura Trunca',
    'Licenciatura Completa',
    'Maestría o doctorado trunco',
    'Maestría o doctorado completo'
  ];
  tiempodedica = [
    'Completo',
    'Medio',
    'Bajo'
  ];
  porquenegocio = [
    'Conoce el oficio',
    'Por causa de despido',
    'Por falta de empleo',
    'Para iniciar un negocio propio',
    'Para poder atender a la familia',
    'Lo heredó',
    'Oportunidad de negocio',
    'Otro'
  ];
  m2pos = [
    'Menos de 20',
    '41 a 60',
    '61 a 80',
    '81 a adelante'
  ];
  tecs = [
    'Smartphone',
    'Tablet',
    'Computadora',
    'Terminal punto de venta'
  ];
  clientesdia = [
    'Menos de 5',
    '6 a 10',
    '11 a 20',
    '21 a 30',
    '31 a 60',
    '61 a 90',
    '91 a 100',
    'Más de 100'
  ];
  proteccion = [
    'Ninguna',
    'Patentes',
    'Marcas',
    'Diseños industriales',
    'Modelos de utilidad',
    'Derechos de autor',
    'Variedad vegetal',
    'Indicación geográfica',
    'Denominación de origen',
    'Secreto industrial'
  ];
  formaspago = [
    'Efectivo',
    'Tarjetas (débito y crédito)',
    'Pago por internet (Paypal)',
    'Otros'
  ];
  rfctype = '';
  isExtra = false;
  originalClass = '';
  blockfolio = false;
  hideFolioAlert = false;
  asesorconvs = [];
  constructor(public navCtrl: NavController,public keyboard: Keyboard,public events: Events, public storage: Storage, public loadingCtrl: LoadingController,  public api: ApiCalls, public network: NetworkService, public appCtrl: App, public alert: AlertController, public cookie: CookieJS, public navParams: NavParams) {

    window.addEventListener('native.keyboardshow', this.keyboardShowHandler);
    window.addEventListener('native.keyboardhide', this.keyboardHideHandler);

    var scs = this.cookie.get('inadem_sc');
        scs = JSON.parse(scs);
    this.email = scs['email'];
  }

  keyboardShowHandler(e){
    console.log('Keyboard height is: ' + e.keyboardHeight);
    var elements = document.getElementsByClassName('swiper-container');
    for (var i in elements) {
      if (elements.hasOwnProperty(i)) {
        elements[i].className += " showing-keyboard";
      }
    }
    return false;

  }
  keyboardHideHandler(e){
    var elements = document.getElementsByClassName('swiper-container');
    for (var i in elements) {
      if (elements.hasOwnProperty(i)) {
        elements[i].className = elements[i].className.replace('showing-keyboard', "");
      }
    }
    return false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaPage');
    this.slides.paginationType = 'progress';
    this.slides.lockSwipeToNext(true);

    var storage = this.storage;
    storage.ready().then(() => {
       storage.get('form').then((val) => {
         if(val.negocio){
           this.form = val;
         }

       })
     });

    var asesorConvs = this.api.getAction('getAsesorConvs', {email: this.email});
    asesorConvs.subscribe(data => {
      var d = data.json();
      this.asesorconvs = d;
      console.log(d);
    })
  }



  goToNext(index){
    this.events.publish('encuestaSubmit', JSON.stringify(this.form));
    this.navCtrl.parent.select(index);
    var storage = this.storage;
    storage.ready().then(() => {
       // set a key/value
       storage.set('form', this.form);
     });
  }
  setSizeEmpresa(){
    var sector = this.form.sector;

    switch(sector){
      case "Comercio":
        this.empresaSizes = [
          'Hasta 10 empleados (Microempresa)',
          'De 11 a 30 empleados (Pequeña Empresa)',
          'De 31 a 100 empleados (Mediana Empresa)'
        ]
      break;
      case "Servicios":
      this.empresaSizes = [
        'Hasta 10 empleados (Microempresa)',
        'De 11 a 50 empleados (Pequeña Empresa)',
        'De 51 a 250 empleados (Mediana Empresa)'
      ]
      break;
      case "Industria (Manufactura)":
      this.empresaSizes = [
        'Hasta 10 empleados (Microempresa)',
        'De 11 a 50 empleados (Pequeña Empresa)',
        'De 51 a 250 empleados (Mediana Empresa)'
      ]
      break;
    }
    this.setConvocatorias();
  }
  setProteccion(){
    var x = this.form.negociox.proteccion.indexOf('Ninguna');
    var isn = -1 < x ? true : false;
    if(isn){
      this.form.negociox.proteccion = ['Ninguna'];
    }
  }
  setConvocatorias(){
    var year = this.form.year;
    var sector = this.form.sector;
    var size = this.form.empresaSize;
    this.convocatorias = [];
    this.form.convocatoria = '';
    var asconvs = this.asesorconvs;
    if(year && sector && size){
      // CASO 1
      if((-1 < asconvs.indexOf('4.1 Desarrollo de Capacidades Empresariales para Microempresas.')) && year == '2015' && size == 'Hasta 10 empleados (Microempresa)'){
        this.convocatorias.push('4.1 Desarrollo de Capacidades Empresariales para Microempresas.')
      }
      // CASO 2
      if( (-1 < asconvs.indexOf('4.1 a)Formación Empresarial para MIPYMES.')) && year == '2016'){
        this.convocatorias.push('4.1 a)Formación Empresarial para MIPYMES.');
      }

      if((-1 < asconvs.indexOf('4.1 b)Formación Empresarial para MIPYMES.')) && year == '2016'){
        this.convocatorias.push('4.1 b)Formación Empresarial para MIPYMES.');
      }



      // CASO 4
      if((-1 < asconvs.indexOf('5.1 Incorporación de Tecnologías de Información y Comunicaciones a las Micro y Pequeñas Empresas.')) && year == '2016' && size !== 'De 51 a 250 empleados (Mediana Empresa)' && size !== 'De 31 a 100 empleados (Mediana Empresa)'){
        this.convocatorias.push('5.1 Incorporación de Tecnologías de Información y Comunicaciones a las Micro y Pequeñas Empresas.');
      }

      // CASO 5
      if((-1 < asconvs.indexOf("5.2  Desarrollo de Capacidades Empresariales para Microempresas a través de la incorporación de Tecnologías de la Información y Comunicaciones (TIC’s).")) && year == '2016' && size == 'Hasta 10 empleados (Microempresa)'){
        this.convocatorias.push("5.2  Desarrollo de Capacidades Empresariales para Microempresas a través de la incorporación de Tecnologías de la Información y Comunicaciones (TIC’s).");
      }

      // CASO 6
      if((-1 < asconvs.indexOf("Proyecto: MI TIENDA.")) && year == '2015' && sector == 'Comercio' && size == 'Hasta 10 empleados (Microempresa)'){
        this.convocatorias.push('Proyecto: MI TIENDA.');
      }

      if((-1 < asconvs.indexOf("Proyecto: MI TIENDA 2016.")) && year == '2016' && sector == 'Comercio' && size == 'Hasta 10 empleados (Microempresa)'){
        this.convocatorias.push('Proyecto: MI TIENDA 2016.');
      }
      if(!this.convocatorias.length){
        let alert = this.alert.create({
          title: 'No existen convocatorias',
          subTitle: 'No existen convocatorias con estos parámetros.',
          buttons: [
            {
              text: 'Cancelar asesoría',
              handler: () => {
                this.appCtrl.getRootNav().setRoot(HomeRepPage);
              }
            },
            {
              text: 'Entendido',
              role: 'cancel'
            }
          ]
        });
        alert.present();
      }else{
        this.setGirosDisponibles();
      }
    }
  }
  setExtraQ(){
    var g = this.form.giro;
    if(g == 'Abarrotes' || g == 'Restaurante' || g == 'Tienda de Ropa' || g == 'Papelería' || g == 'Mecánico' || g == 'Ferretería y Tlapalería' || g == 'Tortillería'){
      this.isExtra = true;
    }else{
      this.isExtra = false;
    }
  }
  setGirosDisponibles(){
    var year = this.form.year;
    var cnv = this.form.convocatoria;
    var sector = this.form.sector;
    var giros = [];
    if(year && cnv && sector){
      /*
      if(cnv == '5.2 Desarrollo de Capacidades Empresariales para Microempresas a través de la incorporación de Tecnologías de la Información y Comunicaciones(TIC’s)' || cnv == '4.1 Desarrollo de Capacidades Empresariales para Microempresas'){
        this.isExtra = true;
      }
      */
      if(sector == 'Comercio'){

          giros = [
            'Abarrotes',
            'Tienda de Ropa',
            'Papelería',
            'Frutería y Verdulería',
            'Carnicería',
            'Ferretería y Tlapalería',
            'Zapatería',
            'Tienda de regalos',
            'Pollería',
            'Farmacia',
            'Tienda de segunda mano',
            'Dulcería',
            'Cervecería',
            'Refaccionaria',
            'Florería',
            'Centro de distribución telefónico',
            'Venta de artículos de limpieza',
            'Accesorios de vestir',
            'Otro'
          ];

      }else if(sector == 'Servicios'){
         giros = [
           'Salón de belleza',
           'Restaurante',
           'Mecánico',
           'Ciber-Café',
           'Cafetería',
           'Dentista',
           'Lavandería y Tintorería',
           'Reparaciones',
           'Médico',
           'Vulcanizadora',
           'Otro'
         ]
      }else{
        giros = [
          'Tortillería',
          'Herrería',
          'Panadería',
          'Carpintería',
          'Imprenta',
          'Embotelladora de agua',
          'Costurera',
          'Jarciería (instrumentos de limpieza)',
          'Alfarería (barro)',
          'Sastrería',
          'Heladería',
          'Zapatería',
          'Otro'
        ]
      }

      giros.sort();
      this.giros = giros;


      /* PUNTO 6. SERIE DE LECTOR DE TARJETAS
      if((year == '2015' && cnv == '4.1 Formación Empresarial para MIPYMES') || (year == '2016' && '5.2 Desarrollo de Capacidades Empresariales para Microempresas a través de la incorporación de Tecnologías de la Información y Comunicaciones(TIC’s)')){
        this.showLectorTarjetas = true;
      }
      */


    }


  }

  restriccionRFC(){
    var rfc = this.form.negocio.rfc;

    let alert = this.alert.create({
      title: 'Sin conexión',
      subTitle: 'Lo sentimos, necesitar tener una conexión a internet para avanzar al siguiente paso.',
      buttons: ['Entendido']
    });

    if(this.network.isOnline()){
      var loading = this.loadingCtrl.create({
        content: 'Verificando RFC'
      });
      loading.present();

      var r = this.api.getAction('verifyRFC', {rfc: rfc, tipo: this.form.negocio.personalidadjuridica,  convocatoria: this.form.convocatoria});

      r.subscribe( data => {
        var d = data.json();
        var msg = d.msg;
        loading.dismiss();
        switch(msg){
          case "invalid":
          let alertD = this.alert.create({
            title: 'RFC Inválido',
            subTitle: 'Lo sentimos, el RFC no es válido.',
            buttons: ['Entendido']
          });
          alertD.present();
          break;
          case "restricted":
          let alertDa = this.alert.create({
            title: 'RFC restringido',
            subTitle: 'Lo sentimos, este microempresario no puede ser registrado en esta convocatoria.',
            buttons: ['Entendido']
          });
          alertDa.present();
          break;
          default:
          this.submitSlide('');
          break;
        }
      });

    }else{
      alert.present();
    }


  }


  submitSlide($event){
    var self = this;
    setTimeout(function(){
      self.keyboardHideHandler('');
    }, 2000);


    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);

    var storage = this.storage;
    storage.ready().then(() => {
       storage.set('form', this.form);
     });

  }
  goBack(){
    this.slides.slidePrev();
  }

  checkEmail(){
    var email = this.form.microempresario.email;
    var self = this;
    if(this.network.isOnline()){
      var loading = this.loadingCtrl.create({
        content: 'Espera un momento...'
      });
    loading.present();

    var r = this.api.getAction('checkme_email', {email: email, convocatoria: this.form.convocatoria});
    r.subscribe(data => {
      var d = data.json();
      loading.dismiss();
      if(d.msg !== 'OK'){
        self.form.microempresario.email = '';
        self.form.microempresario.emailr = '';

        let alert = this.alert.create({
          title: 'Error',
          subTitle: 'Este usuario no puede ser registrado con este correo.',
          buttons: ['Entendido']
        });
        alert.present();
      }else{
        self.submitSlide({});
      }

    })

    }
  }
  submitFolio(){
    this.submitSlide({});
    this.folioChange();
  }
  folioChange(){

    var f_ = this.form.folio;
    var ff = parseInt(f_);
    var isoknum = false;
    if(100000 <= ff && ff <= 999999){
      isoknum = true;
    }

    if(this.network.isOnline() && isoknum){
      var loading = this.loadingCtrl.create({
        content: 'Espera un momento...'
      });


      if(this.form.convocatoria == '4.1 a)Formación Empresarial para MIPYMES.' || this.form.convocatoria == '5.1 Incorporación de Tecnologías de Información y Comunicaciones a las Micro y Pequeñas Empresas.'){
        loading.present();
        let r = this.api.getAction('search_folio', {folio: this.form.folio, convocatoria: this.form.convocatoria});
        r.subscribe(data => {
          var d = data.json();
          loading.dismiss();

          if(d.msg == 'ok'){
            this.blockfolio = true;
            this.form.microempresario.nombre = d.nombre;
            this.form.negocio.rfc = d.rfc;
            this.form.negocio.personalidadjuridica = d.tipo;
            this.form.microempresario.email = d.email;
            this.form.microempresario.emailr = d.email;

            this.alert.create({
              title: 'Datos cargados',
              subTitle: 'Los datos fueron precargados con éxito.',
              buttons: ['Entendido']
            }).present();


          }
        })
      }

    }else if(!isoknum){
      this.alert.create({
        title: 'Folio',
        subTitle: 'El folio son los últimos 6 dígitos del proyecto.',
        buttons: ['Entendido']
      }).present();
    }
  }
  cpLimit(){
    var cp = this.form.direccion.cp;
    var x = cp.length;
    if(x !== 5){
      this.alert.create({
        title: 'Código postal',
        subTitle: 'El código postal tiene que contener 5 dígitos.',
        buttons: ['Entendido']
      }).present();
    }
  }
  showAlertFolio(){
    if(!this.hideFolioAlert){
      this.hideFolioAlert = true;
      this.alert.create({
        title: 'Folio',
        subTitle: 'El folio son los últimos 6 dígitos del proyecto.',
        buttons: ['Entendido']
      }).present();
    }

  }
}
