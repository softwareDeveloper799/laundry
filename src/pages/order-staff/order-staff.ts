import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { MyordersPage } from '../myorders/myorders';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
import { AccountPage } from '../account/account';
@Component({
  selector: 'page-order-staff',
  templateUrl: 'order-staff.html',
})
export class OrderStaffPage {
  status: string = "assigned";
  public loading: any;
  public requestData: any;
  public dataResponse: any;
  public allBookingResponse: any;
  public allBooking = [];
  public user_id: string = "";
  public currSymbol: string = "$";
  public activeBookingAvailable = 0;
  public completeBookingAvailable = 0;
  public activeBooking = [];
  public completeBooking = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serviceProvider: ServicProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    this.user_id = localStorage.getItem("user_id");
    this.currSymbol = localStorage.getItem("currSymbol");
    console.log('currSymbol', this.currSymbol);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStaffPage');
    this.fnGetAssignedBooking();
  }
  orderinfo(orderinfo: any) {
    this.navCtrl.push(MyordersPage, { order_id: orderinfo });
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
  fnGetAssignedBooking() {
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": this.user_id,
      "user_type": "staff",
      "action": "get_user_appointments_list"
    };
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.allBookingResponse = result;
      if (this.allBookingResponse.status == "true") {
        this.allBooking = this.allBookingResponse.response;
        for (let i = 0; i < this.allBooking.length; i++) {
          if (this.allBooking[i].booking_status == 'A') {
            this.activeBooking.push(this.allBooking[i]);
          } else if (this.allBooking[i].booking_status == 'CO') {
            this.completeBooking.push(this.allBooking[i]);
          }
        }
        this.activeBookingAvailable = this.activeBooking.length;
        this.completeBookingAvailable = this.completeBooking.length;
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  openSetting() {
    this.navCtrl.push(AccountPage);
  }
}
