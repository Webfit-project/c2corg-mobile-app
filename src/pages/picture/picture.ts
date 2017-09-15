import { Component } from '@angular/core';
import { NavController,NavParams,  ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';

@Component({
    selector: 'page-picture',
    templateUrl: 'picture.html'
})

export class Picture {
    data:any;
    img:string;
    loader:boolean;
    btsave:boolean;
    title:string;
    categories:Array<string>;
    activities:Array<string>;
    type:string;

    constructor(public viewCtrl: ViewController, public navCtrl: NavController,navParams: NavParams, public storage:Storage, public GlobalService:GlobalService) {
        this.loader = false;
        this.btsave = true;
        this.activities = Array();
        this.categories = Array();
        this.data = navParams.get("data");
        this.img = this.data.filename;
        this.type = "personal";
        var activity = navParams.get("activity");
        if(activity != null)
            this.activities.push(activity);

    }
    
    close() {
        this.viewCtrl.dismiss();
    }
    
    save() {
        var uid = this.GlobalService.guid();

        this.storage.set('imginwait-'+uid, {id:uid,data:this.data,attribute: {title:this.title,type:this.type,categories:this.categories}});   

        this.viewCtrl.dismiss({ id:uid});

    }

}