import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GlobalProvider Provider');
  }

}
