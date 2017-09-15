import { Component, ViewChild  } from '@angular/core';

import {NavController,AlertController,NavParams, Content,ModalController,Platform} from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';
import { GlobalService } from '../../app/app.global.service';
import { Storage } from '@ionic/storage';
/*import { File } from '@ionic-native/file';*/
import { DatePicker } from '@ionic-native/date-picker';
import { ModalConditionsLevels } from './modal_conditions_levels';
import { PictureToUpload } from '../picture/picturetoupload';
import { Picture } from '../picture/picture';
import { ModalNotebook } from '../picture/modal_notebook';
import {Camera} from 'ionic-native';
import { CommonModule } from '@angular/common';

import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var navigator : any; 

@Component({
    selector: 'page-add-outing',
    templateUrl: 'add_outing.html',
    providers: [DatePicker, CommonModule],
})

export class Addouting {
    @ViewChild(Content) content: Content;
     idd:number;
     date_start:string;
     date_start_nd:boolean;
     date_end:string;
     activities:Array<string>;
     activities_nd:boolean;
     route_description:string;

     timing:string;
     partial_trip:boolean;
     length_total:string;
     elevation_min:string;
     elevation_max:string;
     height_diff_up:string;
     height_diff_down:string;
     weather:string;
     conditions:string;
     condition_rating:string;
     public_transport:string;
     frequentation:string;
     lift_status:string;
     hut_comment:string;
     hut_status:string;
     elevation_access:string;
     access_condition:string;
     access_comment:string;
     title:string;
     title_nd:boolean;
     idlg:number;
     lg:string;
     lg_nd:boolean;

     participants:string;
     participant_count:string;

     description:string;
     quality:string;

     loader:boolean;
     btsave:boolean;


     snow_quantity:string;
     glacier_rating:string;
     avalanche_signs: Array<any>;
     conditions_levels: Array<any>;
     elevation_down_snow:string;
     elevation_up_snow:string;
     snow_quality:string;
     avalanches:string;

     avalanche_signs_no:boolean;
     avalanche_signs_sign:boolean;
     avalanche_signs_trace:boolean;
     avalanche_signs_natur:boolean;
     avalanche_signs_human:boolean;

     autocompletert:Array<any>;
     autocompletertol:Array<any>;
     autocompletept:Array<any>;
     rtlist:Array<any>;
     rtlist_nd: boolean;

     ptlist:Array<any>;
     searchrt:string;
     searchpt:string;

     latitude:string;
     longitude:string;
     trace:Array<any>;
     picturetoul:Array<string>;
     longitude_nd :boolean;
     latitude_nd :boolean;

     showAlertMessage :boolean;
     bypassexit: boolean;

     geom: any;
     geom_detail: any;

     inupload: boolean;


     debugmode: boolean;
     debugdraft : string;

     constructor(public platform: Platform, private ga: GoogleAnalytics,public modalCtrl: ModalController,public alertCtrl:AlertController,public storage: Storage,public GlobalService:GlobalService,public Datafeeder:Datafeeder,public navCtrl: NavController,navParams: NavParams,  private datePicker: DatePicker) {
         this.idd = -1;
         this.lg="fr";
         this.showAlertMessage = true;
         this.bypassexit = false;
         this.rtlist = Array();
         this.rtlist_nd = false;
         this.ptlist = Array();
         this.activities = Array();
         this.autocompletert = Array();
         this.autocompletertol = Array();
         this.autocompletept = Array();
         this.avalanche_signs = Array();
         this.btsave = true;
         this.conditions_levels = Array();

         this.loader = false;
         this.quality = "empty";

         this.avalanche_signs_no = false;
         this.avalanche_signs_sign = false;
         this.avalanche_signs_trace = false;
         this.avalanche_signs_natur = false;
         this.avalanche_signs_human = false;
         this.geom = null;
         this.geom_detail = null;
         this.idlg = 0;
         this.inupload = false;
         let data = navParams.get('data');
         let draft = navParams.get('draft');
         if(data != null)
         {

             if(data.length_total != 0)
                 this.length_total = data.length_total;
             if(data.elevation_min != 10000)
                 this.elevation_min= data.elevation_min;
             if(data.elevation_max != 0)
                 this.elevation_max = data.elevation_max;
             if(data.height_diff_up != 0)
                 this.height_diff_up = data.height_diff_up;
             if(data.height_diff_up != 0)
                 this.height_diff_down = data.height_diff_down;
             if(data.activity != "" && data.activity != null)
                 this.activities.push(data.activity);
             if(data.route != null)
                 this.rtlist.push(data.route);
             if(data.latitude != null)
                 this.latitude = data.latitude;
             if(data.longitude != null)
                 this.longitude = data.longitude;

             var date = new Date(data.start);
             var month = (date.getMonth()+1).toString();
             if(parseInt(month) < 10)
                 month = "0"+month;

             var day = date.getDate().toString();
             if(parseInt(day) < 10)
                 day = "0"+day;

             this.date_start = date.getFullYear()+"-"+month+"-"+day;
             this.date_end = this.date_start;
             this.trace = data.trace;

             if(date.getMinutes() < 10)
                 this.timing = "Début de la sortie à " + date.getHours()+"h0"+date.getMinutes();
             else
                 this.timing = "Début de la sortie à " + date.getHours()+"h"+date.getMinutes();

             if(data.route != null)
             {
                 this.title = "";
                 for(var i = 0;i<data.route.locales.length;i++)
                 {

                     if(data.route.locales[i].lang == "fr")
                     {
                         this.idlg = i;
                         if(data.route.locales[i].title_prefix != null)
                             this.title = data.route.locales[i].title_prefix+" : ";
                         this.title = this.title +""+data.route.locales[i].title;
                         break;
                     }
                 }

                 if(this.title == "")
                 {

                     if(data.route.locales[0].title_prefix != null)
                         this.title = data.route.locales[0].title_prefix+" : ";
                     this.title = this.title +""+data.route.locales[0].title;
                 }



             }
             if(data.addthisroute != null)
             {
                 this.rtlist.push(data.addthisroute);
                 if(this.title == "" || this.title == null || this.title == "undefined")
                 {
                     this.title = "";
                     if(data.addthisroute.locales[0].title_prefix != null)
                         this.title = data.addthisroute.locales[0].title_prefix+" : ";
                     this.title = this.title +""+data.addthisroute.locales[0].title;
                 }

             }

         }
         else if(draft != null)
         {
             this.loadDraft(draft);
         }
         this.picturetoul = navParams.get('picturetoul');
         if(Array.isArray(this.picturetoul) == false)
             this.picturetoul = Array();
        
         this.debugmode = this.GlobalService.debugmode;

         this.platform.ready().then(() => {
             this.ga.trackView("Page add outing","#add_outing",true);
         });
     }

     goDatePicker()
     {

         let datestart;

         if((this.date_end == null || this.date_end == "") && (this.date_start == null || this.date_start == ""))
             datestart = new Date();
         else if(this.date_start != null && this.date_start != "")
         {
             var tab_date = this.date_start.split("-");
             datestart = new Date(parseInt(tab_date[0]),parseInt(tab_date[1]),parseInt(tab_date[2]),0,0,0,0);
         }
         else {
             var tab_date = this.date_end.split("-");
             datestart = new Date(parseInt(tab_date[0]),parseInt(tab_date[1]),parseInt(tab_date[2]),0,0,0,0);
         }


         this.datePicker.show({
             date: datestart,
             mode: 'date',
             androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
         }).then(
             d => { 

                 let month = d.getMonth().toString();
                 month = (parseInt(month)+1).toString();

                 if(parseInt(month) < 10)
                     month = "0"+month;

                 let day = d.getDate().toString();
                 if(parseInt(day) < 10)
                     day = "0"+day;

                 this.date_start = d.getFullYear()+"-"+month+"-"+day;
                 if(this.date_end == "")
                     this.date_end = this.date_start;
             },
             err => console.log('Error occurred while getting date: ', err)
         );

     }

     goDatePickerEnd()
     {

         let datestart;

         if((this.date_start == null || this.date_start == "") && (this.date_end == null || this.date_end == "") )
             datestart = new Date();
         else if(this.date_end != null && this.date_end != "")
         {
             var tab_date = this.date_end.split("-");

             datestart = new Date(parseInt(tab_date[0]),parseInt(tab_date[1]),parseInt(tab_date[2]),0,0,0,0);
         }
         else {
             var tab_date = this.date_start.split("-");

             datestart = new Date(parseInt(tab_date[0]),parseInt(tab_date[1]),parseInt(tab_date[2]),0,0,0,0);
         }


         this.datePicker.show({
             date: datestart,
             mode: 'date',
             androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
         }).then(
             d => { 

                 let month = d.getMonth().toString();
                 month = (parseInt(month)+1).toString();

                 if(parseInt(month) < 10)
                     month = "0"+month;

                 let day = d.getDate().toString();
                 if(parseInt(day) < 10)
                     day = "0"+day;
                 this.date_end = d.getFullYear()+"-"+month+"-"+day;
             },
             err => console.log('Error occurred while getting date: ', err)
         );

     }
     removeOuting(canexit:boolean)
     {
         if(this.idd == -1)
         {
             this.bypassexit = true;
             if(canexit)
                 this.navCtrl.pop();
         }
         else
         {
             this.storage.get('outings_draft_list').then((val) => {   
                 val.splice(this.idd, 1);

                 this.storage.set('outings_draft_list',val);
                 this.bypassexit = true;
                 if(canexit)
                     this.navCtrl.pop();
             });

         }
     }

     loadDraft(idd:number)
     {

         this.idd = idd;

         this.storage.get('outings_draft_list').then((val) => {

             if(this.debugmode) {

                 this.debugdraft= JSON.stringify(val); 
             }


             if(val[idd].picturetoul == null)
                 this.picturetoul = Array();
             else
                 this.picturetoul = val[idd].picturetoul;
             
             this.checkPictureToUl(0);
             
             var data = val[idd].data;

             this.length_total = data.length_total;
             this.quality = data.quality;
             this.avalanche_signs = data.avalanche_signs;

             if(this.avalanche_signs.indexOf("no") > -1)
             {
                 this.avalanche_signs_no = true;
             }
             else { 
                 if(this.avalanche_signs.indexOf("accidental_avalanche") > -1)
                     this.avalanche_signs_human = true;
                 if(this.avalanche_signs.indexOf("natural_avalanche") > -1)
                     this.avalanche_signs_natur = true;
                 if(this.avalanche_signs.indexOf("recent_avalanche") > -1)
                     this.avalanche_signs_trace = true;
                 if(this.avalanche_signs.indexOf("danger_sign") > -1)
                     this.avalanche_signs_sign = true;
             }

             this.activities = data.activities;
             this.date_end = data.date_end;
             this.participant_count = data.participant_count;
             this.elevation_max = data.elevation_max;
             this.hut_status = data.hut_status;
             this.date_start = data.date_start;
             this.glacier_rating = data.glacier_rating;
             this.partial_trip = data.partial_trip;
             this.height_diff_up = data.height_diff_up;
             this.elevation_min = data.elevation_min;
             this.snow_quality = data.snow_quality;
             this.participants = data.locales[0].participants;
             this.access_comment = data.locales[0].access_comment;
             this.description = data.locales[0].description;
             this.timing = data.locales[0].timing;
             this.title = data.locales[0].title;
             this.hut_comment = data.locales[0].hut_comment;
             this.conditions = data.locales[0].conditions;
             if(this.conditions_levels != null)
                 this.conditions_levels = data.locales[0].conditions_levels;
             else
                 this.conditions_levels = Array();
             this.weather = data.locales[0].weather;
             this.route_description = data.locales[0].route_description;
             this.lg = data.locales[0].lang;
             this.avalanches = data.locales[0].avalanches;
             this.snow_quantity = data.snow_quantity;
             this.lift_status = data.lift_status;
             this.condition_rating = data.condition_rating;
             this.ptlist = data.associations.users;
             this.rtlist = data.associations.routes;
             this.public_transport = data.public_transport;
             this.elevation_access = data.elevation_access;
             this.height_diff_down = data.height_diff_down;
             this.access_condition = data.access_condition;
             this.frequentation = data.frequentation;
             this.elevation_up_snow = data.elevation_up_snow;
             this.elevation_down_snow = data.elevation_down_snow;
             this.geom = data.geometry.geom;
             this.geom_detail = data.geometry.geom_detail;
             //fix bug loic provisoire
             var test = JSON.parse(this.geom_detail);
             if(test.coordinates != null)
             {
                 if(test.coordinates.length == 1)
                 {

                     this.geom_detail =  '{"type":"LineString","coordinates":['+test.coordinates[0][0]+','+test.coordinates[0][1]+']}"';
                     this.geom_detail = null;
                 }
             }

         });
     }

     saveDraft(dalert:boolean)
     {



         if(this.date_end == null || this.date_end == "")
             this.date_end = this.date_start;

         let me = this.Datafeeder.getUserObject();
         let test = true;

         for(let i = 0;i<this.ptlist.length ;i++)
         {
             if(this.ptlist[i].document_id == me.document_id)
             {
                 test = false;
                 break;
             }
         }


         if(test && this.Datafeeder.getIsLogged())
             this.ptlist.push(this.Datafeeder.getUserObject());

         /*
         if(this.length_total != "0")
             this.length_total = (parseFloat(this.length_total) * 1000).toString();
        */

         let coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude));
         let geom = null;
         if(!isNaN(coord[0]) && isNaN(coord[1]))
             geom = "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}";
         if(this.geom != null)
             geom = this.geom;

         let coord_detail = "";
         let geom_detail = null;

         if(this.trace != null)
         {
             if(this.trace.length > 1)
             {

                 for(var i=0;i<this.trace.length;i++)
                 {
                     let tmp_coord = this.GlobalService.degrees2meters(parseFloat(this.trace[i].lon),parseFloat(this.trace[i].lat));

                     if(isNaN(tmp_coord[0]) || isNaN(tmp_coord[1]))
                         continue;
                     if(coord_detail  == "")
                         coord_detail = "["+tmp_coord[0]+","+tmp_coord[1]+"]";
                     else
                         coord_detail = coord_detail+","+"["+tmp_coord[0]+","+tmp_coord[1]+"]";
                 }
             }
         }

         if(coord_detail != "")
             geom_detail = "{\"type\":\"LineString\",\"coordinates\":["+coord_detail+"]}";
         if(this.geom_detail != null)
             geom_detail = this.geom_detail



         this.avalanche_signs = Array();

         if(this.avalanche_signs_no)
         {

             this.avalanche_signs.push("no");
         }
         else {
             if(this.avalanche_signs_human)
                 this.avalanche_signs.push("accidental_avalanche");
             if(this.avalanche_signs_natur)
                 this.avalanche_signs.push("natural_avalanche");
             if(this.avalanche_signs_trace)
                 this.avalanche_signs.push("recent_avalanche");
             if(this.avalanche_signs_sign)
                 this.avalanche_signs.push("danger_sign");
         }

         if(this.length_total == "NaN")
             this.length_total = null;

         let obj = {
             "length_total": parseFloat(this.length_total),
             "quality": this.quality,
             "avalanche_signs": this.avalanche_signs,
             "activities": this.activities,
             "date_end": this.date_end,
             "participant_count": this.participant_count,
             "elevation_max": this.elevation_max,
             "hut_status": this.hut_status,
             "date_start": this.date_start,
             "type": "o",
             "geometry": {
                 "geom": geom,
                 "geom_detail": geom_detail
             },
             "glacier_rating": this.glacier_rating,
             "document_id": 0,
             "partial_trip": this.partial_trip,
             "height_diff_up": this.height_diff_up,
             "elevation_min": this.elevation_min,
             "snow_quality": this.snow_quality,
             "locales": [{
                 "summary": null,
                 "participants": this.participants,
                 "version": 1,
                 "access_comment": this.access_comment,
                 "description": this.description,
                 "timing": this.timing,
                 "title": this.title,
                 "hut_comment": this.hut_comment,
                 "conditions": this.conditions,
                 "conditions_levels": null,
                 "weather": this.weather,
                 "route_description": this.route_description,
                 "lang": this.lg,
                 "avalanches": this.avalanches,
                 "topic_id": null
             }],
             "snow_quantity": this.snow_quantity,
             "lift_status": this.lift_status,
             "condition_rating": this.condition_rating,
             "version": 1,
             "associations": {
                 "users": this.ptlist,
                 "articles": [],
                 "xreports": [],
                 "routes": this.rtlist
             },
             "public_transport": this.public_transport,
             "elevation_access": this.elevation_access,
             "height_diff_down": this.height_diff_down,
             "access_condition": this.access_condition,
             "protected": false,
             "frequentation": this.frequentation,
             "elevation_up_snow": this.elevation_up_snow,
             "elevation_down_snow": this.elevation_down_snow
         }


         this.btsave = false;
         this.loader = true;

         this.storage.get('outings_draft_list').then((val) => { 

             if(val == null)
                 val = Array();
             if(this.idd == -1)
                 val.push({ date:new Date(),data:obj,picturetoul : this.picturetoul}); 
             else
                 val[this.idd] = { date:new Date(),data:obj,picturetoul : this.picturetoul}; 
             this.storage.set('outings_draft_list', val);     

         });



         if(dalert)
         {
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 subTitle: 'Le brouillon de votre sortie est enregistré dans le carnet de note.',
                 buttons: [{text:'Fermer',role:"cancel",handler: () => {
                     this.bypassexit = true;
                     this.navCtrl.pop();
                 }}]
             });
             alert.present();
         }
     }
     ionViewCanLeave() {
         console.log(this.bypassexit + " - " + this.showAlertMessage);
         if(this.bypassexit)
         {
             this.bypassexit = false;
             return true;
         }
         if(this.showAlertMessage) {
             let alertPopup = this.alertCtrl.create({
                 title: 'Camptocamp',
                 message: 'Attention, en quittant cette page pour perdrez les données de la sortie que vous n\'avez pas enregistré.',
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
         else 
             {
                   return false;
             }
       
     }
     private exitPage() {
         setTimeout(() => { 
             this.showAlertMessage = false;
             this.bypassexit = true;
             if(this.navCtrl.getViews().length > 1)
             {
                 this.navCtrl.pop();
             }
         },400);
     }

     displayTitleRoute(route)
     {
         var title = "";
         for(var i = 0;i<route.locales.length;i++)
         {

             if(route.locales[i].lang == "fr")
             {

                 if(route.locales[i].title_prefix != null)
                     title = route.locales[i].title_prefix+" : ";
                 title = title +""+route.locales[i].title;
                 return title;
             }
         }

         if(route.locales[0].title_prefix != null)
             title = route.locales[0].title_prefix+" : ";
         title = title +""+route.locales[0].title;

         return title;

     }

    

     checkPictureToUl(index)
     {  
         if(index >= this.picturetoul.length)
             return;
    
         this.storage.get("imginwait-"+this.picturetoul[index]).then((val) => { 
             if(val == null) {

                 if (index > -1) {
                     this.picturetoul.splice(index, 1);
                     this.checkPictureToUl(index);
                 }
                 
   
             }
             else {
                this.checkPictureToUl(index+1);
             }


         });
     }

     openImageToUl() {
         this.showAlertMessage = false;
         this.bypassexit = false;
         let profileModal = this.modalCtrl.create(ModalNotebook, {picturetoul: this.picturetoul});
         profileModal.onDidDismiss(data => {
             this.showAlertMessage = true;
             try {
                 for(var i = 0;i < data.picturetodelete.length; i++)
                 {
                     var index = this.picturetoul.indexOf(data.picturetodelete[i]);

                     if (index > -1) {
                         this.picturetoul.splice(index, 1);
                     }
                 }
             } catch(e) {}
         });
         profileModal.present();
     }


     openPhotoLibrary() {
         let cameraOptions = {
             sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
             destinationType: Camera.DestinationType.FILE_URI,      
             quality: 100,
             targetWidth: 1000,
             targetHeight: 1000,
             encodingType: Camera.EncodingType.JPEG,      
             correctOrientation: true
         }

         Camera.getPicture(cameraOptions)
             .then(file_uri => { 
             var thisResult = JSON.parse(file_uri);
             this.pictureModal(thisResult);
         }, 
                   err => console.log(err));   

     }

     getAutocompletePt()
     {

         this.Datafeeder.requestapi("user_search",{search:this.searchpt.trim(),view:this});
     }
     setAutocompletePt(data:any)
     {
         if(data.users != null)
             this.autocompletept = data.users.documents;
     }

     getAutocompleteRtOffLine()
     {
         this.autocompletertol = Array();
         var tabsearch = this.searchrt.trim().split(" ");
         var tabtmp = Array();

         this.storage.get('topos_list').then((val) => { 

             if(val != null)
             {

                 for(let i = 0;i<val.length;i++)
                 {

                     this.storage.get('topos-'+val[i]).then((data) => { 
                         if(data != null)
                         {

                             for(var n = 0; n<data.locales.length;n++)
                             {
                                 for(var m = 0;m<tabsearch.length;m++)
                                 {
                                     if(tabsearch[m].toLowerCase() == "" || tabsearch[m].toLowerCase().length < 3)
                                         continue;

                                     if(data.locales[n].title.toLowerCase().search(tabsearch[m].toLowerCase()) > -1 || data.locales[n].title_prefix.toLowerCase().search(tabsearch[m].toLowerCase()) > -1)
                                     {

                                         if(tabtmp.indexOf(data.document_id) == -1)
                                         {
                                             tabtmp.push(data.document_id);
                                             this.autocompletertol.push(data);

                                         }
                                         break;
                                     }
                                 }
                             }
                         }
                     });

                 }

             }

         });
     }
     getAutocompleteRt()
     {
         this.getAutocompleteRtOffLine();
         this.Datafeeder.requestapi("route_search",{search:this.searchrt.trim(),view:this});
     }
     setAutocompleteRt(data:any)
     {
         if(data.routes != null)
             this.autocompletert = data.routes.documents;
     }
     addUser(p:any)
     {
         this.ptlist.push(p);
         this.autocompletept = Array();
         this.searchpt = "";
     }

     rmUser(p:any)
     {
         var i = this.ptlist.indexOf(p);
         if(i != -1)
         {
             this.ptlist.splice(i, 1); 
         }
     }

     addRoute(p:any)
     {
         this.rtlist.push(p);
         this.autocompletert = Array();
         this.autocompletertol = Array();
         this.searchrt = "";
     }

     rmRoute(p:any)
     {
         var i = this.rtlist.indexOf(p);
         if(i != -1)
         {
             this.rtlist.splice(i, 1); 
         }
     }

     onInputRt(e:any)
     {

         if(this.searchrt == "")
         {
             this.autocompletertol = Array();
             this.autocompletert = Array();

         }
     }

     getItemsRt(e:any)
     {
         if(e.keyCode == 13)
         {
             this.getAutocompleteRt();
         }
         else if(this.searchrt.length > 2)
         {
             this.getAutocompleteRt();
         }
     }

     onInputPt(e:any)
     {
         if(this.searchpt == "")
         {
             this.autocompletept = Array();
         }
     }

     getItemsPt(e:any)
     {
         if(e.keyCode == 13)
         {
             this.getAutocompletePt();
         }
     }

     putIdOutingOnImg(i:number,id:any)
     {

         if(i >= this.picturetoul.length)
             return;

         this.storage.get("imginwait-"+this.picturetoul[i]).then((val) => { 

             if(val == null)
                 return;

             val.id_outing = id;
             this.storage.set("imginwait-"+this.picturetoul[i],val);

             this.putIdOutingOnImg(i+1,id);
         });


     }
     addOk(id:any)
     {
         var ds = Date.now();

         this.putIdOutingOnImg(0,id);

         this.inupload = false;
         this.removeOuting(false);

         let alert = this.alertCtrl.create({
             title: 'Camptocamp',
             subTitle: 'La sortie a bien été crée.',
             buttons: [{text:'Fermer',role:"cancel",handler: () => {
                 this.bypassexit = true;
                 if(this.picturetoul == null)
                     this.picturetoul = Array();

                 if(this.picturetoul.length > 0)
                 {
                     this.navCtrl.pop();
                     this.navCtrl.push(PictureToUpload,{picturetoul: this.picturetoul,id_outing:id});
                 }
                 else
                 {
                     this.navCtrl.pop();
                 }
             }}]
         });
         alert.present();
     }
     addOff(data:any,err:any)
     {
         this.length_total = (parseFloat(this.length_total) / 1000).toString();
         this.inupload = false;
         this.saveDraft(false);
         this.btsave = false;
         this.loader = true;
         if(err!=null)
         {
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 subTitle:  'Erreur est survenu lors de l\'envoie de votre sortie. Merci de contacter l\'équipe de développement. ' + err._body,
                 buttons: [{text:'Fermer',role:"cancel",handler: () => {
                     this.bypassexit = true;
                     this.navCtrl.pop();
                 }}]
             });
             alert.present();
         }
         else
         {
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 subTitle:  'Aucune connexion internet détécté. Merci d\'envoyer votre sortie ultérieurement. ' ,
                 buttons: [{text:'Fermer',role:"cancel",handler: () => {
                     this.bypassexit = true;
                     this.navCtrl.pop();
                 }}]
             });
             alert.present();
         }
     }
     
     rmConditionsLevels(p:any)
     {
         var i = this.conditions_levels.indexOf(p);
         if(i != -1)
         {
             this.conditions_levels.splice(i, 1); 
         }
     }
     
     conditionslevelsModal() {
         let profileModal = this.modalCtrl.create(ModalConditionsLevels);
         profileModal.onDidDismiss(data => {

             this.conditions_levels.push(data);
         });
         profileModal.present();
     }

     pictureModal(obj:any) {
         
         let profileModal = this.modalCtrl.create(Picture, { data: obj ,activity: null });
         profileModal.onDidDismiss(data => {    
             if(data != null)
                 this.picturetoul.push(data.id);
         });
         profileModal.present();
     }

     takePicture() {
         this.launchCamera();
     }

     launchCamera() {
         var that = this;
         navigator.camera.getPicture(function(result) {

             var thisResult = JSON.parse(result);
             that.pictureModal(thisResult);

         }, function(message) {
         }, {
             quality: 100,
             saveToPhotoAlbum: true,
             correctOrientation: true,
             destinationType: Camera.DestinationType.FILE_URI
         });
     }

     save()
     {

         if(this.condition_rating == "")
             this.condition_rating = null;
         if(this.snow_quantity == "")
             this.snow_quantity = null;
         if(this.snow_quality == "")
             this.snow_quality = null;
         if(this.glacier_rating == "")
             this.glacier_rating = null;
         if(this.frequentation == "")
             this.frequentation = null;
         if(this.lift_status == "")
             this.lift_status = null;
         if(this.hut_status == "")
             this.hut_status = null;
         if(this.access_condition == "")
             this.access_condition = null;

         if(this.title == "" || this.title == null)
         {
             this.title_nd = true;
         }
         else
         {
             this.title_nd = false;
         }

         if(this.date_start == "" || this.date_start == null)
         {
             this.date_start_nd = true;
         }
         else
         {
             this.date_start_nd = false;
         }

         if(this.activities.length == 0)
         {
             this.activities_nd = true;
         }
         else
         {
             this.activities_nd = false;
         }

         if(this.rtlist.length == 0)
         {
             this.rtlist_nd = true;
         }
         else
         {
             this.rtlist_nd = false;
         }
         if(this.longitude == "")
         {
             this.longitude_nd = true;
         }
         if(this.title_nd || this.lg_nd || this.date_start_nd || this.rtlist_nd || this.activities_nd)
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

         if(this.date_end == null || this.date_end == "")
             this.date_end = this.date_start;

         let me = this.Datafeeder.getUserObject();
         let test = true;

         for(let i = 0;i<this.ptlist.length ;i++)
         {
             if(this.ptlist[i].document_id == me.document_id)
             {
                 test = false;
                 break;
             }
         }
         if(test && this.Datafeeder.getIsLogged())
             this.ptlist.push(this.Datafeeder.getUserObject());

         if(this.length_total != "0")
         {
             this.length_total = (parseFloat(this.length_total) * 1000).toString();
             this.length_total = parseFloat(this.length_total).toString();
         }

         let coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude));
         let geom = null;
         if(!isNaN(coord[0]) && isNaN(coord[1]))
             geom = "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}";
         let coord_detail = "";



         if(this.trace != null)
         {
             if(this.trace.length == 1)
             {
                 let tmp_coord = this.GlobalService.degrees2meters(parseFloat(this.trace[i].lon),parseFloat(this.trace[i].lat));

                 coord_detail = ""+tmp_coord[0]+","+tmp_coord[1]+"";
             }
             else
             {
                 for(var i=0;i<this.trace.length;i++)
                 {
                     let tmp_coord = this.GlobalService.degrees2meters(parseFloat(this.trace[i].lon),parseFloat(this.trace[i].lat));

                     if(isNaN(tmp_coord[0]) || isNaN(tmp_coord[1]))
                         continue;
                     if(coord_detail  == "")
                         coord_detail = "["+tmp_coord[0]+","+tmp_coord[1]+"]";
                     else
                         coord_detail = coord_detail+","+"["+tmp_coord[0]+","+tmp_coord[1]+"]";
                 }
             }
         }

         let geom_detail = null;
         if(coord_detail != "" && this.trace.length > 1)
             geom_detail = "{\"type\":\"LineString\",\"coordinates\":["+coord_detail+"]}";
         if(this.geom_detail != null)
             geom_detail = this.geom_detail


         if(this.avalanche_signs_no == true)
             this.avalanche_signs = Array();
         else
         {
             if(this.avalanche_signs_human)
                 this.avalanche_signs.push("accidental_avalanche");
             if(this.avalanche_signs_natur)
                 this.avalanche_signs.push("natural_avalanche");
             if(this.avalanche_signs_trace)
                 this.avalanche_signs.push("recent_avalanche");
             if(this.avalanche_signs_sign)
                 this.avalanche_signs.push("danger_sign");
         }

         if(this.length_total == "NaN")
             this.length_total = null;

         let obj = {
             "length_total": parseFloat(this.length_total),
             "quality": this.quality,
             "avalanche_signs": this.avalanche_signs,
             "activities": this.activities,
             "date_end": this.date_end,
             "participant_count": this.participant_count,
             "elevation_max": this.elevation_max,
             "hut_status": this.hut_status,
             "date_start": this.date_start,
             "type": "o",
             "geometry": {
                 "geom": geom,
                 "geom_detail": geom_detail
             },
             "glacier_rating": this.glacier_rating,
             "document_id": 0,
             "partial_trip": this.partial_trip,
             "height_diff_up": this.height_diff_up,
             "elevation_min": this.elevation_min,
             "snow_quality": this.snow_quality,
             "locales": [{
                 "summary": null,
                 "participants": this.participants,
                 "version": 1,
                 "access_comment": this.access_comment,
                 "description": this.description,
                 "timing": this.timing,
                 "title": this.title,
                 "hut_comment": this.hut_comment,
                 "conditions": this.conditions,
                 "conditions_levels": null,
                 "weather": this.weather,
                 "route_description": this.route_description,
                 "lang": this.lg,
                 "avalanches": this.avalanches,
                 "topic_id": null
             }],
             "snow_quantity": this.snow_quantity,
             "lift_status": this.lift_status,
             "condition_rating": this.condition_rating,
             "version": 1,
             "associations": {
                 "users": this.ptlist,
                 "articles": [],
                 "xreports": [],
                 "routes": this.rtlist
             },
             "public_transport": this.public_transport,
             "elevation_access": this.elevation_access,
             "height_diff_down": this.height_diff_down,
             "access_condition": this.access_condition,
             "protected": false,
             "frequentation": this.frequentation,
             "elevation_up_snow": this.elevation_up_snow,
             "elevation_down_snow": this.elevation_down_snow
         }

         if(this.conditions_levels != null)
         {
             if(this.conditions_levels.length > 0)
                 obj.locales[0].conditions_levels = JSON.stringify(this.conditions_levels);
         }


         if(this.GlobalService.getIsOnline())
         {
             if(this.Datafeeder.getIsLogged())
             {
                 if(this.inupload==false)
                     this.Datafeeder.requestapi("outing_add",{outing:obj,view:this});
                 this.inupload = true;
             }
             else
             {
                 let alert = this.alertCtrl.create({
                     title: 'Camptocamp',
                     subTitle: 'Vous devez être connecté sur votre compte pour enregistrer une sortie. Votre sortie a été sauvegardé dans le carnet de note.',
                     buttons: [{text:'Fermer',role:"cancel",handler: () => {
                         this.saveDraft(false);
                     }}]
                 });
                 alert.present();
             }
         }
         else
         {
             this.addOff(null,null);
         }
     }
    }