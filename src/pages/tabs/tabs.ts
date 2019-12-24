import { Component } from '@angular/core';

import { AccountPage } from '../account/account';
// import { OffersPage } from '../offers/offers';
import { NotificationPage } from '../notification/notification';
import { HomePage } from '../home/home';
import { ActiveAppointmentPage } from '../active-appointment/active-appointment';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
 
  tab1Root = HomePage;
  tab2Root = NotificationPage;
  tab3Root = ActiveAppointmentPage;
  tab4Root = AccountPage;

  constructor() {
    console.log('arshad Tabs');
  }
}
