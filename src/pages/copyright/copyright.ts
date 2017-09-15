import { Component } from '@angular/core';
import {InAppBrowser} from 'ionic-native';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-copyright',
    templateUrl: 'copyright.html'
})
export class Copyright {
    portrait:string;
    constructor(public navCtrl: NavController,navParams: NavParams) {
        this.portrait = navParams.get('portrait');
    }

    gotoWf() {
        let browser = new InAppBrowser('https://www.webfit.fr', '_system');
    }
    
    gotoGH() {
        let browser = new InAppBrowser('https://github.com/Webfit-project/c2corg-mobile-app', '_system');
    }

}