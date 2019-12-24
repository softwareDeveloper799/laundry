import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html'
})
export class AddaddressPage {
  address: string = "home";
  public requestObject: any;
  public loading: any;
  public dataResponse: any;
  public userResponse: any;
  public messResponse: any;
  public first_name: string;
  public last_name: string;
  public zipcode: string;
  public _address: string;
  public city: string;
  public state: string;
  public type: string;
  public phone: string;
  public user_id: string;
  public user_email: string;
  public userInfo: any;
  constructor(
    public navCtrl: NavController,
    public serviceProvider: ServicProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('User Parse --', this.userInfo.address);
    this.zipcode = this.userInfo.zip;
    this._address = this.userInfo.address;
    this.city = this.userInfo.city;
    this.state = this.userInfo.state;
    this.type = this.userInfo.usertype;
    this.first_name = this.userInfo.first_name;
    this.last_name = this.userInfo.last_name;
    this.phone = this.userInfo.phone;
    this.user_id = this.userInfo.id;
    this.user_email = this.userInfo.user_email;
  }
  fnUpdateProfile() {
    if (this.type == 'client') {
      this.type = "user";
    } else {
      this.type = "staff";
    }
    this.requestObject = {
      "api_key": global_data.api_key,
      "firstname": this.first_name,
      "lastname": this.last_name,
      "address": this._address,
      "city": this.city,
      "state": this.state,
      "phone": this.phone,
      "zip": this.zipcode,
      "user_id": this.user_id,
      "type": this.type,
      "email": this.user_email,
      "action": "profile_detail_update"
    };
    console.log('Request update', this.requestObject);
    this.showLoader();
    this.serviceProvider.servicePostAddress(this.requestObject).then((result) => {
      this.loading.dismiss();
      this.userResponse = result;
      console.log('Get Response', this.userResponse);
      if (this.userResponse.status == "true") {
        this.messResponse = this.userResponse.response;
        localStorage.setItem("zip", this.zipcode);
        localStorage.setItem("address", this._address);
        localStorage.setItem("city", this.city);
        localStorage.setItem("state", this.state);
        this.presentToast(this.messResponse);
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
