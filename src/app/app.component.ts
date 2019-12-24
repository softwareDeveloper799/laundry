import { Component } from '@angular/core';
import { Platform ,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SigninPage } from '../pages/signin/signin';
import { OrderStaffPage } from '../pages/order-staff/order-staff';
import { AllShopsListPage } from '../pages/all-shops-list/all-shops-list';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public loading: any;
  rootPage: any = SigninPage;
  email: any = localStorage.getItem('user_email');
  name: any = localStorage.getItem('user_name');
  type: any = localStorage.getItem('user_type');
  constructor(platform: Platform, statusBar: StatusBar,
    public loadingCtrl: LoadingController,
     splashScreen: SplashScreen) {
    if (localStorage.getItem('user_name')) {
      if(localStorage.getItem('user_type')=='staff'){
        this.rootPage = OrderStaffPage;
      }else{
        this.rootPage = TabsPage;
      }
    } else {
      this.rootPage = SigninPage;
    }
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
