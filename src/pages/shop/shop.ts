import { Component } from '@angular/core';
import {InAppBrowser} from 'ionic-native';
import { NavController,NavParams,Platform } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-shop',
    templateUrl: 'shop.html'
})
export class Shop {
    portrait:string;
    constructor(public platform: Platform, private ga: GoogleAnalytics,public navCtrl: NavController,navParams: NavParams) {
        this.portrait = navParams.get('portrait');
         this.platform.ready().then(() => {
             this.ga.trackView("Page shop","#shop",true);
         });
    }


    openShop()
    {
        new InAppBrowser('https://www.webfit.fr/shop/?p=c2c', '_system');
    }
}