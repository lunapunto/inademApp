import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';
declare var PDFJS;

/*
  Generated class for the ViewPDF page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-pdf',
  templateUrl: 'view-pdf.html'
})
export class ViewPDFPage {
  src : any;
  pdf: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer) {
    this.src = this.safeUrl(navParams.data.url);

  }
  safeUrl(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ionViewDidLoad() {
    this.pdf = new PDFJS();
    this.pdf.getDocument(this.src);

  }

}
