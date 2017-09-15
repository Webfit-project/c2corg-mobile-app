import { Component} from '@angular/core';
import { Topos_slides} from '../topos_slides/topos_slides';
import {NavController, NavParams, Platform } from 'ionic-angular';
import { Datafeeder } from '../../app/datafeeder';
import {Http,  Headers} from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import { Proximity_page} from '../proximity_page/proximity_page';
import { Topos_page } from '../topos_page/topos_page';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var nativemap: any;



@Component({
    selector: 'page-outing',
    templateUrl: 'outing.html'
})
export class Outing {
    topos: string;
    id: any;
    data: any;
    loader : boolean;
    activities: Array<any>;
    areas: Array<any>;
    route_description:string;
    description: string;
    summary: string;
    title:string;
    title_prefix: string;

    elevation_min:string;
    elevation_max:string;



    height_diff_down:string;
    height_diff_up:string;


    geometry:any;
    waypoints:Array<any>;
    routes:Array<any>;
    users:Array<any>;
    images:Array<any>;
    quality:string;
    idlg:number;
    idlg_loc:Array<number>;

    btreload:boolean;

    firstloading:boolean;


    imgtmp:string;

    access_comment :string;
    avalanches:string;
    conditions:string;
    conditions_levels:string;
    hut_comment:string;
    participants:string;
    timing:string
    weather:string;

    avalanche_signs:Array<string>;
    date_end:string;
    date_start:string;
    elevation_access:string;
    elevation_down_snow:string;
    elevation_up_snow:string;
    frequentation:string;
    glacier_rating:string;
    hut_status:string;
    length_total:string;
    lift_status:string;
    partial_trip:boolean;
    participant_count:number;
    public_transport:boolean;
    snow_quality:string;
    snow_quantity:string;
    access_condition:string;


    constructor(public platform: Platform, private ga: GoogleAnalytics,public GlobalService:GlobalService,public navCtrl: NavController,private navParams: NavParams,private Datafeeder : Datafeeder, public http:Http,public storage: Storage) {

        this.loader = true;
        this.topos = "list";
        this.id= navParams.get('id');
        this.images= Array();
        this.avalanche_signs = Array();
        this.firstloading = true;
        this.idlg = 0;
        this.loader = true;
        this.idlg_loc = Array();
        this.waypoints = Array();
        this.routes = Array();
        this.users = Array();
        this.btreload = false;
        this.description = "";
        this.route_description = "";
        this.hut_comment = "";
        this.timing = "";
        this.avalanches = "";
        this.weather = "";
        this.conditions = "";
        this.access_comment = "";

        this.platform.ready().then(() => {
            this.ga.trackView("Page Outing","#outing",true);
        });


    }
    ionViewDidEnter(){
        if(this.firstloading)
        {
            this.firstloading = false;
            this.LoadOuting();

        }
    }
    gotoSlide() {
        this.navCtrl.push(Topos_slides,{images:this.images}); 
    }



    errorOuting(err:any)
    {
        console.log("erreur route");
        this.btreload = true;
        this.loader = false;
    }
    reLoadOuting()
    {
        this.loader = true;
        this.btreload = false;
        this.LoadOuting();
    }
    LoadOuting()
    {
        this.Datafeeder.requestapi("outing",{id:this.id,view:this});
    }
    setOuting(data)
    {   


        if(data.locales != null)
        {
            for(let i = 0;i<data.locales.length;i++)
            {
                if(data.locales[i].lang == "fr")
                {
                    this.idlg = i;
                    break;
                }
            }
        }
        if(data.areas != null)
        {
            for(let i = 0;i<data.areas.length;i++)
            {

                for(let j = 0;j<data.areas[i].locales.length;j++)
                {
                    if(data.areas[i].locales[j].lang == "fr")
                    {
                        this.idlg_loc.push(j);
                        break;
                    }
                }

            }
        }

        this.waypoints = data.associations.waypoints;
        this.routes= data.associations.routes;
     
        for(let i = 0;i < this.routes.length ; i++) {
            for(let j = 0;j < this.routes[i].locales.length; j++) {
                if(this.routes[i]['locales'][j]['lang'] == "fr") {
                    this.routes[i]['idlg'] = i;
                }

            }

            if(this.routes[i]['idlg'] == null) {
                this.routes[i]['idlg'] = 0;
            }

        }


        this.users = data.associations.users;

        if(data.locales[this.idlg].route_description != null)
            this.route_description = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].route_description);
        if(data.locales[this.idlg].access_comment != null)
            this.access_comment = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].access_comment);
        if(data.locales[this.idlg].avalanches != null)
            this.avalanches = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].avalanches);
        if(data.locales[this.idlg].conditions != null)
            this.conditions = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].conditions);
        this.conditions_levels = data.conditions_levels; 
        if(data.locales[this.idlg].hut_comment != null)
            this.hut_comment = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].hut_comment);
        this.participants = data.locales[this.idlg].participants;
        if(data.locales[this.idlg].timing != null)
            this.timing = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].timing);
        if(data.locales[this.idlg].weather != null)
            this.weather = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].weather);
        if(data.avalanche_signs != null)
            this.avalanche_signs = data.avalanche_signs;
        this.date_end = data.date_end;
        this.date_start = data.date_start;
        this.elevation_access = data.elevation_access;
        this.elevation_down_snow = this.GlobalService.unit(data.elevation_down_snow);
        this.elevation_up_snow = this.GlobalService.unit(data.elevation_up_snow);
        this.frequentation = data.frequentation;

        this.glacier_rating = data.glacier_rating;
        this.height_diff_down = this.GlobalService.unit(data.height_diff_down);
        this.height_diff_up = this.GlobalService.unit(data.height_diff_up);
        this.hut_status = data.hut_status;
        this.lift_status = data.lift_status;
        this.partial_trip = data.partial_trip;
        this.participant_count = data.participant_count;
        this.public_transport = data.public_transport;
        this.snow_quality = data.snow_quality;
        this.snow_quantity = data.snow_quantity;
        this.access_condition = data.access_condition;

        this.elevation_min = this.GlobalService.unit(data.elevation_min);
        this.elevation_max = this.GlobalService.unit(data.elevation_max);
        if(data.length_total != null)
        {
            if(data.length_total != 0)
            {
                this.length_total = this.GlobalService.unitK(data.length_total);
            }
            else
            {
                this.length_total = "0";
            }
        }


        this.title = data.locales[this.idlg].title;
        this.title_prefix = data.locales[this.idlg].title_prefix;
        if(data.locales[this.idlg].description != null)
            this.description = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].description);

        this.summary = data.locales[this.idlg].summary;


        this.activities = data.activities;
        this.areas = data.areas;

        this.geometry = data.geometry;


        if(data.associations.images != null)
        {
            this.images = data.associations.images;
            if(this.images.length > 0)
                this.onload();
        }
        this.quality = data.quality;



        if(this.loader)
            this.loader = false;
    }

    onload() {


        var headers = new Headers();
        headers.append("Accept", 'application/x-www-form-urlencoded');

        headers.append('Content-Type','application/x-www-form-urlencoded');


        var xhr = new XMLHttpRequest();

        xhr.onload = () => {
            var reader = new FileReader();
            reader.onloadend = () => {

                this.imgtmp = reader.result;

            }
            reader.readAsDataURL(xhr.response);
        };

        console.log("https://api.webfit.io/img.php?f="+this.images[0].filename);
        xhr.open('GET', 'https://api.webfit.io/img.php?f='+this.images[0].filename);
        xhr.responseType = 'blob';
        xhr.send();

    }
    datetostr(q:string)
    {

        var tab = q.split("-");
        var monthStr = {"01": "janvier","02":"février","03":"mars","04":"avril","05":"mai","06":"juin","07":"juillet","08":"août","09":"septembre","10":"octobre","11":"novembre","12":"decembre"};

        return tab[2]+" "+monthStr[tab[1]]+" " + tab[0];
    }
    access_conditiontostr(q:string)
    {
        switch(q)
                {
            case "cleared":
                return "Déneigé";

            case "snowy":
                return "Enneigé";

            case "closed_snow":
                return "Fermé enneigé";

            case "closed_cleared":
                return "Fermé déneigé";
        }
    }
    datatostr(q:string)
    {
        switch(q)
                {
            case "excellent":
                return "Excellentes";

            case "good":
                return "Bonnes";

            case "average":
                return "Moyennes";

            case "poor":
                return "Mauvaises";

            case "awful":
                return "Exécrables";
        }
    }

    frequentationtostr(q:string)
    {
        switch(q)
                {
            case "quiet":
                return "Non fréquenté";

            case "some":
                return "Peu fréquenté";

            case "crowded":
                return "Assez fréquenté";

            case "overcrowded":
                return "Très fréquenté";

        }
    }

    lift_statustostr(q:string)
    {

        switch(q)
                {

            case "open":
                return "Ouverte";
            case "closed":
                return "Fermées";
        }
    }
    hut_statustostr(q:string)
    {

        switch(q)
                {

            case "open_guarded":
                return "Ouvert gardé";
            case "open_non_guarded":
                return "Ouvert non gardé";
            case "closed_hut":
                return "Refuge fermé";
        }
    }

    glacier_ratingtostr(q:string)
    {
        switch(q)
                {
            case "easy":
                return "Bouché - passage sans problème";

            case "possible":
                return "Délicat - passage possible";

            case "difficult":
                return "Ouvert - passage difficile";

            case "impossible":
                return "Infranchissable - passage impossible";

        }
    }
    avalanche_signstostr(q:string)
    {

        switch(q)
                {
            case "no":
                return "Non";

            case "danger_sign":
                return "Signaux d'alerte autres que des traces d'avalanche";

            case "recent_avalanche": 
                return "Trace d'avalanche récente (après la dernière chute de neige, pluie, vent ou redoux";

            case "natural_avalanche":
                return "Avalanche naturelle le jour de la sortie";

            case "accidental_avalanche":
                return "Avalanche déclenchée par une personne le jour de la sortie";
        }
    }


    qualitytostr(q:string)
    {

        switch(q)
                {
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



    showMap() {
        var that = this;

        nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
    }
    startMap() {




        let iconList = Object();
        iconList.list = Array();
        if(this.waypoints != null)
        {
            for(let i=0;i<this.waypoints.length;i++)
            {

                var geo = JSON.parse(this.waypoints[i].geometry.geom);
                var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
                if(this.waypoints[i].locales[0].summary == null)
                    this.waypoints[i].locales[0].summary = "";

                var title = "";
                if(this.waypoints[i].locales[0].title_prefix != null)
                    title = this.waypoints[i].locales[0].title_prefix+ " : ";

                title = title+""+this.waypoints[i].locales[0].title;


                iconList.list.push({id:this.waypoints[i].document_id,title: title, description: this.GlobalService. c2cTagCleaner(this.waypoints[i].locales[0].summary) ,"lat": c1[1],"lon": c1[0],"icon": this.waypoints[i].waypoint_type})

            }


        }
        if(this.routes != null)
        {
            for(let i=0;i<this.routes.length;i++)
            {

                var geo = JSON.parse(this.routes[i].geometry.geom);
                var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
                if(this.routes[i].locales[0].summary == null)
                    this.routes[i].locales[0].summary = "";

                var title = "";
                if(this.routes[i].locales[0].title_prefix != null)
                    title = this.routes[i].locales[0].title_prefix+ " : ";

                title = title+""+this.routes[i].locales[0].title;


                iconList.list.push({id:this.routes[i].document_id,title: title, description: this.GlobalService. c2cTagCleaner(this.routes[i].locales[0].summary) ,"lat": c1[1],"lon": c1[0],"icon": "icon_itineraire"})

            }
        }
        var route = Object();
        route.list = Array();

        if(this.geometry.geom_detail != null)
        {
            var details = JSON.parse(this.geometry.geom_detail);
            console.log(details);
            if(details.type == "MultiLineString")
            {
                for(var j = 0;j<details.coordinates.length;j++)
                {
                    for(var i = 0;i<details.coordinates[j].length;i++)
                    {
                        var cr = this.GlobalService.meters2degress(details.coordinates[j][i][0],details.coordinates[j][i][1]);
                        route.list.push({lat:cr[1],lon:cr[0]});

                    }
                }

            }
            else
            {
                for(var i = 0;i<details.coordinates.length;i++)
                {
                    var cr = this.GlobalService.meters2degress(details.coordinates[i][0],details.coordinates[i][1]);
                    route.list.push({lat:cr[1],lon:cr[0]});

                }
            }
        }

        var geoc = JSON.parse(this.geometry.geom);
        var cn = this.GlobalService.meters2degress(geoc.coordinates[0],geoc.coordinates[1]);

        var center = '{"lat":'+cn[1]+',"lon":'+cn[0]+'}';

        var that = this;

        nativemap.startMap(center,iconList,route,"","13","1","1","0",this.GlobalService.carte,function(e) {

            if(e != null)
            {
                if(that.waypoints != null)
                {
                    for(let i=0;i<that.waypoints.length;i++)
                    {
                        if(that.waypoints[i].document_id == e)
                        {
                            that.navCtrl.push(Proximity_page,{id: e});
                            break;
                        }
                    }
                }
                if(that.routes != null)
                {
                    for(let i=0;i<that.routes.length;i++)
                    {
                        if(that.routes[i].document_id == e)
                        {
                            that.navCtrl.push(Topos_page,{id: e});
                            break;
                        }
                    }
                }

            }

        },function(){console.log("impossible de lancer la map")});

    }



}