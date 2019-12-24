import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { AddaddressPage } from '../pages/addaddress/addaddress';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MyordersPage } from '../pages/myorders/myorders';
import { NotificationPage } from '../pages/notification/notification';
import { OffersPage } from '../pages/offers/offers';
import { OrderconfirmedPage } from '../pages/orderconfirmed/orderconfirmed';
import { OrderslipPage } from '../pages/orderslip/orderslip';
import { OtpPage } from '../pages/otp/otp';
import { PasswordPage } from '../pages/password/password';
import { PaymentPage } from '../pages/payment/payment';
import { ProfilePage } from '../pages/profile/profile';
import { RatePage } from '../pages/rate/rate';
import { SelectaddressPage } from '../pages/selectaddress/selectaddress';
import { SelectclothesPage } from '../pages/selectclothes/selectclothes';
import { SelectdatePage } from '../pages/selectdate/selectdate';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TncPage } from '../pages/tnc/tnc';
 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServicProvider } from '../providers/servic/servic';
import { GlobalProvider } from '../providers/global/global';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ActiveAppointmentPage } from '../pages/active-appointment/active-appointment';
import { BookingDetailsPage } from '../pages/booking-details/booking-details';
import { OrderStaffPage } from '../pages/order-staff/order-staff';
import { AllShopsListPage } from '../pages/all-shops-list/all-shops-list';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AccountPage,
    AddaddressPage,
    ContactPage,
    HomePage,
    MyordersPage,
    NotificationPage,
    OffersPage,
    OrderconfirmedPage,
    OrderslipPage,
    OtpPage,
    PasswordPage,
    PaymentPage,
    ProfilePage,
    RatePage,
    SelectaddressPage,
    SelectclothesPage,
    SelectdatePage,
    SigninPage,
    SignupPage,
    TabsPage,
    TncPage,
    ChangePasswordPage,
    ActiveAppointmentPage,
    BookingDetailsPage,
    OrderStaffPage,
    AllShopsListPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AccountPage,
    AddaddressPage,
    ContactPage,
    HomePage,
    MyordersPage,
    NotificationPage,
    OffersPage,
    OrderconfirmedPage,
    OrderslipPage,
    OtpPage,
    PasswordPage,
    PaymentPage,
    ProfilePage,
    RatePage,
    SelectaddressPage,
    SelectclothesPage,
    SelectdatePage,
    SigninPage,
    SignupPage,
    TabsPage,
    TncPage,
    ChangePasswordPage,
    ActiveAppointmentPage,
    BookingDetailsPage,
    OrderStaffPage,
    AllShopsListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServicProvider,
    GlobalProvider,
    Geolocation, NativeGeocoder
  ]
})
export class AppModule {}
