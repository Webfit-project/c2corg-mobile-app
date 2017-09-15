import { Component , ViewChild} from '@angular/core';
import { Config } from '../config/config';
import { Trace } from '../trace/trace';
import { NavController,Content,NavParams,AlertController,Platform } from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';
import {Http,  Headers} from '@angular/http';
import { Connexion } from '../connexion/connexion';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { GlobalService } from '../../app/app.global.service';
import { PictureToUpload } from '../picture/picturetoupload';
import { Proximity_page } from '../proximity_page/proximity_page';
import { Topos_page } from '../topos_page/topos_page';
import { Topos_tabs } from '../topos_tabs/topos_tabs';
import { Article } from '../article/article';
import { Outing } from '../outing/outing';
import {Md5} from 'ts-md5/dist/md5';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-main',
    templateUrl: 'main.html',
    providers: [Toast]
})


export class Main {
    @ViewChild(Content) content:Content;
     private http: any;

     loader:boolean;
     tokenFeed: string;
     posts: Array<any>;
     btreload:boolean;
     nbimginwait:number;
     imginwait:Array<string>;
     portrait:string;
     token: string;
     uscroll : any;
     
     firstloading:boolean;
     nbtoposhl:number;
     displayltoposhl: boolean;

     constructor(public platform: Platform, private ga: GoogleAnalytics,public toast: Toast,public alertCtrl: AlertController,public navCtrl: NavController, private Datafeeder : Datafeeder , http:Http, public storage:Storage,navParams: NavParams,public globalService:GlobalService) {
         this.http = http;
         this.posts = Array();
         this.nbimginwait = 0;
         this.firstloading = true;
         this.loader = true;
         this.btreload=false;

         let portrait = navParams.get('portrait');
         if(portrait == null)
         {
             storage.get('portrait').then((portrait) => { 

                 if(portrait == null)
                 {
                     this.portrait= "assets/img/p/default.svg";
                 }
                 else if(Md5.hashStr(portrait) == "ce53c330629ef544fa2bbef813749ac8")
                 {
                     this.portrait= "assets/img/p/default.svg";
                 }
                 else
                 {
                     this.portrait = portrait;
                 }
             });
         }
         else
         {
             this.portrait = portrait;
         }

         this.platform.ready().then(() => {
             this.ga.trackView("Feed page","#main",true);
         });

     }

     ionViewDidEnter() {
         if(this.firstloading)
         {
             this.loadFeed();
             this.firstloading = false;
         }
         this.hasUploadInWait();
         this.displayLinkToposHl();


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

     displayLinkToposHl()
     {
         this.storage.get('ltoposhl').then((val) => {

             if(val)
             {
                 this.displayltoposhl = val;
                 this.storage.get('topos_list').then((val) => { 

                     if(val != null)
                     {
                         this.nbtoposhl = val.length;
                     }

                 });
             }
             else
             {
                 this.displayltoposhl = false;
             }
         });
     }


     gotoConnexion()
     {
         this.navCtrl.setRoot(Connexion);
     }

     displayDate(str)
     {

         var d = Date.parse(str);
         var now = Date.now();
         var year = this.dateDiffInYears(d,now);
         var month = this.dateDiffInMonths(d,now);
         var day = this.dateDiffInDays(d,now);
         var hour = this.dateDiffInHours(d,now);
         var minute = this.dateDiffInMinutes(d,now);
         if(year >= 1)
         {
             if(year >= 2)
                 return year+" ans"
             else
                 return "1 an"

         }
         else if(month >= 1) 
         {
             return month+" mois";
         }
         else if(day >= 1) 
         {
             if(year >= 2)
                 return day+" jours"
             else
                 return "1 jour"
         }
         else if(hour >= 1) 
         {
             return hour+ " h";
         }
         else if(minute >= 1) 
         {
             return minute+ " m";
         }
         else
         {
             return "A l'instant";
         }

     }

     dateDiffInMinutes(d,now) {return Math.floor((now - d)/(1000 * 60 * 60 ))}
     dateDiffInHours(d,now) {return Math.floor((now - d)/(1000 * 60 * 60 ))}
     dateDiffInDays(d,now) {return Math.floor((now - d)/(1000 * 60 * 60 * 24 ))}
     dateDiffInMonths(d,now) {return Math.floor((now - d)/(1000 * 60 * 60 * 24 * 30 ))}
     dateDiffInYears(d,now) {return Math.floor((now - d)/(1000 * 60 * 60 * 24 * 365 ))}

     goUploadPicture()
     {
         if(!this.globalService.getIsOnline())
         {
             this.toast.show("Aucune connexion detecté", '3000', 'bottom').subscribe(toast => {});
             return;
         }

         this.navCtrl.push(PictureToUpload,{picturetoul: this.imginwait,id_outing:null});


     }

     goToPage(type:string,id:string)
     {
         switch(type)
                 {
             case "o":
                 this.navCtrl.push(Outing,{id:id}); 
                 break;

             case "r":
                 this.navCtrl.push(Topos_page,{id:id}); 
                 break;

             case "c":
                 this.navCtrl.push(Article,{id:id}); 
                 break;
                 
                 case "w":
                 this.navCtrl.push(Proximity_page ,{id:id}); 
                 break;
         }
     }

     navigateTo(page) {
         switch(page)
                 {

             case "toposhl":
                 this.navCtrl.push(Topos_tabs,{list:"offline"});
                 break;
             case "config":

                 this.navCtrl.push(Config,{portrait:this.portrait});
                 break;

             case "trace":

                 this.navCtrl.push(Trace);
                 break;
         }
     }
     public setFeed(data)
     {

         this.loader = false;

         let tab = data.token.split(",");
         this.token = (parseInt(tab[0])+11).toString()+","+tab[1];

         for(let i = 0;i<data.feed.length;i++)
         {

             this.posts.push(data.feed[i]);
             if(data.feed[i].images[0] != null)   
             {
                 this.onload(this.posts.length-1);
                 this.onloadPortrait(this.posts.length-1);
             }
         }


         if(this.uscroll != null) 
             this.uscroll.complete();
     }
     reloadFeed() {
         this.btreload = false;
         this.loader = true;
         this.loadFeed();
     }
     loadFeed() {

         if(this.globalService.getIsOnline())
         {
             this.btreload = false;
             this.loader = true;
             if(this.Datafeeder.getIsLogged())
                this.Datafeeder.requestapi("feed",{token:this.token,view:this});
             else
                 this.Datafeeder.requestapi("feed-nolog",{token:this.token,view:this});
         }
         else
         {
             this.btreload = true;
             this.loader = false;
         }
     }



     feedError(err:any)
     {
       console.log(err);
         this.btreload = true;
         this.loader = false;

         if(err.status == 500)
         {

         }
         else if(err.message == "No JWT present or has expired")
         {

             this.Datafeeder.relogin(this);
         }
         else
         {
             if(err.errors != null)
             {
                 if(err.errors[0].name == "Forbidden")
                 {

                     this.Datafeeder.relogin(this);
                 }
                 else
                 {
                     this.navCtrl.setRoot(Connexion);
                 }
             }

             else
             {
                 //this.navCtrl.setRoot(Connexion);
             }

         }

     }

     toDataUrl(url, callback) {
         var xhr = new XMLHttpRequest();
         xhr.onload = function() {
             var reader = new FileReader();
             reader.onloadend = function() {
                 callback(reader.result);
             }
             reader.readAsDataURL(xhr.response);
         };
         xhr.open('GET', url);
         xhr.responseType = 'blob';
         xhr.send();
     }
     onloadPortrait(id) {


         var headers = new Headers();
         headers.append("Accept", 'application/x-www-form-urlencoded');

         headers.append('Content-Type','application/x-www-form-urlencoded');



         var xhr = new XMLHttpRequest();
         var that = this;
         xhr.onload = function() {
             var reader = new FileReader();
             reader.onloadend = function() {

                 that.posts[id].portraittmp = reader.result;

             }
             reader.readAsDataURL(xhr.response);
         };

         xhr.open('GET', 'https://api.webfit.io/portrait.php?f='+this.posts[id].author.forum_username);
         xhr.responseType = 'blob';
         xhr.send();

     }
     onload(id) {


         var headers = new Headers();
         headers.append("Accept", 'application/x-www-form-urlencoded');

         headers.append('Content-Type','application/x-www-form-urlencoded');


         var xhr = new XMLHttpRequest();
         var that = this;
         xhr.onload = function() {
             var reader = new FileReader();
             reader.onloadend = function() {

                 that.posts[id].imgtmp = reader.result;

             }
             reader.readAsDataURL(xhr.response);
         };

         xhr.open('GET', 'https://api.webfit.io/img.php?f='+this.posts[id].images[0].filename);
         xhr.responseType = 'blob';
         xhr.send();

     }
     doInfinite(infiniteScroll) {
         this.uscroll = infiniteScroll;
         this.loadFeed();

     }

    }
