import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public contactList: any;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.fnGetContact();
  }
  fnGetContact() {
    this.requestData = {
      "api_key": global_data.api_key,
      "ld_company_name": "ld_company_name",
      "ld_company_address": "ld_company_address",
      "ld_company_email": "ld_company_email",
      "ld_company_phone": "ld_company_phone",
      "action": "get_contact_us"
    };
    this.showLoader();
    console.log('contact requestData', this.requestData);
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      console.log('contact dataResponse', this.dataResponse);
      if (this.dataResponse.status == "true") {
        this.contactList = this.dataResponse.response;
      } else {
        this.presentToast(this.dataResponse.response);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
