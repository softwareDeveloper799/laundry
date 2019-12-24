import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServicProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'http://dclaundry.com/laundry/api/';
// let apiUrl = 'http://localhost/laundry_10/api/';

@Injectable()
export class ServicProvider {
  credentials_two:any;
  constructor(public http: HttpClient) {
    console.log('Hello ServicProvider Provider');
  }
  servicePost(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        this.http.post(apiUrl, (credentials), {headers: headers})
          .subscribe(res => {
             resolve(res);
          }, (err) => {
            reject(err);
          }); 
    });
  }
  servicePostAddress(credentials:any) {
    return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        console.log("Json resquest", JSON.stringify(credentials));
        this.http.post(apiUrl, JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
             resolve(res);
          }, (err) => {
            console.log(err);
            reject(err);
          });
    });
  }
}
