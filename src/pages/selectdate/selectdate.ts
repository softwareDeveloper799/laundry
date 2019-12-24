import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { PaymentPage } from '../payment/payment';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-selectdate',
  templateUrl: 'selectdate.html',
  providers: [DatePipe]
})
export class SelectdatePage {
  category: string = "pick";
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public dataResponseDeliver: any;
  public allDateList = [];
  public allDateListDelivery = [];
  public date: string = new Date().toISOString();
  public selectedDate: string = "";
  public selectedPicTime: string = "";
  public selectedDeliverDate: string = "";
  public selectedDeliverTime: string = "";
  public allTimeList: any;
  public allTimeListDelivery = [];
  public dataResponseTime: any;
  public dataResponseDeliverTime: any;
  public minimum_delivery_days = 0;
  public timeListDeliveryCount: string = "0";
  public timeListPickCount: string = "0";
  constructor(
    private datePipe: DatePipe,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    console.log('today', this.date.substring(0, 10));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    this.fnLoadDatePick();
  }
  fnLoadDatePick() {
    this.requestData = {
      "api_key": global_data.api_key,
      "action": "getAvailable_date"
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.minimum_delivery_days = parseInt(this.dataResponse.minimum_delivery_days);
        this.allDateList = this.dataResponse.response;
        // this.allDateListDelivery = this.dataResponse.response;
        this.selectedDate = this.date.substring(0, 10);
      }
      console.log('minimum_delivery_days', this.minimum_delivery_days);
      console.log(this.allDateList);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  fnLoadDateDeliver(date) {
    this.requestData = {
      "api_key": global_data.api_key,
      "limit_date": this.minimum_delivery_days,
      "selected_date": date,
      "action": "get_delivery_date"
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponseDeliver = result;
      if (this.dataResponseDeliver.status == "true") {
        this.allDateListDelivery = this.dataResponseDeliver.response;
        // this.selectedDate = this.date.substring(0, 10);
      }
      console.log('minimum_delivery_days', this.minimum_delivery_days);
      console.log(this.allDateList);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  fnListSlotPick(selectDate) {
    this.allTimeList = [];
    this.selectedDate = this.datePipe.transform(selectDate, 'yyyy-MM-dd');
    localStorage.setItem('deliver_date', this.selectedDate);
    this.requestData = {
      "api_key": "1",
      "selected_date": this.selectedDate,
      "staff_id": "1",
      "action": "get_slots"
    }
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.dataResponseTime = result;
      if (this.dataResponseTime.status == "true") {
        this.allTimeList = this.dataResponseTime.response;
      }
      this.timeListPickCount = "" + this.allTimeList.length;
    }, (err) => {
      this.presentToast("Server down...");
    });
  }
  fnListSlotDeliver(selectDate) {
    this.allTimeListDelivery = [];
    this.selectedDate = this.datePipe.transform(selectDate, 'yyyy-MM-dd');
    localStorage.setItem('deliver_date', this.selectedDate);
    this.requestData = {
      "api_key": "1",
      "selected_date": this.selectedDate,
      "staff_id": "1",
      "action": "get_slots"
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponseDeliverTime = result;
      if (this.dataResponseDeliverTime.status == "true") {
        this.allTimeListDelivery = this.dataResponseDeliverTime.response;
      }
      this.timeListDeliveryCount = "" + this.allTimeListDelivery.length;
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  fnSelectedTimeDeliver(item) {
    localStorage.setItem('deliver_time', item.substring(0, 5) + ":00");
    this.selectedDeliverTime = item.substring(0, 5) + ":00";
    console.log(item);
    localStorage.setItem('booking_delivery_date_time_start', this.selectedDate + " " + item.substring(0, 5) + ":00");
    localStorage.setItem('booking_delivery_date_time_end', this.selectedDate + " " + item.substring(13, 18) + ":00");
    console.log('booking_delivery_date_time_start', this.selectedDate + " " + item.substring(0, 5) + ":00");
    console.log('booking_delivery_date_time_end', this.selectedDate + " " + item.substring(13, 18) + ":00");
  }
  fnSelectedDateDeliver(selectDate) {
    this.allTimeListDelivery = [];
    this.selectedDeliverDate = selectDate;
    this.selectedDate = this.datePipe.transform(selectDate, 'yyyy-MM-dd');
    localStorage.setItem('deliver_date time', this.selectedDate);
    console.log('Selected deliver_date time:', this.selectedDate);
    this.fnListSlotDeliver(this.selectedDate);
  }
  fnSelectedDatePickup(dateList) {
    this.selectedDate = this.datePipe.transform(dateList, 'yyyy-MM-dd');
    localStorage.setItem('pick_date', this.selectedDate);
    this.fnLoadDateDeliver(this.selectedDate);
    this.fnListSlotPick(this.selectedDate);
  }
  fnSelectedTimePickup(item) {
    this.selectedPicTime = item.substring(0, 5) + ":00";
    localStorage.setItem('pick_time', item.substring(0, 5) + ":00");
    localStorage.setItem('booking_pickup_date_time_start', this.selectedDate + " " + item.substring(0, 5) + ":00");
    localStorage.setItem('booking_pickup_date_time_end', this.selectedDate + " " + item.substring(13, 18) + ":00");
    console.log('booking_pickup_date_time_start', this.selectedDate + " " + item.substring(0, 5) + ":00");
    console.log('booking_pickup_date_time_end', this.selectedDate + " " + item.substring(13, 18) + ":00");
  }
  payment() {
    if (this.selectedDate == '') {
      this.presentToast("Please select Date!");
    } else if (this.selectedPicTime == "") {
      this.presentToast("Please select time!");
    } else if (this.selectedDeliverDate == "") {
      this.presentToast("Please select delivery Date !");
    } else if (this.selectedDeliverTime == "") {
      this.presentToast("Please select delivery Time !");
    } else {
      this.navCtrl.push(PaymentPage);
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
