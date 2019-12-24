import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
import { BookingDetailsPage } from '../../pages/booking-details/booking-details';
@Component({
  selector: 'page-active-appointment',
  templateUrl: 'active-appointment.html',
})
export class ActiveAppointmentPage {
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public allBookingResponse: any;
  public allBooking = [];
  public activBooking = [];
  public totalActiveBooking: string = "0";
  public order_id: string = "0";
  public cancelResponse: any;
  public currSymbol: string = "$";
  constructor(
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ActiveAppointmentPage');
    this.currSymbol = localStorage.getItem('currSymbol');
    console.log('currSymbol', this.currSymbol);
  }
  ionViewDidEnter() {
    this.fnGetActiveBooking();
  }
  fnGetActiveBooking() {
    this.allBooking = [];
    this.activBooking = [];
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": localStorage.getItem("user_id"),
      "page": "1",
      "user_type": localStorage.getItem("user_type"),
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
            this.activBooking.push(this.allBooking[i]);
          }
        }
        this.totalActiveBooking = "" + this.activBooking.length;
        console.log('All Booking data', this.allBooking);
        console.log('Active Booking data', this.activBooking);
      }
      //  else {
      //   this.presentToast(this.allBookingResponse.response);
      // }
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
      console.log('Response cancel', this.cancelResponse.response);
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
