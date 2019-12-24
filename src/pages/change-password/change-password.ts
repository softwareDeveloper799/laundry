import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, App } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { global_data } from '../../providers/global';
import { ServicProvider } from '../../providers/servic/servic';
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  public oldPassBoolean: boolean = false;
  public oldPass: string;
  public confirmPassword: string;
  public firstPass: string;
  public email: string = "";
  public requestData: any;
  public dataResponse: any;
  public loading: any;
  public from: string = "";
  public user_id: string = "";
  public user_type: string = "";
  public object = { "confirmPassword": "", "firstPass": "" };
  public objectTwo = { "oldPass": "", "confirmPassword": "", "firstPass": "" };
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public serviceProvider: ServicProvider
  ) {
    this.object = { "confirmPassword": this.confirmPassword, "firstPass": this.firstPass };
    this.objectTwo = { "oldPass": this.oldPass, "confirmPassword": this.confirmPassword, "firstPass": this.firstPass };
    this.user_id = localStorage.getItem('user_id');
    this.email = localStorage.getItem('user_email');
    this.user_type = localStorage.getItem('user_type');
    this.from = navParams.get('from');
    if (this.from == "profile") {
      this.oldPassBoolean = true;
    } else {
      this.oldPassBoolean = false;
    }
    if (this.user_type == "client") {
      this.user_type = "user";
    } else {
      this.user_type = "staff";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  signin() {
    this.requestData = {
      "api_key": global_data.api_key,
      "email": this.email,
      "newpassword": this.confirmPassword,
      "action": "forgot_password"
    }
    console.log(this.requestData);
    console.log(this.object);
    if (this.object.firstPass != "" && this.object.confirmPassword != "") {
      if (this.object.firstPass == this.object.confirmPassword) {
        this.showLoader();
        console.log('Resquest Object', this.requestData)
        this.serviceProvider.servicePost(this.requestData).then((result) => {
          this.loading.dismiss();
          this.dataResponse = result;
          if (this.dataResponse.status == "true") {
            this.presentToast(this.dataResponse.response);
            this.navCtrl.push(SigninPage)
          } else {
            this.presentToast(this.dataResponse.response);
          }

        }, (err) => {
          this.loading.dismiss();
          this.presentToast("Server down...");
        });
      } else {
        this.presentToast("Password does not match! ");
      }

    } else {
      this.presentToast("Enter password! ");
    }
  }
  changePass() {
    this.requestData = {
      "api_key": global_data.api_key,
      "user_id": this.user_id,
      "type": this.user_type,
      "old_password": this.oldPass,
      "new_password": this.firstPass,
      "confirm_password": this.confirmPassword,
      "action": "change_password"
    }
    console.log(this.requestData);
    console.log(this.objectTwo);
    if (this.objectTwo.firstPass != "" && this.objectTwo.firstPass != "" && this.objectTwo.confirmPassword != "") {
      if (this.objectTwo.firstPass == this.objectTwo.confirmPassword) {
        this.showLoader();
        console.log('Resquest Object', this.requestData)
        this.serviceProvider.servicePost(this.requestData).then((result) => {
          this.loading.dismiss();
          this.dataResponse = result;
          if (this.dataResponse.status == "true") {
            this.presentToast(this.dataResponse.response);
            localStorage.clear();
            window.localStorage.clear();
            this.appCtrl.getRootNav().setRoot(SigninPage);
          } else {
            this.presentToast(this.dataResponse.response);
          }

        }, (err) => {
          this.loading.dismiss();
          this.presentToast("Server down...");
        });
      } else {
        this.presentToast("Password does not match! ");
      }

    } else {
      this.presentToast("Enter password! ");
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
}
