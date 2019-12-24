import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SelectdatePage } from '../selectdate/selectdate';
@Component({
  selector: 'page-selectaddress',
  templateUrl: 'selectaddress.html'
})
export class SelectaddressPage {
  address: string = "home";
  public userInfo: any;
  public pltNum: string = "0";
  constructor(public navCtrl: NavController) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log("User Information", this.userInfo);
  }
  selectdate() {
    this.navCtrl.push(SelectdatePage)
  }
}
