import { Component } from '@angular/core';
import { NavParams   } from 'ionic-angular';

@Component({
    selector: 'page-topos-slides',
    templateUrl: 'topos_slides.html'
})
export class Topos_slides {

    slides : Array<any>;

    constructor(private navParams: NavParams) {
        this.slides = navParams.get('images');
    }

}
