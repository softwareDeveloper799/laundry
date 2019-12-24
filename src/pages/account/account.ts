import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { MyordersPage } from '../myorders/myorders';
import { AddaddressPage } from '../addaddress/addaddress';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { TncPage } from '../tnc/tnc';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  name: any;
  user_email: any;
  user_img: any;
  constructor(public navCtrl: NavController, public appCtrl: App) {
    this.name = localStorage.getItem('user_name');
    this.user_email = localStorage.getItem('user_email');
    this.user_img = localStorage.getItem('user_img');
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }
  myorders() {
    this.navCtrl.push(MyordersPage);
  }
  addaddress() {
    this.navCtrl.push(AddaddressPage);
  }
  about() {
    this.navCtrl.push(AboutPage);
  }
  contact() {
    this.navCtrl.push(ContactPage);
  }
  tnc() {
    this.navCtrl.push(TncPage);
  }
  signin() {
    this.appCtrl.getRootNavs()[0].push(SigninPage);
    window.localStorage.clear();
  }

}
