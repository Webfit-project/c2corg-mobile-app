import { Component, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Nav, Platform,Events} from 'ionic-angular';
import { StatusBar, Splashscreen,InAppBrowser } from 'ionic-native';

import { Main } from '../pages/main/main';
import { Connexion } from '../pages/connexion/connexion';
import { Config } from '../pages/config/config';
import { Topos_tabs } from '../pages/topos_tabs/topos_tabs';
import { Trace } from '../pages/trace/trace';
import { Shop } from '../pages/shop/shop';
import { Proximity_tabs } from '../pages/proximity_tabs/proximity_tabs';
import { Topos_page } from '../pages/topos_page/topos_page';
import {Outing} from '../pages/outing/outing';
import { Article } from '../pages/article/article';
import { Proximity_page } from '../pages/proximity_page/proximity_page';
import {Md5} from 'ts-md5/dist/md5';
import { Datafeeder } from './datafeeder';
import { Storage } from '@ionic/storage';
import { Notebook} from '../pages/notebook/notebook';

@Component({
    templateUrl: 'app.html',
    providers: [Datafeeder,GoogleAnalytics]
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
     storage: any;
     rootPage: any = Connexion;
     datafeeder: any;
     portrait:string;
     portraitm:string;
     name:string;
     pages: Array<{icon: string, title: string, component: any, info: Boolean}>;

     constructor(public platform: Platform, datafeeder:Datafeeder,storage: Storage,  private ga: GoogleAnalytics,public events: Events) {
         this.storage = storage;
         this.initializeApp();
         this.datafeeder = datafeeder;

         this.pages = [
             { icon:'glyphicon glyphicon-home', title: 'Accueil', component: Main , info: false},
             { icon:'glyphicon glyphicon-arrow-right', title: 'Topoguide', component: Topos_tabs , info: false},/*
    { icon:'glyphicon glyphicon-time', title: 'Sorties', component: Page2 , info: false}, */
             { icon:'glyphicon glyphicon-map-marker', title: 'A proximité', component: Proximity_tabs , info:false},
             { icon:'glyphicon glyphicon-pushpin', title: 'Enregistrer une trace', component: Trace ,info: false}, /*
    { icon:'glyphicon glyphicon-alert', title: 'Sécurité', component: Page2 , info: false},
    { icon:'glyphicon glyphicon-cloud', title: 'Météo', component: Page2 , info: false},*/
             { icon:'glyphicon glyphicon-pencil', title: 'Carnet de note', component: Notebook , info: false},
             { icon:'glyphicon glyphicon-cog', title: 'Options', component: Config , info: false},
             { icon:'glyphicon glyphicon-shopping-cart', title: 'Boutique en ligne', component: Shop , info: true},
             { icon:'glyphicon glyphicon-user', title: 'Changer d\'utilisateur', component: Connexion , info: false}
         ];

     }

     initializeApp() {

         this.events.subscribe('user:Name', data => {
             this.name = data.name;
         });
         this.events.subscribe('goto:Page', data => {
             this.gotoPage(data.type,data.id);
         });

         this.events.subscribe('user:loginFail', data => {

             this.nav.setRoot(Connexion);
         });

         this.events.subscribe('user:Portrait', data => {
             if(Md5.hashStr(data.portrait) == "ce53c330629ef544fa2bbef813749ac8")
             {
                 this.portraitm = "assets/img/f/fm.png";
                 this.portrait= "assets/img/p/default.svg";
             }
             else
             {
                 this.portraitm = data.portrait;
             }
         });

         this.platform.ready().then(() => {

             this.ga.startTrackerWithId('UA-59963830-2').then(() => {
                 this.ga.setAllowIDFACollection(true);

             }).then((_success) => {

             }).catch(e => console.log('Error starting GoogleAnalytics', e));    

             this.storage.ready().then(() => {
                 this.storage.get('name').then((val) => { this.name = val; });
                 this.storage.get('portrait').then((portrait) => {
                     if(portrait == null)
                     {
                         this.portraitm = "assets/img/f/fm.png";
                         this.portrait= "assets/img/p/default.svg";
                     }
                     else if(Md5.hashStr(portrait) == "ce53c330629ef544fa2bbef813749ac8")
                     {
                         this.portraitm = "assets/img/f/fm.png";
                         this.portrait= "assets/img/p/default.svg";
                     }
                     else
                     {
                         this.portraitm = portrait;
                         this.portrait = portrait;
                     }

                     this.storage.get('id').then((val) => {  
                         if(val != null && val != "") { 
                             this.nav.setRoot(Main,{portrait:this.portrait});   
                             setTimeout(function() { Splashscreen.hide(); } , 2000); 
                         }
                         else
                             Splashscreen.hide();
                     });
                 });

             });

             this.platform.registerBackButtonAction((e) => {
                 var view = this.nav.getActive();

                 if (this.nav.canGoBack()) 
                 {
                     this.nav.pop()
                 }
                 else
                 {
                     if(view.component == Main || view.component == Connexion)
                     {
                         this.platform.exitApp()
                     }
                     else
                     {
                         this.nav.setRoot(Main,{portrait:this.portrait});
                     }
                 }

                 return false;
             }, 1000);   

             StatusBar.styleDefault();
         });
     }

     openShop()
     {
         this.ga.trackEvent('Menu', 'Webfitshop', '#webfitshop', 0);
         new InAppBrowser('https://www.webfit.fr/shop/?p=c2c', '_system');
     }
     openPageShop() {
         this.nav.push(Shop);
     }
     gotoPage(type:string,id:string)
     {
         switch(type)
                 {
             case "r":
                 this.ga.trackEvent('Feed', 'Topos page', '#topos_page_from_feed', 0);
                 this.nav.push(Topos_page,{id:id}); 

                 break;

             case "w":
                 this.ga.trackEvent('Feed', 'Waypoint page', '#proximity_page_from_feed', 0);
                 this.nav.push(Proximity_page,{id:id}); 
                 break;

             case "o":
                 this.ga.trackEvent('Feed', 'Outing', '#outing_page_from_feed', 0);
                 this.nav.push(Outing,{id:id}); 
                 break;

             case "a":
                 this.ga.trackEvent('Feed', 'Article', '#article_page_from_feed', 0);
                 this.nav.push(Article,{id:id}); 
                 break;
         }
     }
     openPage(page) {
         if(page.info)
         {
             this.openShop();
         }
         else if(page.component == Trace)
         {
             this.ga.trackEvent('Feed', 'Trace', '#trace_page_from_feed', 0);
             setTimeout(() => { this.nav.push(Trace); } , 0);
         }
         else
         {
             this.ga.trackEvent('Menu', page.title+' page', '#'+page.title+'_page_from_menu', 0);
             this.nav.setRoot(page.component,{portrait:this.portrait});
         }
     }

    }