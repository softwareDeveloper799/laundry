import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
// import { SigninPage } from '../signin/signin';
import { ChangePasswordPage } from '../change-password/change-password';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage {
  public verifyOtp: string;
  public loading: any;
  public requestData: any;
  public email: string = "";
  public dataResponse: any;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) { this.verifyOtp = ""; this.email = localStorage.getItem('user_email'); }
  verificationOtp() {
    this.requestData = {
      "api_key": global_data.api_key,
      "email": this.email,
      "otp": this.verifyOtp,
      "action": "confirm_otp_email"
    }
    console.log(this.requestData);
    if (this.verifyOtp != "") {
      this.showLoader();
      console.log('Resquest Object', this.requestData)
      this.serviceProvider.servicePost(this.requestData).then((result) => {
        this.loading.dismiss();
        this.dataResponse = result;
        if (this.dataResponse.status == "true") {
          this.presentToast(this.dataResponse.response);
          this.navCtrl.push(ChangePasswordPage)
        } else {
          this.presentToast(this.dataResponse.response);
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast("Server down...");
      });
    } else {
      this.presentToast("Enter otp!");
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
