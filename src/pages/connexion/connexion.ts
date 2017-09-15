import { Component } from '@angular/core';

import {LoadingController, NavController, AlertController, Platform } from 'ionic-angular';
import { Main } from '../main/main';
import { Forget } from '../forget/forget';
import { Datafeeder  } from '../../app/datafeeder';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-connexion',
    templateUrl: 'connexion.html',
    providers: [InAppBrowser]
})
export class Connexion {
    nav: any;
    flogin: string;
    fpassword:  string;
    showbtins: boolean;
    loader: any;

    constructor(public platform: Platform, private ga: GoogleAnalytics,public navCtrl: NavController,public storage: Storage,public loadingController: LoadingController, public alertCtrl: AlertController, private Datafeeder : Datafeeder , private iab: InAppBrowser ) {


        window.addEventListener('native.keyboardshow', this.onOpenKeyboard);
        window.addEventListener('native.keyboardhide', this.onCloseKeyboard);
        this.showbtins = true;

          this.platform.ready().then(() => {
                 this.ga.trackView("Connexion","#connexion",true);
             });
    
    }
    onOpenKeyboard(e)
    {

        this.showbtins = false;

    }
    onCloseKeyboard(e)
    {

        this.showbtins = true;

    }

    register() {

    const browser = this.iab.create('http://www.camptocamp.org/auth#to=%2F');

        browser.on("loadstop").subscribe(() => {


            browser.insertCSS({code:"div[ng-show=\"authCtrl.uiStates.showLoginForm\"]{display:none!important;} div[ng-show=\"authCtrl.uiStates.showRegisterForm\"]{display:block!important;} div[ng-show=\"authCtrl.uiStates.showRegisterForm\"].ng-hide:not(.ng-hide-animate){display:block!important;} "});
        })


    }
    navigateTo(page) {
        switch(page)
                {
            case "page1":
                this.connexion()
                break;


            case "main":
                this.storage.remove('id');
                this.storage.remove('name');
                this.storage.remove('username'); 
                this.storage.remove('forum_username'); 
                this.storage.remove('token'); 
                this.storage.remove('expire'); 
                this.storage.remove('lang'); 
                this.storage.remove('portrait'); 
                this.Datafeeder.setIsLogged(false);
                this.navCtrl.setRoot(Main);
                break;
            case "forget":

                this.navCtrl.push(Forget);
                break;
        }
    }

    public loginResult(result)
    {
        if(result)
        {
            this.navCtrl.setRoot(Main);
        }
        else
        {
            this.loader.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Connexion impossible',
                subTitle: 'Identifiant ou mot de passe incorrect',
                buttons: ['Fermer']
            });
            alert.present();
        }
    }
    connexion()
    {
        this.loader = this.loadingController.create({
            content: "Connexion en cours",
            dismissOnPageChange: true
        });  
        this.loader.present();
        this.Datafeeder.requestapi("login",{login:this.flogin,password:this.fpassword,view:this});

    }

}