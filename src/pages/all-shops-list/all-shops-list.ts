import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { global_data } from '../../providers/global'
import { ServicProvider } from '../../providers/servic/servic';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AllShopsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-shops-list',
  templateUrl: 'all-shops-list.html',
})
export class AllShopsListPage {
requestData: any;
  loading: any;
  shopList : any = []
  constructor(public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public navParams: NavParams, 
    private geolocation: Geolocation, 
    private nativeGeocoder: NativeGeocoder,
    public serviceProvider: ServicProvider) {
  }

  ionViewDidLoad() {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
  };
    this.geolocation.getCurrentPosition().then((resp) => {
    alert(resp)
     this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
  .then((result: NativeGeocoderReverseResult[]) => {
   alert(JSON.stringify(result[0]))
    this.requestData = {
      "action": "get_all_shops",
      "api_key": global_data.api_key,
      "zip_code": result[0].postalCode
    }
    this.showLoader();
    this.serviceProvider.servicePost(this.requestData).then((result: any) => {
      this.loading.dismiss();
      console.log(result)
       if(result.status == "true") {
           this.shopList = result.response
       }
    }).catch(err => console.log(err))
  })
  .catch((error: any) => console.log('error- geocoder' + error));
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
  }

  selectShop(item) {
this.navCtrl.setRoot(TabsPage)
  }
}
