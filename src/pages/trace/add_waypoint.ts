import { Component, ViewChild  } from '@angular/core';

import {NavController,AlertController, Content,NavParams,Platform} from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';
import { GlobalService } from '../../app/app.global.service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { CommonModule } from '@angular/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var navigator: any;
@Component({
    selector: 'page-add-waypoint',
    templateUrl: 'add_waypoint.html',
    providers: [Geolocation,LocationAccuracy,CommonModule]
})
/*
todo:
info sup type accès, site d'escalade, SAE , refuge/cabanne, abri, camping, produit locaux, decollage parapente, atterrissage parapente, station meteo, spot de slackline

*/
export class Addwaypoint {
    @ViewChild(Content) content: Content;
     title:string;
     title_nd:boolean;
     lg:string;
     lg_nd:boolean;
     type:string;
     type_nd:boolean;
     elevation:string;
     elevation_nd:boolean;
     longitude:string;
     longitude_nd:boolean;
     latitude:string;
     latitude_nd:boolean;
     search:string;
     description:string;
     summary:string;
     autocomplete:Array<any>;
     wllist:Array<any>;
     quality: string;
     btsave:boolean;
     loader:boolean;
     infoprec : number;
     idd:number;
     bypassexit:boolean;
     geom:any;
     showAlertMessage:boolean;
     loadergps:boolean;
     watchId:any;

     custodianship:string;
     custodianship_nd:boolean;
     url:string;
     url_nd:boolean;
     product_types: Array<string>;
     product_types_nd: boolean;

     constructor(public platform: Platform, private ga: GoogleAnalytics,public alertCtrl:AlertController,public storage: Storage,public GlobalService:GlobalService,public Datafeeder:Datafeeder,public navCtrl: NavController,private navParams: NavParams,private geolocation: Geolocation) {
         this.idd = -1
         this.showAlertMessage = true;
         this.bypassexit = false;
         this.infoprec = 0;
         this.lg = "fr";
         this.type = "summit";
         this.wllist = Array();
         this.autocomplete = Array();
         this.btsave = true;
         this.longitude_nd = false;
         this.loader = false;
         this.quality = "empty";
         this.product_types = Array();
         this.product_types_nd = false;
         this.custodianship_nd = false;
         this.url_nd = false;

         this.loadergps = false;

         this.elevation = navParams.get('elevation');
         this.longitude = navParams.get('lon');
         this.latitude = navParams.get('lat');

         this.prectoInfo(parseInt(navParams.get('precision')));
         let draft = navParams.get('draft');

         if(draft != null)
         {
             this.loadDraft(draft);
         }
         
         this.platform.ready().then(() => {
             this.ga.trackView("Page add waypoint","#add_waypoint",true);
         });
     }

     ionViewCanLeave() {

         if(this.bypassexit)
         {
             this.bypassexit = false;
             return true;
         }
         if(this.showAlertMessage) {
             let alertPopup = this.alertCtrl.create({
                 title: 'Camptocamp',
                 message: 'Attention, en quittant cette page pour perdrez les données du point de passage.',
                 buttons: [{
                     text: 'Quitter',
                     role: 'cancel',
                     handler: () => {
                         //   alertPopup.dismiss().then(() => {
                         this.exitPage();
                         //  });         
                     }
                 },
                           {
                               text: 'Rester',
                               role:'cancel',
                               handler: () => {
                                   // need to do something if the user stays?
                               }
                           }]
             });

             alertPopup.present();
             return false;
         }
     }

     private exitPage() {

         this.showAlertMessage = false;
         if(this.navCtrl.getViews().length > 1)
         {
             this.navCtrl.pop();
         }
     }

     getAutocomplete()
     {
         this.Datafeeder.requestapi("waypoint_search",{search:this.search.trim(),view:this});
     }
     setAutocomplete(data:any)
     {
    
         this.autocomplete = data.waypoints.documents;
     }

     addWaypoint(p:any)
     {
         this.wllist.push(p);
         this.autocomplete = Array();
         this.search = "";
     }

     rmWaypoint(p:any)
     {

         var i = this.wllist.indexOf(p);
         if(i != -1)
         {
             this.wllist.splice(i, 1); 
         }

     }
     onInput(e:any)
     {

         if(this.search == "")
         {

             this.autocomplete = Array();

         }
     }
     addOk()
     {

         this.removeWaypoint(false);

         let alert = this.alertCtrl.create({
             title: 'Camptocamp',
             subTitle: 'Le point de passage a bien été crée.',
             buttons: [{text:'Fermer',role:"cancel",handler: () => {
                 this.navCtrl.pop();
             }}]
         });
         alert.present();


     }
     addOff(data:any,err:any)
     {
         this.btsave = false;
         this.loader = true;

         this.saveDraft(false)
         let alert = this.alertCtrl.create({
             title: 'Camptocamp',
             subTitle: 'Aucune connexion internet détécté. Merci d\'envoyer votre point de passage ultérieurement.',
             buttons: [{text:'Fermer',role:"cancel",handler: () => {
                 this.navCtrl.pop();
             }}]
         });
         alert.present();

     }
     getItems(e:any)
     {

         if(e.keyCode == 13)
         {
             this.getAutocomplete();
         }

     }

     isUrl(s) {
         var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
         return regexp.test(s);
     }

     prectoInfo(accuracy:number)
     {
         if(accuracy == 0) {
             this.infoprec = 0;
         }
         else if(accuracy <= 20) {
             this.infoprec = 1;
         } else if(accuracy < 50) {
             this.infoprec = 2;
         } else if(accuracy < 100) {
             this.infoprec = 3;
         } else if(accuracy >= 100) {
             this.infoprec = 4;
         } else {
             this.infoprec = 0;
         }
     }

     save()
     {


         if(this.title == "" || this.title == null)
         {
             this.title_nd = true;

         }
         else
         {
             this.title_nd = false;
         }
         if(this.lg == "" || this.lg == null)
         {
             this.lg_nd = true;

         }
         else
         {
             this.lg_nd = false;
         }

         if(this.type == "" || this.type == null )
         {
             this.type_nd = true;

         }
         else
         {
             this.type_nd = false;
         }

         if(this.elevation == "" || this.elevation == null )
         {
             this.elevation_nd = true;

         }
         else
         {
             this.elevation_nd = false;
         }


         if(this.longitude == "" || this.longitude == null )
         {
             this.longitude_nd = true;

         }
         else
         {
             this.longitude_nd = false;
         }
         if(this.latitude == "" || this.latitude == null )
         {
             this.latitude_nd = true;

         }
         else
         {
             this.latitude_nd = false;
         }
         if(this.custodianship == "" || this.custodianship == null)
         {
             this.custodianship_nd = true;
         }
         else
         {
             this.custodianship_nd = false; 
         }
         if(!this.isUrl(this.url))
         {
             this.url_nd = true;
         }
         else
         {
             this.url_nd = false;
         }

         if(this.product_types != null)
         {
             if(this.product_types.length == 0)
             {
                 this.product_types_nd = true;
             }
             else
             {
                 this.product_types_nd = false;
             }

         }
         else
         {
             this.product_types_nd = true;
         }

         if(this.title_nd || this.lg_nd || this.type_nd || this.elevation_nd || this.longitude_nd || this.latitude_nd || (this.url_nd && (this.type == "webcam" || this.type == "weather_station")) || (this.product_types_nd && this.type == "local_product") || (this.custodianship_nd && (this.type == 'gite' || this.type == 'hut' || this.type == 'camp_site')))
         {
             this.content.scrollTo(0, 0, 200);
             return false;
         }
         else
         {
             this.content.scrollToBottom(100);
         }
         this.btsave = false;
         this.loader = true;

         var coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude))
         let obj = {
             "associations": {
                 "waypoints": [],
                 "waypoint_children": this.wllist,
                 "routes": [],
                 "all_routes": {
                     "total": 0,
                     "documents": []
                 },
                 "users": [],
                 "recent_outings": {
                     "total": 0,
                     "documents": []
                 },
                 "outings": [],
                 "articles": [],
                 "books": [],
                 "xreports": [],
                 "images": [],
                 "areas": []
             },
             "locales": [{
                 "title": this.title,
                 "lang": this.lg,
                 "summary": this.summary,
                 "description": this.description
             }],
             "type": "",
             "custodianship":this.custodianship,
             "url":this.url,
             "product_types":this.product_types,
             "activities": [],
             "document_id": 0,
             "quality": this.quality,
             "elevation": parseInt(this.elevation),
             "geometry": {
                 "geom": "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}"
             },
             "waypoint_type": this.type
         }


         if(this.GlobalService.getIsOnline())
         {

             if(this.Datafeeder.getIsLogged())
             {
                 this.Datafeeder.requestapi("waypoint_add",{waypoint:obj,view:this})
             }
             else
             {
                 let alert = this.alertCtrl.create({
                     title: 'Camptocamp',
                     subTitle: 'Vous devez être connecté sur votre compte pour enregistrer un point de passage. Votre point de passage a été sauvegardé dans le carnet de note.',
                     buttons: [{text:'Fermer',role:"cancel",handler: () => {
                         this.saveDraft(false);
                     }}]
                 });
             }
         }
         else
         {
             this.addOff(obj,null);
         }
     }
     stopGps()
     {
         navigator.geolocation.clearWatch(this.watchId);
         this.loadergps = false;
     }
     getGpsData()
     {

         this.loadergps = true;

         // Add watch
         this.watchId = navigator.geolocation.watchPosition((data) => {

             if(data.coords !== undefined)
             {


                 this.latitude = data.coords.latitude.toString();
                 this.longitude = data.coords.longitude.toString();
                 if(data.coords.altitude != null)
                     this.elevation = data.coords.altitude.toString();
                 if(data.coords.accuracy < 30)
                 {
                     navigator.geolocation.clearWatch(this.watchId);
                     this.loadergps = false;
                 }
                 this.prectoInfo(data.coords.accuracy);

             } else 
             {
                 this.infoprec = 0;
             }
         } , (error) => {
             // do something with error
         }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });


     }
     removeWaypoint(canexit:boolean)
     {
         if(this.idd == -1)
         {
             this.bypassexit = true;
             if(canexit)
                 this.navCtrl.pop();
         }
         else
         {
             this.storage.get('waypoints_draft_list').then((val) => {   
                 val.splice(this.idd, 1);

                 this.storage.set('waypoints_draft_list',val);
                 this.bypassexit = true;
                 if(canexit)
                     this.navCtrl.pop();
             });
         }
     }

     saveDraft(dalert:boolean)
     {
         let coord = null;
         let geom = null;
         if(this.longitude != "" && this.longitude != null && this.latitude != null && this.latitude != "")
         {
             coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude));
             geom = "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}";
         }
         let obj = {
             "associations": {
                 "waypoints": [],
                 "waypoint_children": this.wllist,
                 "routes": [],
                 "all_routes": {
                     "total": 0,
                     "documents": []
                 },
                 "users": [],
                 "recent_outings": {
                     "total": 0,
                     "documents": []
                 },
                 "outings": [],
                 "articles": [],
                 "books": [],
                 "xreports": [],
                 "images": [],
                 "areas": []
             },
             "locales": [{
                 "title": this.title,
                 "lang": this.lg,
                 "summary": this.summary,
                 "description": this.description
             }],
             "type": "",
             "custodianship":this.custodianship,
             "url":this.url,
             "product_types":this.product_types,
             "activities": [],
             "document_id": 0,
             "quality": this.quality,
             "elevation": this.elevation,
             "geometry": {
                 "geom": geom
             },
             "waypoint_type": this.type
         }


         this.btsave = false;
         this.loader = true;



         this.storage.get('waypoints_draft_list').then((val) => { 

             if(val == null)
                 val = Array();
             if(this.idd == -1)
                 val.push({ date:new Date(),data:obj,latitude:this.latitude,longitude:this.longitude,infoprec:this.infoprec}); 
             else
                 val[this.idd] = { date:new Date(),data:obj,latitude:this.latitude,longitude:this.longitude,infoprec:this.infoprec}; 
             this.storage.set('waypoints_draft_list', val);     

         });



         if(dalert)
        {
         let alert = this.alertCtrl.create({
             title: 'Camptocamp',
             subTitle: 'Le brouillon de votre point de passage est enregistré dans le carnet de note.',
             buttons: [{text:'Fermer',role:"cancel",handler: () => {
                 this.bypassexit = true;
                 this.navCtrl.pop();
             }}]
         });
         alert.present();
        }
     }

     loadDraft(idd:number)
     {

         this.idd = idd;

         this.storage.get('waypoints_draft_list').then((val) => {    
  

             var data = val[idd].data;
             this.infoprec = val[idd].infoprec;
             this.latitude = val[idd].latitude;
             this.longitude = val[idd].longitude;
             this.wllist = data.associations.waypoint_children;
             this.title = data.locales[0].title;
             this.lg = data.locales[0].lang;
             this.summary = data.locales[0].summary;
             this.description = data.locales[0].description;
             this.quality = data.quality;
             this.elevation = data.elevation;
             this.type = data.waypoint_type;
             this.geom = data.geometry.geom;

             this.custodianship = data.custodianship;
             this.url = data.url;
             this.product_types = data.product_types;
             if(this.product_types == null)
                 this.product_types = Array();
         });
     }

    }