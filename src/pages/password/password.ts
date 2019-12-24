import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {
  public loading: any;
  public requestData: any;
  public email: string = "";
  public dataResponse: any;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    private toastCtrl: ToastController, public serviceProvider: ServicProvider) {
  }
  otp() {
    localStorage.setItem('user_email', this.email);
    this.requestData = {
      "api_key": global_data.api_key,
      "email": this.email,
      "action": "otp"
    }
    if (this.requestData.email != "") {
      this.showLoader();
      console.log('Resquest Object', this.requestData)
      this.serviceProvider.servicePost(this.requestData).then((result) => {
        this.loading.dismiss();
        this.dataResponse = result;
        console.log('OTP', this.dataResponse);
        if (this.dataResponse.status == "true") {
          this.presentToast("OTP sent to email");
          this.navCtrl.push(OtpPage)
        } else {
          this.presentToast("Incorrect email or not exist!");
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast("Server down...");
      });
    } else {
      this.presentToast("Enter email");
    }
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
