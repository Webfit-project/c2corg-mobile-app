import { Component } from '@angular/core';
import { Config_gnl } from '../config_gnl/config_gnl';
import { Config_alerte } from '../config_alerte/config_alerte';
import { Config_alerte_sms } from '../config_alerte_sms/config_alerte_sms';
import { Copyright } from '../copyright/copyright';
import { Shop} from '../shop/shop';
import { Config_gps } from '../config_gps/config_gps';
import { NavController,NavParams,Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Connexion } from '../connexion/connexion';
import { Datafeeder  } from '../../app/datafeeder';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
@Component({
    selector: 'page-config',
    templateUrl: 'config.html'
})
export class Config {

    portrait:string;
    constructor(public platform: Platform, private ga: GoogleAnalytics,public navCtrl: NavController, public navParams:NavParams,public storage:Storage, private Datafeeder : Datafeeder) {
        let portrait = navParams.get('portrait');

        if(portrait == null)
        {
            this.storage.get('portrait').then((portrait) => { 
                this.portrait = portrait;
            });
        }
        else
        {
            this.portrait = portrait;
        }

        this.platform.ready().then(() => {
            this.ga.trackView("Config page","#config",true);
        });
    }


    item_options = [
        {title:'Options générales',id:'config_gnl'},
        {title:'Options du GPS',id:'config_gps'}/*,
        {title:'Alerte programmable',id:'config_alerte'},
        {title:'Alerte sms',id:'config_alerte_sms'}
        */
    ];

    item_info = [
        {title:'Boutique en ligne',id:'shop'},
        {title:'Copyright',id:'copyright'}

    ];

    item_other = [
        {title:'Deconnexion',id:'deco'}

    ];

    itemSelected(item: string) {
        switch(item)
                {
            case "config_gps":
                this.navCtrl.push(Config_gps,{portrait:this.portrait});
                break;

            case "config_gnl":
                this.navCtrl.push(Config_gnl,{portrait:this.portrait});
                break;

            case "config_alerte":
                this.navCtrl.push(Config_alerte,{portrait:this.portrait});
                break;
            case "config_alerte_sms":
                this.navCtrl.push(Config_alerte_sms,{portrait:this.portrait});
                break;  
            case "shop":
                this.navCtrl.push(Shop,{portrait:this.portrait});
                break;

            case "copyright":
                this.navCtrl.push(Copyright,{portrait:this.portrait});
                break;

            case "deco":
                this.storage.remove('id');
                this.storage.remove('name');
                this.storage.remove('username'); 
                this.storage.remove('forum_username'); 
                this.storage.remove('token'); 
                this.storage.remove('expire'); 
                this.storage.remove('lang'); 
                this.storage.remove('portrait'); 
                this.Datafeeder.setIsLogged(false);
                this.navCtrl.setRoot(Connexion);
                break;
        }
    }
}