import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { SelectdatePage } from '../selectdate/selectdate';
// import { SelectaddressPage } from '../selectaddress/selectaddress';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-orderconfirmed',
  templateUrl: 'orderconfirmed.html'
})
export class OrderconfirmedPage {
  public orderListArray: any;
  public selectedServiceName: any;
  public totalAmt: string = "0";
  public taxArray: any;
  public taxAmmount: string = "";
  public grandTotal: string = "";
  public grandTotalCoupon: string;
  public loading: any;
  public requestData: any;
  public dataResponse: any;
  public getCoupon: string = "";
  public couponResponse: any;
  public getCouponBoolean: Boolean = false;
  public couponDiscount: string = "0";
  public couponDiscountType: string = "0";
  public currSymbol: string = "$";
  public cart_detail = [];
  public order_details = [];
  constructor(public navCtrl: NavController, public serviceProvider: ServicProvider, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.selectedServiceName = localStorage.getItem('selectedServiceName');
    this.orderListArray = JSON.parse(localStorage.getItem('OrderList'));
    this.currSymbol = localStorage.getItem('currSymbol');
    this.taxArray = JSON.parse(localStorage.getItem('tax'));
    let total = 0;
    for (var i = 0; i < this.orderListArray.length; i++) {
      total = this.orderListArray[i].base_price * this.orderListArray[i].minlimit;
      this.orderListArray.find(v => v.id == this.orderListArray[i].id).total = "" + total;
    }
    for (var j = 0; j < this.orderListArray.length; j++) {
      if (this.orderListArray[j].minlimit != "0") {
        this.order_details.push(this.orderListArray[j]);
      }
    }
    this.totalAmt = "" + this.itemTotal().toFixed(2);
    for (let obj of this.orderListArray) {
      if (obj.minlimit != "0") {
        this.cart_detail.push({
          id: obj.id,
          service_id: localStorage.getItem('servicesId'),
          unit_name: obj.units_title,
          unit_rate: obj.base_price,
          unit_qty: obj.minlimit
        });
      }
    }
    localStorage.setItem('cart_detail', JSON.stringify(this.cart_detail));
  }
  itemTotal() {
    let total = 0;
    for (var i = 0; i < this.orderListArray.length; i++) {
      if (this.orderListArray[i].total) {
        total += Number(this.orderListArray[i].total);
      }
    }
    this.taxAmmount = "" + this.taxCalculation(total);
    return total;
  }
  selectaddress() {
    if (this.getCouponBoolean) {
      localStorage.setItem('booleanDiscount', "true");
      localStorage.setItem('total_amt', this.grandTotalCoupon);
    } else {
      localStorage.setItem('booleanDiscount', "false");
      localStorage.setItem('total_amt', this.grandTotal);
    }
    localStorage.setItem('sub_total', this.totalAmt);
    localStorage.setItem('discount', this.couponDiscount);
    localStorage.setItem('tax', this.taxAmmount);
    localStorage.setItem('booleanDiscount', "" + this.getCouponBoolean);
    localStorage.setItem('OrderList', JSON.stringify(this.order_details));
    this.navCtrl.push(SelectdatePage);
  }
  fnGetPromocode() {
    this.requestData = {
      "api_key": global_data.api_key,
      "coupon_code": this.getCoupon,
      "action": "check_couponcode"
    };
    console.log('Request Json :', this.requestData);
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.couponResponse = this.dataResponse.response;
        localStorage.setItem('coupon_code', this.getCoupon);
        // console.log(this.couponResponse);
        this.grandTotalCoupon = "" + this.couponCalculator(this.grandTotal, this.couponResponse.coupon_value, this.couponResponse.coupon_type);
        this.getCouponBoolean = true;
      } else {
        this.presentToast(this.dataResponse.response);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  closeCoupon() {
    this.getCouponBoolean = false;
    // this.grandTotal=""+this.couponCalculator(this.grandTotal,0,"N");
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
  taxCalculation(total) {
    var taxType = this.taxArray.type;
    let taxValue = this.taxArray.value;
    let payTaxValue = 0;
    if (taxType == "P") {
      payTaxValue = parseFloat(taxValue);
    } else if (taxType == "F") {
      payTaxValue = ( parseFloat(taxValue) / 100) * total;
    }
    console.log("grandTotal"+total + payTaxValue);
    this.grandTotal = parseFloat(total + payTaxValue).toFixed(2);
    return payTaxValue.toFixed(2);
  }
  couponCalculator(total, val, type) {
    console.log('Coupon', total);
    let discount = 0;
    if (type == 'P') {
      discount = total * (100 / val);
      this.couponDiscountType = "%"
      this.couponDiscount = "" + (val).toFixed(2);
    } else if (type == 'F') {
      discount = total - (val);
      this.couponDiscountType = "Flat"
      this.couponDiscount = "" + parseFloat(val).toFixed(2);
    } else {
      discount = total;
    }
    return (discount).toFixed(2);
  }
}
