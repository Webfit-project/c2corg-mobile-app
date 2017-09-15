import { Component, ViewChild } from '@angular/core';

import {NavController,AlertController,NavParams, Content,Platform} from 'ionic-angular';
import { Datafeeder } from '../../app/datafeeder';
import { GlobalService } from '../../app/app.global.service';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Addouting } from './add_outing';
import { CommonModule } from '@angular/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-add-route',
    templateUrl: 'add_route.html',
    providers: [CommonModule],
})

export class Addroute {
    @ViewChild(Content) content: Content;
     title:string;
     title_nd:boolean;
     lg:string;
     lg_nd:boolean;
     searchrt:string;
     searchwp:string;
     activities:Array<string>;
     activities_nd:boolean;
     climbing_outdoor_type:string;
     route_types:Array<string>;
     configuration:Array<string>;
     rock_types:Array<string>;
     elevation_min:string;
     elevation_max:string;
     height_diff_up:string;
     height_diff_down:string;
     height_diff_access:string;
     height_diff_difficulties:string;
     difficulties_height:string;
     route_length:string;
     mtb_length_asphalt:string;
     mtb_length_trail:string;
     mtb_height_diff_portages:string;
     durations:Array<string>;
     lift_access:string;
     ski_rating:string;
     labande_ski_rating:string;
     labande_global_rating:string;
     snowshoe_rating:string;
     global_rating:string;
     engagement_rating:string;
     equipment_rating:string;
     ice_rating:string;
     mixed_rating:string;
     risk_rating:string;
     via_ferrata_rating:string;
     hiking_rating:string;
     mtb_down_rating:string;
     mtb_up_rating:string;
     rock_free_rating:string;
     exposition_rock_rating:string
     rock_required_rating:string;
     aid_rating:string;
     ski_exposition:string;
     hiking_mtb_exposition:string;
     slope:string;
     orientation:Array<string>;
     glacier_gear:string;

     description:string;
     summary:string;
     remarks:string;
     history:string;
     gear:string;
     external_resources:string;

     autocompletewp:Array<any>;
     autocompletewpol:Array<any>;
     wllist:Array<any>;
     wllist_nd:boolean;
     waypoint_nd:boolean;
     autocompletert:Array<any>;
     autocompletertol:Array<any>;
     rtlist:Array<any>;
     quality: string;
     btsave:boolean;
     loader:boolean;

     latitude:string;
     longitude:string;
     trace:Array<any>;
     picturetoul:Array<string>;

     main_waypoint_id: number;
     main_waypoint_title:string;

     showAlertMessage :boolean;
     bypassexit: boolean;

     idd:number;
     geom: any;
     geom_detail: any;
     start:Number;

     fromTrace:boolean;

     constructor(public platform: Platform, private ga: GoogleAnalytics,private network: Network,public alertCtrl:AlertController,public storage: Storage,public GlobalService:GlobalService,public Datafeeder:Datafeeder,public navCtrl: NavController,navParams: NavParams) {
         this.idd = -1
         this.showAlertMessage = true;
         this.bypassexit = false;

         this.lg="fr";
         this.activities = Array();
         this.route_types = Array();
         this.configuration = Array();
         this.rock_types = Array();
         this.durations = Array();
         this.trace = Array();
         this.orientation = Array();

         this.wllist = Array();
         this.autocompletewp = Array();
         this.autocompletewpol = Array();

         this.rtlist = Array();
         this.autocompletert = Array();
         this.autocompletertol = Array();
         this.main_waypoint_id = 0;

         this.btsave = true;

         this.loader = false;
         this.quality = "empty";
         let picturetoul = navParams.get('data');
         if(picturetoul != null)
             this.picturetoul = picturetoul;
         else
             this.picturetoul = Array();

         let data = navParams.get('data');
         let draft = navParams.get('draft');
         this.fromTrace = false;
         if(data != null)
         {
             this.fromTrace = true;

             if(data.trace != null)
                 this.trace = data.trace;
             if(data.route_length != 0)
                 this.route_length = data.route_length;
             if(data.elevation_min != 10000 && data.elevation_min != 0)
                 this.elevation_min= data.elevation_min;
             if(data.elevation_max != 0)
                 this.elevation_max = data.elevation_max;
             if(data.height_diff_up != 0)
                 this.height_diff_up = data.height_diff_up;
             if(data.height_diff_up != 0)
                 this.height_diff_down = data.height_diff_down;
             if(data.activity != "" && data.activity != null)
                 this.activities.push(data.activity)
             if(data.route != null)
                 this.rtlist.push(data.route);
             if(data.latitude != null)
                 this.latitude = data.latitude;
             if(data.longitude != null)
                 this.longitude = data.longitude;
             if(data.start != null)
                 this.start = data.start;
         }
         else if(draft != null)
         {
             this.loadDraft(draft);
         }


          this.platform.ready().then(() => {
             this.ga.trackView("Page add route","#add_route",true);
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
                 message: 'Attention, en quittant cette page pour perdrez les données de l\'itinéraire.',
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

     toggleOrientation(o:string)
     {
         var i = this.orientation.indexOf(o)
         if(i > -1)
         {
             this.orientation.splice(i, 1); 
         }
         else
         {
             this.orientation.push(o);
         }
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

     getAutocompleteRtOffLine()
     {
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

     mainWaypoint(p:any)
     {

         if(this.main_waypoint_id == p.document_id)
             return;
         else
         {
             this.main_waypoint_id = p.document_id;
             this.main_waypoint_title = p.locales[0].title;
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


     addWaypoint(p:any)
     {

         this.wllist.push(p);
         if(this.main_waypoint_id == 0)
         {
             this.main_waypoint_id = p.document_id;
             this.main_waypoint_title = p.locales[0].title;
         }
         this.autocompletewp = Array();
         this.autocompletewpol = Array();
         this.searchwp = "";
     }

     rmWaypoint(p:any)
     {

         var i = this.wllist.indexOf(p);
         if(i != -1)
         {
             this.wllist.splice(i, 1); 
         }

     }
     getAutocompleteWpOffline()
     {
         this.autocompletewpol = Array();
         var tabsearch = this.searchwp.trim().split(" ");
         var tabtmp = Array();
         this.storage.get('waypoints_list').then((val) => { 

             if(val != null)
             {



                 for(let i = 0;i<val.length;i++)
                 {



                     this.storage.get('waypoint-'+val[i]).then((data) => { 

                         if(data != null)
                         {
                             for(var n = 0; n<data.locales.length;n++)
                             {
                                 for(var m = 0;m<tabsearch.length;m++)
                                 {
                                     if(tabsearch[m].toLowerCase() == "" || tabsearch[m].toLowerCase().length < 3)
                                         continue;

                                     if(data.locales[n].title.toLowerCase().search(tabsearch[m].toLowerCase()) > -1)
                                     {

                                         if(tabtmp.indexOf(data.document_id) == -1)
                                         {
                                             tabtmp.push(data.document_id);
                                             this.autocompletewpol.push(data);

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
         this.Datafeeder.requestapi("route_search",{search:this.searchrt.trim(),view:this});
     }
     setAutocompleteRt(data:any)
     {
         this.getAutocompleteRtOffLine();
         if(data.routes != null)
             this.autocompletert = data.routes.documents;
     }

     getAutocompleteWp()
     {
         this.getAutocompleteWpOffline();
         this.Datafeeder.requestapi("waypoint_search",{search:this.searchwp.trim(),view:this});
     }
     setAutocompleteWp(data:any)
     {
         if(data.waypoints != null)
             this.autocompletewp = data.waypoints.documents;
     }

     onInputRt(e:any)
     {

         if(this.searchrt == "")
         {

             this.autocompletert = Array();
             this.autocompletertol = Array();
         }
     }

     getItemsRt(e:any)
     {

         if(e.keyCode == 13)
         {
             this.getAutocompleteRt();
         }

     }

     onInputWp(e:any)
     {

         if(this.searchwp == "")
         {

             this.autocompletewp = Array();
             this.autocompletewpol = Array();
         }
     }

     getItemsWp(e:any)
     {

         if(e.keyCode == 13)
         {
             this.getAutocompleteWp();
         }

     }


     addOk(obj:any,id:any)
     {
         obj.document_id = id;
         this.removeRoute(false);
         if(this.fromTrace == true)
         {
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 message: 'Voulez vous enregistrer une sortie lié a ce nouvel itinéraire ?',
                 buttons: [

                     {
                         text: 'Oui',
                         handler: () => {
                             this.navCtrl.pop();

                             this.navCtrl.push(Addouting,{
                                 picturetoul: this.picturetoul,
                                 data: { latitude:this.latitude,
                                        longitude:this.longitude,
                                        trace:this.trace,
                                        length_total:this.route_length,
                                        elevation_min:this.elevation_min,
                                        elevation_max:this.elevation_max,
                                        height_diff_up:this.height_diff_up,
                                        height_diff_down:this.height_diff_down,
                                        start:this.start,
                                        route:this.rtlist[0],
                                        activity:this.activities,
                                        addthisroute:obj
                                       }
                             }); 
                         }
                     },
                     {
                         text: 'Annuler',
                         role: 'cancel',
                         handler: () => {
                             this.navCtrl.pop();

                         }
                     }
                 ]
             });
             alert.present();
         }
         else
         {
             this.bypassexit = true;
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 subTitle: 'L\'itinéraire a bien été crée.',
                 buttons: [{text:'Fermer',role:"cancel",handler: () => {
                     this.navCtrl.pop();
                 }}]
             });
             alert.present();
         }

     }
     addOff(data:any,id:string,err:any)
     {

         this.saveDraft(false);

         if(err != null)
         {

             if(err._body != null)
             {

                 var json = JSON.parse(err._body);
                 if(json.errors[0] != null)
                 {

                     let alert = this.alertCtrl.create({
                         title: 'Camptocamp',
                         subTitle: 'Une erreur est survenu lors de la création de votre itinéraire. Merci de prendre contact avec l\'équipe de développement.',
                         buttons: [{text:'Fermer',role:"cancel",handler: () => {
                             this.navCtrl.pop();
                         }}]
                     });
                     alert.present();
                     return;
                 }

             }
         }


         this.btsave = false;
         this.loader = true;


         this.bypassexit = true;
         let alert = this.alertCtrl.create({
             title: 'Camptocamp',
             subTitle: 'Aucune connexion internet détécté. Merci d\'envoyer votre itinéraire ultérieurement.',
             buttons: [{text:'Fermer',role:"cancel",handler: () => {
                 this.navCtrl.pop();
             }}]
         });
         alert.present();

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


         if(this.activities.length == 0)
         {
             this.activities_nd = true;
         }
         else
         {
             this.activities_nd = false;
         }

         if(this.wllist.length == 0)
         {
             this.wllist_nd = true;
         }
         else
         {
             this.wllist_nd = false;
         }

         if(this.title_nd || this.lg_nd || this.activities_nd || this.wllist_nd)
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

         let coord = Array();
         let geom = null;

         if(this.longitude != null)
         {
             coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude));
             geom = "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}";
         }
         if(this.geom != null)
             geom = this.geom;

         let coord_detail = "";
         if(this.trace != null)
         {
             if(this.trace.length > 1)
             {
                 for(var i=0;i<this.trace.length;i++)
                 {
                     let tmp_coord = this.GlobalService.degrees2meters(parseFloat(this.trace[i].lon),parseFloat(this.trace[i].lat));
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
         else if(this.geom_detail != null)
             geom_detail = this.geom_detail


         let obj = {
             "associations": {
                 "waypoints": this.wllist,
                 "waypoint_children": [],
                 "routes": this.rtlist,
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
                 "slope": this.slope,
                 "summary": this.summary,
                 "description": this.description,
                 "remarks": this.remarks,
                 "route_history": this.history,
                 "gear": this.gear,
                 "external_resources": this.external_resources
             }],
             "type": "",
             "activities": this.activities,
             "document_id": 0,
             "quality": this.quality,
             "geometry": {
                 "geom": geom,
                 "geom_detail": geom_detail
             },
             "main_waypoint_id": this.main_waypoint_id,
             "main_waypoint_title": this.main_waypoint_title,
             "climbing_outdoor_type": this.climbing_outdoor_type,
             "route_types": this.route_types,
             "configuration": this.configuration,
             "rock_types": this.rock_types,
             "elevation_min": this.elevation_min,
             "elevation_max": this.elevation_max,
             "orientations": this.orientation,
             "height_diff_up": this.height_diff_up,
             "height_diff_down": this.height_diff_down,
             "height_diff_access": this.height_diff_access,
             "height_diff_difficulties": this.height_diff_difficulties,
             "difficulties_height": this.difficulties_height,
             "route_length": parseFloat(this.route_length),
             "mtb_length_asphalt": this.mtb_length_asphalt,
             "mtb_length_trail": this.mtb_length_trail,
             "mtb_height_diff_portages": this.mtb_height_diff_portages,
             "durations": this.durations,
             "lift_access": this.lift_access,
             "ski_rating": this.ski_rating,
             "labande_ski_rating": this.labande_ski_rating,
             "labande_global_rating": this.labande_global_rating,
             "snowshoe_rating": this.snowshoe_rating,
             "global_rating": this.global_rating,
             "engagement_rating": this.engagement_rating,
             "equipment_rating": this.equipment_rating,
             "ice_rating": this.ice_rating,
             "mixed_rating": this.mixed_rating,
             "risk_rating": this.risk_rating,
             "via_ferrata_rating": this.via_ferrata_rating,
             "hiking_rating": this.hiking_rating,
             "mtb_down_rating": this.mtb_down_rating,
             "mtb_up_rating": this.mtb_up_rating,
             "rock_free_rating": this.rock_free_rating,
             "exposition_rock_rating": this.exposition_rock_rating,
             "rock_required_rating": this.rock_required_rating,
             "aid_rating": this.aid_rating,
             "ski_exposition": this.ski_exposition,
             "hiking_mtb_exposition": this.hiking_mtb_exposition,
             "glacier_gear": this.glacier_gear
         };


         if(this.GlobalService.getIsOnline())
         {
             if(this.Datafeeder.getIsLogged())
             {
                 this.Datafeeder.requestapi("route_add",{route:obj,view:this});
             }
             else
             {
                 let alert = this.alertCtrl.create({
                     title: 'Camptocamp',
                     subTitle: 'Vous devez être connecté sur votre compte pour enregistrer un itinéraire. Votre itinéraire a été sauvegardé dans le carnet de note.',
                     buttons: [{text:'Fermer',role:"cancel",handler: () => {
                         this.saveDraft(false);
                     }}]
                 });
             }
         }
         else
         {
             this.addOff(obj,null,null);
         }
     }

     removeRoute(canexit:boolean)
     {
         if(this.idd == -1)
         {
             this.bypassexit = true;
             if(canexit)
                 this.navCtrl.pop();
         }
         else
         {
             this.storage.get('routes_draft_list').then((val) => {   
                 val.splice(this.idd, 1);

                 this.storage.set('routes_draft_list',val);
                 this.bypassexit = true;
                 if(canexit)
                     this.navCtrl.pop();
             });
         }
     }
     loadDraft(idd:number)
     {

         this.idd = idd;

         this.storage.get('routes_draft_list').then((val) => {    


             var data = val[idd].data;
             this.wllist = data.associations.waypoints;
             this.rtlist = data.associations.routes;
             if(this.wllist == null)
                 this.wllist = Array();
             if(this.rtlist == null)
                 this.rtlist = Array();
             this.title = data.locales[0].title;
             this.lg = data.locales[0].lang;
             this.slope = data.locales[0].slope;
             this.summary = data.locales[0].summary;
             this.description = data.locales[0].description;
             this.remarks = data.locales[0].remarks;
             this.history = data.locales[0].historiy;
             this.gear = data.locales[0].gear;
             this.external_resources = data.locales[0].external_resources;
             this.activities = data.activities;
             this.quality = data.quality;

             this.main_waypoint_id = data.main_waypoint_id;
             this.main_waypoint_title = data.main_waypoint_title;
             this.climbing_outdoor_type = data.climbing_outdoor_type;
             this.route_types = data.route_types;
             this.configuration = data.configuration;
             this.rock_types = data.rock_types;
             this.elevation_min = data.elevation_min;
             this.elevation_max = data.elevation_max;
             this.height_diff_up = data.height_diff_up;
             this.height_diff_down = data.height_diff;
             this.height_diff_access = data.height_diff_access;
             this.height_diff_difficulties = data.height_diff_difficulties;
             this.difficulties_height = data.difficulties_height;
             this.orientation = data.orientations;
             this.route_length = data.route_length;
             this.mtb_length_asphalt = data.mtb_length_asphalt;
             this.mtb_length_trail = data.mtb_length_trail;
             this.mtb_height_diff_portages = data.mtb_height_diff_portages;
             this.durations = data.durations;
             this.lift_access = data.lift_access;
             this.ski_rating = data.ski_rating;
             this.labande_ski_rating = data.labande_ski_rating;
             this.labande_global_rating = data.labande_global_rating;
             this.snowshoe_rating = data.snowshoe_rating;
             this.global_rating = data.global_rating;
             this.engagement_rating = data.engagement_rating;
             this.equipment_rating = data.equipment_rating;
             this.ice_rating = data.ice_rating;
             this.mixed_rating = data.mixed_rating;
             this.risk_rating = data.risk_rating;
             this.via_ferrata_rating = data.via_ferrata_rating;
             this.hiking_rating = data.hiking_rating;
             this.mtb_down_rating = data.mtb_down_rating;
             this.mtb_up_rating = data.mtb_up_rating;
             this.rock_free_rating = data.rock_free_rating;
             this.exposition_rock_rating = data.exposition_rock_rating;
             this.rock_required_rating = data.rock_required_rating;
             this.aid_rating = data.aid_rating;
             this.ski_exposition = data.ski_exposition;
             this.hiking_mtb_exposition = data.hiking_mtb_exposition;
             this.glacier_gear = data.glacier_gear;
             this.geom = data.geometry.geom;
             this.geom_detail = data.geometry.geom_detail;


         });
     }


     saveDraft(dalert:boolean)
     {

         let coord = Array();
         let geom = null;

         if(this.longitude != null)
         {
             coord = this.GlobalService.degrees2meters(parseFloat(this.longitude),parseFloat(this.latitude));
             geom = "{\"type\":\"Point\",\"coordinates\":["+coord[0]+","+coord[1]+"]}";
         }
         if(this.geom != null)
             geom = this.geom;



         let coord_detail = "";
         for(var i=0;i<this.trace.length;i++)
         {
             let tmp_coord = this.GlobalService.degrees2meters(parseFloat(this.trace[i].lon),parseFloat(this.trace[i].lat));
             if(coord_detail  == "")
                 coord_detail = "["+tmp_coord[0]+","+tmp_coord[1]+"]";
             else
                 coord_detail = coord_detail+","+"["+tmp_coord[0]+","+tmp_coord[1]+"]";
         }

         let geom_detail = null;
         if(coord_detail != "")
             geom_detail = "{\"type\":\"LineString\",\"coordinates\":["+coord_detail+"]}";
         if(this.geom_detail != null)
             geom_detail = this.geom_detail

         let obj = {
             "associations": {
                 "waypoints": this.wllist,
                 "waypoint_children": [],
                 "routes": this.rtlist,
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
                 "slope": this.slope,
                 "summary": this.summary,
                 "description": this.description,
                 "remarks": this.remarks,
                 "route_history": this.history,
                 "gear": this.gear,
                 "external_resources": this.external_resources
             }],
             "type": "",
             "activities": this.activities,
             "document_id": 0,
             "quality": this.quality,
             "geometry": {
                 "geom": geom,
                 "geom_detail": geom_detail
             },
             "main_waypoint_id": this.main_waypoint_id,
             "main_waypoint_title": this.main_waypoint_title,
             "climbing_outdoor_type": this.climbing_outdoor_type,
             "route_types": this.route_types,
             "configuration": this.configuration,
             "rock_types": this.rock_types,
             "elevation_min": this.elevation_min,
             "elevation_max": this.elevation_max,
             "height_diff_up": this.height_diff_up,
             "height_diff_down": this.height_diff_down,
             "height_diff_access": this.height_diff_access,
             "height_diff_difficulties": this.height_diff_difficulties,
             "difficulties_height": this.difficulties_height,
             "route_length": this.route_length,
             "orientations": this.orientation,
             "mtb_length_asphalt": this.mtb_length_asphalt,
             "mtb_length_trail": this.mtb_length_trail,
             "mtb_height_diff_portages": this.mtb_height_diff_portages,
             "durations": this.durations,
             "lift_access": this.lift_access,
             "ski_rating": this.ski_rating,
             "labande_ski_rating": this.labande_ski_rating,
             "labande_global_rating": this.labande_global_rating,
             "snowshoe_rating": this.snowshoe_rating,
             "global_rating": this.global_rating,
             "engagement_rating": this.engagement_rating,
             "equipment_rating": this.equipment_rating,
             "ice_rating": this.ice_rating,
             "mixed_rating": this.mixed_rating,
             "risk_rating": this.risk_rating,
             "via_ferrata_rating": this.via_ferrata_rating,
             "hiking_rating": this.hiking_rating,
             "mtb_down_rating": this.mtb_down_rating,
             "mtb_up_rating": this.mtb_up_rating,
             "rock_free_rating": this.rock_free_rating,
             "exposition_rock_rating": this.exposition_rock_rating,
             "rock_required_rating": this.rock_required_rating,
             "aid_rating": this.aid_rating,
             "ski_exposition": this.ski_exposition,
             "hiking_mtb_exposition": this.hiking_mtb_exposition,
             "glacier_gear": this.glacier_gear
         };



         this.btsave = false;
         this.loader = true;



         this.storage.get('routes_draft_list').then((val) => { 

             if(val == null)
                 val = Array();
             if(this.idd == -1)
                 val.push({ date:new Date(),data:obj}); 
             else
                 val[this.idd] = { date:new Date(),data:obj}; 
             this.storage.set('routes_draft_list', val);     

         });



         if(dalert)
         {
             let alert = this.alertCtrl.create({
                 title: 'Camptocamp',
                 subTitle: 'Le brouillon de votre itinéraire est enregistré dans le carnet de note.',
                 buttons: [{text:'Fermer',role:"cancel",handler: () => {
                     this.bypassexit = true;
                     this.navCtrl.pop();
                 }}]
             });
             alert.present();
         }
     }

    }