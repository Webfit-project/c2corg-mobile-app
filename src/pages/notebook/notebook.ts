import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';
import { Storage } from '@ionic/storage';
import { Addouting } from './../trace/add_outing';
import { Addroute } from './../trace/add_route';
import { Addwaypoint } from './../trace/add_waypoint';
import { GlobalService } from '../../app/app.global.service';
import { PictureToUpload } from '../picture/picturetoupload';
import { Toast } from '@ionic-native/toast';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-notebook',
    templateUrl: 'notebook.html',
    providers: [Toast]
})
export class Notebook {
    nbroute:number;
    nbwaypoint:number;
    nbouting:number;
    tab: string;
    firstloading:boolean;
    nbulinwait: number;
    imginwait:Array<string>;
    nbimginwait:number;
    routes:Array<any>;
    outings:Array<any>;
    waypoints:Array<any>;

    
    constructor(public platform: Platform, private ga: GoogleAnalytics,public toast: Toast,public navCtrl: NavController,private Datafeeder : Datafeeder,public storage: Storage,public globalService:GlobalService) {
        this.firstloading = true;
        this.imginwait = Array();
        this.nbimginwait = 0;
        
        this.platform.ready().then(() => {
             this.ga.trackView("Carnet de note","#notebook",true);
         });
    }

    ionViewDidEnter(){
        if(this.firstloading)
        {
          
            this.firstloading = false;
            this.loadDraft(true); 

        }
        else
        {
            this.loadDraft(false); 
        }
        
         this.hasUploadInWait();
        
    }
    displayDate(d)
    {
        var year = d.getFullYear();
        var month = (d.getMonth()+1).toString();
        if(parseInt(month) < 10)
            month = "0"+month;
            
        var day = d.getDate();
        
        if(parseInt(day) < 10)
            day = "0"+day;
        
        return day+"/"+month+"/"+year;
    }

    loadDraft(autoselect:boolean) {

        var tabtmp = "";
        this.storage.get('outings_draft_list').then((v1) => {        
       
            if(v1 != null)
                this.nbouting = v1.length;
            else
                this.nbouting = 0;

            tabtmp = "outing";
            this.outings = v1;


            this.storage.get('routes_draft_list').then((v2) => {        
                if(v2 != null)
                    this.nbroute = v2.length;
                else
                    this.nbroute = 0;
                
                if(this.nbroute > this.nbouting)
                    tabtmp= "route"

                this.routes = v2;

                this.storage.get('waypoints_draft_list').then((v3) => {        
                    if(v3 != null)
                        this.nbwaypoint = v3.length;
                    else
                        this.nbwaypoint = 0;

                    if(this.nbouting > this.nbwaypoint)
                    {
                        if(tabtmp == "route" && this.nbwaypoint > this.nbroute)
                            tabtmp  = "waypoint";


                    }
                    this.waypoints = v3;
                    console.log(this.waypoints);
                    if(autoselect)
                        this.tab = tabtmp;
                    
                    
                    
                });  
            });   
        });


    }
   goUploadPicture()
     {
         if(!this.globalService.getIsOnline())
         {
             this.toast.show("Aucune connexion detecté", '3000', 'bottom').subscribe(toast => {});
             return;
         }

         this.navCtrl.push(PictureToUpload,{picturetoul: this.imginwait,id_outing:null});


     }

    hasUploadInWait()
     {

         this.storage.get("imginwait").then((val) => { 

             if(val != null)
             {   
                 this.imginwait = val;
                 this.nbimginwait = val.length;
             }

         });
     }
    
    addObject(index:number) {
        if(this.tab == "outing")
        {
            this.navCtrl.push(Addouting,{draft:index}); 
        } else if(this.tab == "waypoint")
        {
            this.navCtrl.push(Addwaypoint,{draft:index}); 
        } else if(this.tab == "route")
        {
            this.navCtrl.push(Addroute,{draft:index}); 
        } 
    }

}