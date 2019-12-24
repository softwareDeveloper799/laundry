import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllShopsListPage } from './all-shops-list';

@NgModule({
  declarations: [
    AllShopsListPage,
  ],
  imports: [
    IonicPageModule.forChild(AllShopsListPage),
  ],
})
export class AllShopsListPageModule {}
