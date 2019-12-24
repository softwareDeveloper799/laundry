import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { global_data } from '../../providers/global';
import { ServicProvider } from '../../providers/servic/servic';
import { ChangePasswordPage } from '../change-password/change-password';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public requestData: any;
  public dataResponse: any;
  public requestUpdateData: any;
  public dataUpdateResponse: any;
  public userInfo: any;
  public user_id: string = "";
  public user_email: string = "";
  public user_type: string = "";
  public first_name: string = "";
  public full_name: string = "";
  public last_name: string = "";
  public phone: string = "";
  public address: string = "";
  public city: string = "";
  public state: string = "";
  public country: string = "";
  public zip: string = "";
  public loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.user_id = localStorage.getItem('user_id');
    this.user_type = localStorage.getItem('user_type');
    this.getUserInfo();
  }
  getUserInfo() {
    if (this.user_type == "client") {
      this.user_type = "user";
    } else {
      this.user_type = "staff";
    }
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": this.user_id,
      "type": this.user_type,
      "action": "get_profile_detail"
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      this.userInfo = this.dataResponse.response;
      console.log(this.userInfo);
      for (let item of this.userInfo) {
        this.user_email = item.user_email;
        this.first_name = item.first_name;
        this.last_name = item.last_name;
        this.full_name = item.fullname;
        this.phone = item.phone;
        this.address = item.address;
        this.city = item.city;
        this.state = item.state;
        this.country = item.country;
        this.zip = item.zip;
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  updateProfile() {
    this.requestUpdateData = {
      "api_key": global_data.api_key,
      "user_id": this.user_id,
      "type": this.user_type,
      "firstname": this.first_name,
      "lastname": this.last_name,
      "fullname": this.full_name,
      "phone": this.phone,
      "address": this.address,
      "city": this.city,
      "state": this.state,
      "zip": this.zip,
      "country": this.country,
      "email": this.user_email,
      "action": "profile_detail_update"
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestUpdateData).then((result) => {
      this.loading.dismiss();
      this.dataUpdateResponse = result;
      if (this.dataUpdateResponse.status == "true") {
        localStorage.setItem("first_name", this.dataResponse.response.first_name);
        localStorage.setItem("last_name", this.dataResponse.response.last_name);
        localStorage.setItem("phone", this.dataResponse.response.phone);
        localStorage.setItem("zip", this.dataResponse.response.zip);
        localStorage.setItem("address", this.dataResponse.response.address);
        localStorage.setItem("city", this.dataResponse.response.city);
        localStorage.setItem("state", this.dataResponse.response.state);
        this.presentToast(this.dataUpdateResponse.response);
      } else {
        this.presentToast(this.dataUpdateResponse.response);
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
  changePassword() {
    this.navCtrl.push(ChangePasswordPage, {
      from: "profile"
    });
  }
}
