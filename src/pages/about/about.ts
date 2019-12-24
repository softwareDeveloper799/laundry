import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public allServices: any;
  constructor(
    public loadingCtrl: LoadingController,
    public serviceProvider: ServicProvider,
    private toastCtrl: ToastController,
    public navCtrl: NavController
    ) {
    this.fnGetAllServices();
  }
  fnGetAllServices() {
    this.requestData = {
      "api_key": global_data.api_key,
      "action": "get_all_services",
    };
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.allServices = this.dataResponse.response;
      } else {
        this.presentToast("Services is not available");
      }
      console.log('Response Services data', this.allServices)

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
