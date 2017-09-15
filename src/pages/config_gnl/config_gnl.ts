import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams,Platform } from 'ionic-angular';
import { GlobalService } from '../../app/app.global.service';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var nativemap: any;

@Component({
    selector: 'page-config-gnl',
    templateUrl: 'config_gnl.html'
})
export class Config_gnl {

    cachesize : string = "0mb";
    metrique : string;
    portrait:string;
    carte:string;
    debugmode: boolean = false;
    ltoposhl: boolean = false;

    constructor(public platform: Platform, private ga: GoogleAnalytics,private zone:NgZone,public GlobalService: GlobalService,public navCtrl: NavController,public storage: Storage,navParams: NavParams) {

        storage.get('unit').then((val) => {
            if(val == null || val == "m")
                this.metrique = "m";
            else if(val == "i")
                this.metrique = "i";
        });


        storage.get('debugmode').then((val) => {
            this.debugmode = val;
        });

        storage.get('carte').then((val) => {
            if(val == null)
                this.carte = "esri";
            else
                this.carte = val;

        });

        storage.get('ltoposhl').then((val) => {
            this.ltoposhl = val;
        });

        this.portrait = navParams.get('portrait');
        console.log("on get le cache");
        nativemap.getCacheSize((d) => { console.log("on affiche le cache"); this.cachesize = Math.round((d.size)/1048000).toString()+"mo"; this.zone.run(() => { }); },(err) => {console.log("erreur" + err);})
        
         this.platform.ready().then(() => {
             this.ga.trackView("Config gnl","#config_gnl",true);
         });
        
    }
    toposHlEvent(e)
    {
        this.storage.set('ltoposhl',e);
    }
    onChangeMetrique(e,u)
    {
        console.log("unit = " + u);
        this.storage.set('unit',u);
    }
    onChangeCarte(e,u)
    {

        this.storage.set('carte',u);
    }

    onChangeDebugmode(u)
    {
        this.storage.set('debugmode',u);
    }
    clearCache()
    {
        //var that = this;
        this.cachesize = "0mb";
        nativemap.clearCache(function(r){
        },function(e){console.log(e);})
    }
}