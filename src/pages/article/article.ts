import { Component , ViewChild} from '@angular/core';
import { Topos_slides} from '../topos_slides/topos_slides';
import {NavController, NavParams,Platform } from 'ionic-angular';
import { Datafeeder } from '../../app/datafeeder';
import {Http,  Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var nativemap: any;



@Component({
    selector: 'page-article',
    templateUrl: 'article.html'
})
export class Article {
    id: any;
    data: any;
    loader : boolean;
    activities: Array<string>;
    categories: Array<string>;
    description: string;
    type:string;
    summary: string;
    title:string;
    images: Array<any>;
    quality:string;
    idlg:number;

    firstloading: boolean;
    btreload:boolean;



    imgtmp : string;
    orientations: {N:boolean,NE:boolean,E:boolean,SE:boolean,S:boolean,SW:boolean,W:boolean,NW:boolean};
    constructor(public platform: Platform, private ga: GoogleAnalytics,public GlobalService:GlobalService,public navCtrl: NavController,private navParams: NavParams,private Datafeeder : Datafeeder, public http:Http,public storage: Storage) {

        this.loader = true;
        this.id= navParams.get('id');
        this.idlg = 0;
        this.images = Array();
        this.firstloading = true;
        this.btreload = false;
        this.description = "";

         this.platform.ready().then(() => {
             this.ga.trackView("Article page","#article",true);
         });

    }
    ionViewDidEnter(){
        if(this.firstloading)
        {
            this.firstloading = false;
            this.loadArticle();

        }
    }

    onload() {


        var headers = new Headers();
        headers.append("Accept", 'application/x-www-form-urlencoded');

        headers.append('Content-Type','application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        let postParams : any;

        var xhr = new XMLHttpRequest();

        xhr.onload = () => {
            var reader = new FileReader();
            reader.onloadend = () => {

                this.imgtmp = reader.result;

            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', 'https://api.webfit.io/img.php?f='+this.images[0].filename);
        xhr.responseType = 'blob';
        xhr.send();

    }

    errorArticle(err:any)
    {
        this.btreload = true;
        this.loader = false;
    }
    gotoSlide() {
        this.navCtrl.push(Topos_slides,{images:this.images}); 
    }
    reloadArticle()
    {
        this.loader = true;
        this.btreload = false;
        this.loadArticle();
    }
    loadArticle()
    {


        this.Datafeeder.requestapi("article",{id:this.id,view:this});
    }
    setArticle(data)
    {   

        for(let i = 0;i<data.locales.length;i++)
        {
            if(data.locales[i].lang == "fr")
            {
                this.idlg = i;
                break;
            }
        }

        this.categories = data.categories;
        this.activities = data.activities;
        this.type = data.article_type;
        this.quality = data.quality;

        this.title = data.locales[this.idlg].title;
        if(data.locales[this.idlg].description!= null)
            this.description = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].description);
        this.summary = data.locales[this.idlg].summary;
        this.images = data.associations.images;

        if(this.images != null)
        {
            if(this.images.length > 0)
                this.onload();
        }


        if(this.loader)
            this.loader = false;
    }

    categorietostr(q:string)
    {
        switch(q)
                {
            case "mountain_environment":
                return "Environnement montagne";

            case "gear":
                return "Matériel";

            case "technical":
                return "Technique";

            case "topoguide_supplements":
                return "Suppléments du topoguide";

            case "soft_mobility":
                return "Mobilité douce";

            case "expeditions":
                return "Expéditions";

            case "stories":
                return "récits";

            case "c2c_meetings":
                return "Réunions c2c";

            case "tags":
                return "Tags";

            case "site_info":
                return "Info site";

            case "association":
                return "Association";
        }

    }
    typetostr(q:string)
    {
        switch(q)
                {
            case "collab":
                return "collaboratif (CC by-sa)";
        }
    }
    qualitytostr(q:string)
    {

        switch(q) {
            case "great":
                return "excellent";

            case "fine":
                return "bon";

            case "medium":
                return "moyenne";

            case "draft":
                return "ébauche";

            case "empty":
                return "vide";

            default:
                return "inconnu";
        }
    }

}