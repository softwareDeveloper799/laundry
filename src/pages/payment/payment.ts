import { Component } from '@angular/core';
import { OrderslipPage } from '../orderslip/orderslip';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
import { NavController, LoadingController, ToastController, ModalController } from 'ionic-angular';
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {
  public payment: string = "strip";
  public cardNumber: string = "";
  public cardMonth: string = "";
  public cardYear: string = "";
  public cardCvv: string = "";
  public loading: any;
  public requestData: any;
  public dataResponse: any;
  public trasactionId: string = "";
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
  public month: any;
  public year = [];
  constructor(
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider,
    public navCtrl: NavController
  ) {
    var d = this.date.substring(0, 4);
    for (let i = 0; i < 10; i++) {
      this.year.push(parseInt(d) + i);
    }
    console.log(this.year);
    this.month = ["01", "02", "03", "04", "05","06", "07", "08", "09", "10", "11", "12"];
  }
  orderslip() {
    if (this.payment == "strip") {
      this.requestData = {
        "api_key": global_data.api_key,
        "full_name": localStorage.getItem('user_name'),
        "email": localStorage.getItem('user_email'),
        "card_number": this.cardNumber,
        "card_month": this.cardMonth,
        "card_year": this.cardYear,
        "card_cvv": this.cardCvv,
        "amount": localStorage.getItem('total_amt'),
        "action": "stripe_payment_method"
      };
      console.log('Request arshad', this.requestData);
      this.showLoader();
      this.serviceProvider.servicePost(this.requestData).then((result) => {
        this.loading.dismiss();
        this.dataResponse = result;
        if (this.dataResponse.status == "true") {
          this.trasactionId = this.dataResponse.response;
          localStorage.setItem('payment_type', "Strip");
          localStorage.setItem('transaction_id', this.trasactionId);
          this.navCtrl.push(OrderslipPage);
        } else {
          this.presentToast(this.dataResponse.response);
        }
      }, (err) => {
        this.loading.dismiss();
        this.presentToast("Server down...");
      });
    } else {
      localStorage.setItem('payment_type', "Pay Locally");
      localStorage.setItem('transaction_id', "");
      let modal = this.modalCtrl.create(OrderslipPage);
      modal.present();
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
  mask(event) {
    console.log("maskEvent func");
    setTimeout(() => {
      var inputTxt = event.srcElement.value;
      inputTxt = inputTxt ? inputTxt.split(" ").join("") : "";
      inputTxt = inputTxt.length > 16 ? inputTxt.substring(0, 16) : inputTxt;
      this.cardNumber = this.maskString(inputTxt);
    }, 500);
  }
  maskString(inputTxt) {
    inputTxt = inputTxt.replace(/\D/g, "");
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, "$1  $2");
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, "$1  $2");
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, "$1  $2");
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, "$1  $2");
    return inputTxt;
  }
} 
