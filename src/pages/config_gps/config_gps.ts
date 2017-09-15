import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController,NavParams,Platform ,AlertController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-config-gps',
    templateUrl: 'config_gps.html'
})

export class Config_gps {

    precision: number = 25;
    badge_precision: number = 25;
    distanceFilter:number = 20;
    badge_distanceFilter: number = 20;

    frequency: number = 0;
    badge_frequency: number = 0;
    battery: number = 30;
    badge_battery: number = 30;
    portrait:string;

    constructor(public platform: Platform, public alertCtrl: AlertController,private ga: GoogleAnalytics,public storage:Storage,public navCtrl: NavController,navParams: NavParams) {
        this.portrait = navParams.get('portrait');
        storage.get('precision').then((val) => { 
            if(val != null)
            {
                this.precision = val;
                this.badge_precision = val;
            }
        });

        storage.get('frequency').then((val) => { 
            if(val != null)
            {
                this.frequency = val;
                this.badge_frequency = val;
            }
        });
        storage.get('distanceFilter').then((val) => { 
            if(val != null)
            {
                this.distanceFilter = val;
                this.badge_distanceFilter = val;
            }
        });

        storage.get('battery').then((val) => { 
            if(val != null)
            {
                this.battery = val;
                this.badge_battery = val;
            }
        });

        this.platform.ready().then(() => {
            this.ga.trackView("Config gps","#config_gps",true);
        });
    }
    ionViewWillLeave() {
        this.storage.set('precision',this.precision);
        this.storage.set('frequency',this.frequency);
        this.storage.set('battery',this.battery);
        this.storage.set('distanceFilter',this.distanceFilter);
    }
    itemChange(id: string, item: string) {

        switch(id)
                {
            case "precision":
                this.badge_precision = this.precision;
            case "frequency":
                this.badge_frequency = this.frequency;
            case "battery":
                this.badge_battery = this.battery;
            case "distanceFilter":
                this.badge_distanceFilter = this.distanceFilter;
        }

    }

    razConfig()
    {

        let alertPopup = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Attention, voulez vous remettre la configuration du Gps à sa configuration d\'origine ?.',
            buttons: [{
                text: 'Valider',
                role: 'cancel',
                handler: () => {
                    this.precision = 25;
                    this.badge_precision = 25;
                    this.distanceFilter = 20;
                    this.badge_distanceFilter = 20;
                    this.frequency = 0;
                    this.badge_frequency = 0;
                    this.battery = 30;
                    this.badge_battery = 30;  
                }
            },{
                text: 'Annuler',
                role:'cancel',
                handler: () => {

                }
            }]
        });

        alertPopup.present();
    }

}