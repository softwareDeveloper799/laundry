import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
import { BookingDetailsPage } from '../../pages/booking-details/booking-details';
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public allBookingResponse: any;
  public allBooking = [];
  public allData = [];
  public order_id: string = "0";
  public cancelResponse: any;
  public totalCount: string = "0";
  public currSymbol: string = "$";
  constructor(
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.currSymbol = localStorage.getItem('currSymbol');
    console.log('currSymbol', this.currSymbol);
  }
  fnGetAllBooking() {
    this.allBooking = [];
    this.allData = [];
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": localStorage.getItem("user_id"),
      "page": "1",
      "user_type": localStorage.getItem("user_type"),
      "action": "get_user_appointments_list"
    };
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.allBookingResponse = result;
      if (this.allBookingResponse.status == "true") {
        this.allBooking = this.allBookingResponse.response;
        for (let i = 0; i < this.allBooking.length; i++) {
          this.allData.push(this.allBooking[i]);
        }
        this.totalCount = "" + this.allData.length;
        console.log("Total data", this.totalCount);
        console.log('All Booking data', this.allBooking);
      }
    }, (err) => {
      this.presentToast("Server down...");
    });
  }
  ionViewDidEnter() {
    this.fnGetAllBooking();
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
  doCancel(order_id) {
    const alert = this.alertCtrl.create({
      title: 'Cancel Appointment',
      message: 'Enter a Reason for this Canceling Appointment',
      inputs: [
        {
          name: 'reason',
          placeholder: 'Enter Reason'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: (data: any) => {
            console.log('Confirm clicked', data.reason);
            this.fnCancelAppointment(order_id, data.reason);
          }
        }
      ]
    });
    alert.present();
  }
  fnCancelAppointment(order_id, data) {
    this.requestData = {
      "api_key": global_data.api_key,
      "order_id": order_id,
      "cancel_reason": data,
      "gc_event_id": "you will get this id from my appointment api",
      "gc_staff_event_id": "you will get this id from my appointment api",
      "pid": "provider id here if any of staff assigned to this appointment",
      "action": "cancel_appointment"
    };
    console.log(this.requestData);
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.cancelResponse = result;
      if (this.cancelResponse.status == "true") {
        this.presentToast(this.cancelResponse.response);
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      } else {
        this.presentToast(this.cancelResponse.response);
      }
    }, (err) => {
      this.presentToast("Server down...");
    });
  }
  fnGetDetails(orderId) {
    this.order_id = orderId;
    let modal = this.modalCtrl.create(BookingDetailsPage, { order_id: this.order_id });
    modal.present();
  }
}
