import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { StandbyPage } from '../pages/standby/standby';
import { PasswordPagePage } from '../pages/password-page/password-page';
import { HomeRepPage } from '../pages/home-rep/home-rep';
import { MicroPerfilPage } from '../pages/micro-perfil/micro-perfil';
import { MicroReportePage } from '../pages/micro-reporte/micro-reporte';
import { MicroPlanAccionPage } from '../pages/micro-plan-accion/micro-plan-accion';
import { MicroPlanFinanciamientoPage } from '../pages/micro-plan-financiamiento/micro-plan-financiamiento';
import { MicroReporteMicroPage } from '../pages/micro-reporte-micro/micro-reporte-micro';
import { MicroAnalisisMercadoPage } from '../pages/micro-analisis-mercado/micro-analisis-mercado';
import { MicroEvaluacionPage } from '../pages/micro-evaluacion/micro-evaluacion';
import { MicroEditPage } from '../pages/micro-edit/micro-edit';
import { CalculadoraEnergeticaPage } from '../pages/calculadora-energetica/calculadora-energetica';
import { AvisosPage } from '../pages/avisos/avisos';
import { NuevoEmpresarioPage } from '../pages/nuevo-empresario/nuevo-empresario';
import { AsesoriaLocPage } from '../pages/asesoria-loc/asesoria-loc';
import { EncuestaPage } from '../pages/encuesta/encuesta';
import { PhotosPage } from '../pages/photos/photos';
import { AsesoriaPage } from '../pages/asesoria/asesoria';
import { AsesoriaAnalisisPage } from '../pages/asesoria-analisis/asesoria-analisis';
import { AsesoriaProfilePage } from '../pages/asesoria-profile/asesoria-profile';
import { VerMicroempresarioPage } from '../pages/ver-microempresario/ver-microempresario';
import { AnaRepPage } from '../pages/ana-rep/ana-rep';
import { ViewPDFPage } from '../pages/view-pdf/view-pdf';
import { Storage } from '@ionic/storage';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HomeRepPage,
    LoginPage,
    StandbyPage,
    MicroEditPage,
    AsesoriaLocPage,
    NuevoEmpresarioPage,
    PasswordPagePage,
    MicroReportePage,
    MicroPerfilPage,
    MicroPlanAccionPage,
    MicroPlanFinanciamientoPage,
    MicroReporteMicroPage,
    MicroAnalisisMercadoPage,
    MicroEvaluacionPage,
    AvisosPage,
    EncuestaPage,
    CalculadoraEnergeticaPage,
    PhotosPage,
    AsesoriaPage,
    AsesoriaProfilePage,
    AsesoriaAnalisisPage,
    VerMicroempresarioPage,
    AnaRepPage,
    ViewPDFPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      /*
      scrollAssist: false,
      autoFocusAssist: false
      */
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HomeRepPage,
    LoginPage,
    MicroEditPage,
    StandbyPage,
    PasswordPagePage,
    MicroReportePage,
    MicroPerfilPage,
    MicroPlanAccionPage,
    MicroPlanFinanciamientoPage,
    MicroReporteMicroPage,
    MicroAnalisisMercadoPage,
    MicroEvaluacionPage,
    AvisosPage,
    NuevoEmpresarioPage,
    CalculadoraEnergeticaPage,
    AsesoriaLocPage,
    EncuestaPage,
    PhotosPage,
    AsesoriaPage,
    AsesoriaProfilePage,
    AsesoriaAnalisisPage,
    VerMicroempresarioPage,
    AnaRepPage,
    ViewPDFPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage]
})
export class AppModule {}
