import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { OrderconfirmedPage } from '../orderconfirmed/orderconfirmed';
import { ServicProvider } from '../../providers/servic/servic';
import { global_data } from '../../providers/global';
@Component({
  selector: 'page-selectclothes',
  templateUrl: 'selectclothes.html'
})
export class SelectclothesPage {
  public loading: any;
  public requestData: any;
  public dataResponse: any;
  public dataResponseZip: any;
  public allUnits: any;
  public allUnitsBack = [];
  public servicesId: string = "";
  public totalAmt = 0;
  public selectedItem = 0;
  public listClothEnable: boolean = false;
  public zipCode: string;
  public currSymbol: string = "$";
  constructor(
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider,
    public navCtrl: NavController
  ) {
    this.listClothEnable = false;
    this.servicesId = navParams.get('servicesId');
    this.currSymbol = localStorage.getItem('currSymbol');
    this.fnGetUnitsList();
  }
  fnGetUnitsList() {
    this.requestData = {
      "api_key": global_data.api_key,
      "service_id": this.servicesId ,
      "action": "get_units_of_services_method"
    };
    this.allUnitsBack = [];
    console.log('Request arshad', this.requestData);
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponse = result;
      if (this.dataResponse.status == "true") {
        this.allUnits = this.dataResponse.response;
        for (let obj of this.allUnits) {
          localStorage.setItem('tax', JSON.stringify(obj.tax));
          this.allUnitsBack.push({
            id: obj.id,
            units_title: obj.units_title,
            base_price: obj.base_price,
            minlimit: "0",
            maxlimit: obj.maxlimit,
            predefine_image: obj.predefine_image,
            image: obj.image,
            total: ""
          });
          this.totalAmt = this.itemTotal();
          this.selectedItem = this.itemTotalSelected();
        }
      } else {
        this.presentToast(this.dataResponse.response);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  remove(id, minVal) {
    var cnt = minVal;
    if (minVal == "0") {
      this.allUnitsBack.find(v => v.id == id).minlimit = "0";
    } else {
      cnt--;
      this.allUnitsBack.find(v => v.id == id).minlimit = cnt;
    }
    this.totalAmt = this.itemTotal();
    this.selectedItem = this.itemTotalSelected();
  }
  add(id, minVal, maxVal) {
    var cnt = minVal;
    if (maxVal == cnt) {
      this.presentToast("Max Order is  - " + maxVal);
    } else {
      cnt++;
      this.allUnitsBack.find(v => v.id == id).minlimit = "" + cnt;
      this.allUnitsBack.find(v => v.id == id).totalAmt = "" + cnt;
    }
    this.totalAmt = this.itemTotal();
    this.selectedItem = this.itemTotalSelected();
  }
  fnCheckPostalCode() {
    this.requestData = {
      "api_key": "1",
      "postal_code": this.zipCode,
      "action": "check_postal_code"
    };
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result) => {
      this.loading.dismiss();
      this.dataResponseZip = result;
      if (this.dataResponseZip.status == "true") {
        localStorage.setItem("zip", this.zipCode);
        this.listClothEnable = true;
      } else {
        this.presentToast(this.dataResponseZip.response);
      }
    }, (err) => {
      this.loading.dismiss();
      this.presentToast("Server down...");
    });
  }
  orderconfirmed() {
    if (this.selectedItem == 0) {
      this.presentToast("Please select atleast one Cloth !");
    } else {
      localStorage.setItem('zipCode', this.zipCode);
      localStorage.setItem('OrderList', JSON.stringify(this.allUnitsBack));
      this.navCtrl.push(OrderconfirmedPage)
    }
  }
  itemTotal() {
    let total = 0;
    for (var i = 0; i < this.allUnitsBack.length; i++) {
      if (this.allUnitsBack[i].base_price && this.allUnitsBack[i].minlimit) {
        total += Number(this.allUnitsBack[i].base_price * this.allUnitsBack[i].minlimit);
      }
    }
    return total;
  }
  itemTotalSelected() {
    let total = 0;
    for (var i = 0; i < this.allUnitsBack.length; i++) {
      if (this.allUnitsBack[i].minlimit) {
        total += Number(this.allUnitsBack[i].minlimit);
      }
    }
    return total;
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
