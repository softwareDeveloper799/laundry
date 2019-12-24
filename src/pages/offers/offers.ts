import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html'
})
export class OffersPage {
 items = [
    {
      title: "New User? First Wash Free!!",
      detail: "Oh! You're new User? Order & get your first washing up to 3 Cloths are free. You need to register",
      code: "NEWFREE3",
    },
     {
      title: "Upto 20% Discout on Credit Card Payment",
      detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
      code: "CREDIT20",
    },
     {
      title: "Summer Offier: Pay for Wash & get Iorned Free",
      detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
      code: "FREEIRON",
    }
  ];

  constructor(public navCtrl: NavController) {

  }

}
