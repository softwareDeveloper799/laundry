import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { global_data } from '../../providers/global';
import { ServicProvider } from '../../providers/servic/servic';
// import { OtpPage } from '../otp/otp';
import { SigninPage } from '../signin/signin';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  register: any;
  requestObject: any;
  loading: any;
  dataResponse: any;
  constructor(
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public servicProvider: ServicProvider
  ) {
    this.register = {
      fname: "", lname: "", email: "", password: "", number: "", zip: "", address: "", city: "", state: ""
    };
  }
  otp() {
    if (this.register.fname != "" && this.register.lname != "" && this.register.email != "" && this.register.password != "" && this.register.number != "" && this.register.address != "" && this.register.city != "" && this.register.state != "" && this.register.zip != "") {
      this.requestObject = {
        "api_key": global_data.api_key,
        "email": this.register.email,
        "password": this.register.password,
        "first_name": this.register.fname,
        "last_name": this.register.lname,
        "phone": this.register.number,
        "address": this.register.address,
        "city": this.register.city,
        "state": this.register.state,
        "zipcode": this.register.zip,
        "action": "add_customer"
      }
      console.log('Request_object', this.requestObject);
      this.showLoader();
      this.servicProvider.servicePost(this.requestObject).then((result) => {
        this.dataResponse = result;
        this.loading.dismiss();
        if (this.dataResponse.status == "true") {
          console.log('response', this.dataResponse);
          this.presentToast("Account created successfully");
          this.navCtrl.setRoot(SigninPage);
        } else {
          this.presentToast("Email already exists");
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast("Server down...");
      });
    } else {
      this.presentToast("Please fillup all fields");
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
