import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { PasswordPage } from '../password/password';
import { SignupPage } from '../signup/signup';
import { ServicProvider } from '../../providers/servic/servic';
import { OrderStaffPage } from '../../pages/order-staff/order-staff';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  requestData: any = { "email": "", "password": "" };
  public email: string = "";
  public password: string = "";
  public loading: any;
  public dataResponse: any;
  public requestCurrObject: any;
  public dataCurrResponse: any;
  public curSymbol: string = null;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.fnGetCurrencySym();
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
  tab() {
    this.requestData = {
      "api_key": global_data.api_key,
      "email": this.email,
      "password": this.password,
      "action": "check_login"
    }
    if (this.requestData.email != "" && this.requestData.password != "") {
      this.showLoader();
      this.serviceProvider.servicePost(this.requestData).then((result) => {
        this.loading.dismiss();
        this.dataResponse = result;
        if (this.dataResponse.status == "true") {
          localStorage.setItem('userInfo', JSON.stringify(this.dataResponse.response));
          localStorage.setItem("user_id", this.dataResponse.response.id);
          localStorage.setItem("first_name", this.dataResponse.response.first_name);
          localStorage.setItem("last_name", this.dataResponse.response.last_name);
          localStorage.setItem("user_name", this.dataResponse.response.fullname);
          localStorage.setItem("user_email", this.dataResponse.response.user_email);
          localStorage.setItem("phone", this.dataResponse.response.phone);
          localStorage.setItem("zip", this.dataResponse.response.zip);
          localStorage.setItem("address", this.dataResponse.response.address);
          localStorage.setItem("city", this.dataResponse.response.city);
          localStorage.setItem("state", this.dataResponse.response.state);
          localStorage.setItem("user_type", this.dataResponse.response.usertype);
          localStorage.setItem("user_img", this.dataResponse.response.image);
          localStorage.setItem("user_pwd", this.dataResponse.response.user_pwd);
          if (this.dataResponse.response.usertype == 'staff') {
            this.navCtrl.setRoot(OrderStaffPage);
          } else {
            this.navCtrl.setRoot(TabsPage);
          }
        } else {
          this.presentToast("Incorrect email and password");
        }
        console.log(this.dataResponse);
        console.log('User info', JSON.parse(localStorage.getItem('userInfo')));
      }, (err) => {
        this.loading.dismiss();
        this.presentToast("Server down...");
      });
    } else {
      this.presentToast("Enter email and password");
    }
  }
  fnPassword() {
    this.navCtrl.push(PasswordPage);
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }
  fnGetCurrencySym() {
    this.requestCurrObject = {
      "api_key": global_data.api_key,
      "option_name": "ld_currency_symbol",
      "action": "get_setting"
    };
    this.serviceProvider.servicePost(this.requestCurrObject).then((result) => {
      this.dataCurrResponse = result;
      if (this.dataCurrResponse.status == "true") {
        this.curSymbol = this.dataCurrResponse.response[0].option_value;
      }
    }, (err) => {
      this.presentToast("Server down...");
    });
    if (this.curSymbol == null) {
      localStorage.setItem("currSymbol", "$");
    } else {
      localStorage.setItem("currSymbol", this.curSymbol);
    }
    console.log('currency', this.dataCurrResponse);
  }
}
