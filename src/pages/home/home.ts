import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from 'ionic-angular';
import { SelectclothesPage } from '../selectclothes/selectclothes';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
import { BookingDetailsPage } from '../../pages/booking-details/booking-details';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public requestData: any;
  public loading: any;
  public dataResponse: any;
  public allServices: any;
  public allActiveBooking = [];
  public allActive = [];
  public allActiveBookingResponse: any;
  public totalActiveOrder: string = "0";
  public order_id: string = "0";
  public cancelResponse: any;
  public currSymbol: string = "$";
  slides = [
    {
      image: "assets/imgs/banner1.png",
      title: "Get quick booking <br>details",
    },
    {
      image: "assets/imgs/banner2.png",
      title: "Cleaning, Done it <br>Right",
    }
  ];
  services = [
    {
      image: "assets/imgs/washing.png",
      title: "Wash & Fold",
      small: "Min 12 Hours",
    },
    {
      image: "assets/imgs/iron.png",
      title: "Wash & Iorn",
      small: "Min 6 Hours",
    },
    {
      image: "assets/imgs/dryclean.png",
      title: "Dry Clean",
      small: "Min 24 Hours",
    }
  ];
  constructor(
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.currSymbol = localStorage.getItem('currSymbol');
    console.log('currSymbol', this.currSymbol);
    this.fnGetAllServices();
  }
  ionViewDidEnter() {
    this.fnGetActiveBooking();
  }
  fnGetAllServices() {
    this.requestData = {
      "api_key": global_data.api_key,
      "action": "get_all_services",
    };
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.allServices = this.dataResponse.response;
      } else {
        this.presentToast("Services is not available");
      }
      console.log('Response Services data', this.allServices)
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  fnGetActiveBooking() {
    this.allActiveBooking = [];
    this.allActive = [];
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": localStorage.getItem("user_id"),
      "page": "1",
      "user_type": localStorage.getItem("user_type"),
      "action": "get_user_appointments_list"
    };
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.allActiveBookingResponse = result;
      if (this.allActiveBookingResponse.status == "true") {
        this.allActiveBooking = this.allActiveBookingResponse.response;
        for (let i = 0; i < this.allActiveBooking.length; i++) {
          if (this.allActiveBooking[i].booking_status == "A") {
            this.allActive.push(this.allActiveBooking[i]);
          }
        }
        this.totalActiveOrder = "" + this.allActive.length;
        console.log('Past data', this.allActiveBooking);
      } else {
        console.log('Past data', 'Past Booking not available');
      }
    }, (err) => {
    });
  }
  selectclothes(id, serviceName) {
    localStorage.setItem('selectedServiceName', serviceName);
    localStorage.setItem('servicesId', id);
    console.log(id);
    this.navCtrl.push(SelectclothesPage, {
      servicesId: id
    });
  }
  fnGotoAllOrder() {
    this.navCtrl.parent.select(2);
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
  fnGetDetails(orderId) {
    this.order_id = orderId;
    let modal = this.modalCtrl.create(BookingDetailsPage, { order_id: this.order_id });
    modal.present();
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
}
