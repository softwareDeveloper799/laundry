import { Component } from '@angular/core';
import { global_data } from '../../providers/global';
import { DatePipe } from '@angular/common';
import { NavController, LoadingController, ToastController, ViewController, App } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { TabsPage } from '../tabs/tabs';
@Component({
  selector: 'page-orderslip',
  templateUrl: 'orderslip.html',
  providers: [DatePipe]
})
export class OrderslipPage {
  public userRegister: boolean = true;
  public first_name: string = localStorage.getItem('first_name');
  public last_name: String = localStorage.getItem('last_name');
  public email: string = localStorage.getItem('user_email');
  public phone: string = localStorage.getItem('phone');
  public password: string = localStorage.getItem('user_pwd');
  public zipcode: string = localStorage.getItem('zip');
  public address: string = localStorage.getItem('address');
  public city: string = localStorage.getItem('city');
  public state: string = localStorage.getItem('state');
  public date: string = new Date().toISOString().substring(0, 10);
  public responseBooking: any;
  public loading: any;
  public dataResponse: any;
  public orderId: string = "";
  public pickDate: string = localStorage.getItem('pick_date');
  public pickTime: string = localStorage.getItem('pick_time');
  public deliverDate: string = localStorage.getItem('deliver_date');;
  public deliverTime: string = localStorage.getItem('deliver_time');
  public orderListArray: any;
  public sub_total = localStorage.getItem('sub_total');
  public discount = localStorage.getItem('discount');
  public tax = localStorage.getItem('tax');
  public grandTotal = localStorage.getItem('total_amt');
  public booleanDiscount = localStorage.getItem('booleanDiscount');
  public selectedServiceName: string = "";
  public currSymbol: string = "$";
  constructor(
    public appCtrl: App,
    public viewCtrl: ViewController,
    private datePipe: DatePipe,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider,
    public navCtrl: NavController
  ) {
    this.pickDate = this.datePipe.transform(this.pickDate, 'MMM dd, yyyy');
    this.deliverDate = this.datePipe.transform(this.deliverDate, 'MMM dd, yyyy');
    this.selectedServiceName = localStorage.getItem('selectedServiceName');
    this.orderListArray = JSON.parse(localStorage.getItem('OrderList'));
    this.currSymbol = localStorage.getItem('currSymbol');
    let total = 0;
    for (var i = 0; i < this.orderListArray.length; i++) {
      total = this.orderListArray[i].base_price * this.orderListArray[i].minlimit;
      this.orderListArray.find(v => v.id == this.orderListArray[i].id).total = "" + total;
    }
    this.fnConfirmBooking();
  }
  rate() {
    this.appCtrl.getRootNav().setRoot(TabsPage);
    this.navCtrl.setRoot(TabsPage);
  }
  fnConfirmBooking() {
    this.responseBooking = {
      "api_key": global_data.api_key,
      "action": "book_appointment",
      "first_name": this.first_name,
      "last_name": this.last_name,
      "email": this.email,
      "phone": this.phone,
      "password": this.password,
      "zipcode": this.zipcode,
      "address": this.address,
      "city": this.city,
      "state": this.state,
      "staff_id": "1",
      "booking_pickup_date_time_start": localStorage.getItem('booking_pickup_date_time_start'),
      "booking_pickup_date_time_end": localStorage.getItem('booking_pickup_date_time_end'),
      "booking_delivery_date_time_start": localStorage.getItem('booking_delivery_date_time_start'),
      "booking_delivery_date_time_end": localStorage.getItem('booking_delivery_date_time_end'),
      "user_type": "existing",
      "service_id": localStorage.getItem('servicesId'),
      "coupon_code": localStorage.getItem('coupon_code'),
      "payment_method": localStorage.getItem('payment_type'),
      "sub_total": localStorage.getItem('sub_total'),
      "discount": localStorage.getItem('discount'),
      "tax": localStorage.getItem('tax'),
      "net_amount": localStorage.getItem('total_amt'),
      "partial_amount": "0",
      "transaction_id": localStorage.getItem('transaction_id'),
      "cart_detail": JSON.parse(localStorage.getItem('cart_detail'))
    }
    console.log('responseBooking', this.responseBooking);
    this.showLoader();
    this.serviceProvider.servicePost(this.responseBooking).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.orderId = this.dataResponse.order_id;
      } else {
        this.userRegister = false;
        this.presentToast(this.dataResponse.response); 
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
