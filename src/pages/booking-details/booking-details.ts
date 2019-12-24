import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, ViewController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-booking-details',
  templateUrl: 'booking-details.html',
})
export class BookingDetailsPage {
  public bookingResponse: any;
  public requestData: any;
  public bookingInfo = [];
  public loading: any;
  public orderId: string = "0";
  public unitList = [];
  public unit: string = "0";
  public unit2: string = "0";
  public unitList2 = [];
  public currSymbol: string = "$";
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.orderId = this.navParams.get('order_id');
    this.currSymbol = localStorage.getItem('currSymbol');
    console.log('currSymbol', this.currSymbol);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingDetailsPage');
    this.fnGetBookingDetails();
  }
  fnGetBookingDetails() {
    this.requestData = {
      "api_key": global_data.api_key,
      "order_id": this.orderId,
      "action": "get_appointment_detail"
    };
    console.log('Request data', this.requestData);
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.bookingResponse = result;
      if (this.bookingResponse.status == "true") {
        this.bookingInfo = this.bookingResponse.response;
        console.log('Booking Details', this.bookingInfo);
        for (let i = 0; i < this.bookingInfo.length; i++) {
          this.unit = this.bookingInfo[i].unit_title;
        }
        this.unitList = this.unit.split(',');
        console.log(this.unitList);
      } else {
        this.loading.dismiss();
        this.presentToast(this.bookingResponse.response);
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
  fnCloseModel() {
    this.viewCtrl.dismiss();
  }
}
