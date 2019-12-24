import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';

@Component({
  selector: 'page-myorders',
  templateUrl: 'myorders.html'
})
export class MyordersPage {
  public loading: any;
  public requestData: any;
  public dataResponse: any;
  public bookingDetails = [];
  public unitList = [];
  public unit: string = "0";
  public order_id: string = "";
  order: string = "order_info";
  public currSymbol: string = "$";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serviceProvider: ServicProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.order_id = this.navParams.get('order_id');
    this.currSymbol = localStorage.getItem('currSymbol');
    console.log('currSymbol', this.currSymbol);
    this.fnDetailsBooking();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStaffPage');
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
  fnDetailsBooking() {
    this.requestData = {
      "api_key": global_data.api_key,
      "order_id": this.order_id,
      "action": "get_appointment_detail"
    };
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.bookingDetails = this.dataResponse.response;
        for (let i = 0; i < this.bookingDetails.length; i++) {
          this.unit = this.bookingDetails[i].unit_title;
        }
        this.unitList = this.unit.split(',');
        console.log('List Unit', this.unitList);
        console.log('Details Data ', this.bookingDetails);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
}
