import { Component , Renderer2 , ElementRef} from '@angular/core';
import { Topos_slides} from '../topos_slides/topos_slides';
import {NavController, NavParams  , Events, Platform} from 'ionic-angular';
import { Datafeeder } from '../../app/datafeeder';
import {Http,  Headers, RequestOptions} from '@angular/http';
import { GlobalService } from '../../app/app.global.service';
import { Storage } from '@ionic/storage';
import { Topos_page } from '../topos_page/topos_page';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var nativemap: any;

@Component({
    selector: 'page-proximity-page',
    templateUrl: 'proximity_page.html'
})
export class Proximity_page {
    id: any;
    topos: string;
    images:Array<any>;
    summary: string;
    title:string;
    waypoint_type:string;
    prominence: string;
    data:any;
    areas: Array<any>;
    description: string;

    idlg : number;
    idlg_loc:Array<number>;
    loader: boolean;
    btreload:boolean;
    imgtmp : string;
    orientations: {N:boolean,NE:boolean,E:boolean,SE:boolean,S:boolean,SW:boolean,W:boolean,NW:boolean};


    route_length:string;
    maps:Array<any>;

    global_rating:string;

    geometry:any;
    routes_types:any;
    type:string;
    climbing_outdoor_type:string;
    rock_required_rating:string;

    exposition_rock_rating:string;
    glacier_gear:string;
    rock_types:Array<any>;
    rock_free_rating:string;
    engagement_rating :string;
    aid_rating:string;
    quality:string;

    access_time:string;
    climbing_rating_min:string;
    climbing_rating_median: string;
    climbing_rating_max: string;
    rain_proof:string;
    children_proof:string;
    equipment_ratings: Array<string>;
    climbing_indoor_types: Array<string>;
    climbing_outdoor_types: Array<string>;
    height_min: string;
    height_median: string;
    height_max: string;
    phone: string;
    custodianship: string;
    url:string;
    climbing_styles: Array<string>;
    best_periods: Array<string>;
    elevation: string;
    routes_quantity: number;
    firstloading: boolean;
    offlineData: boolean;
    
    latitude:number;
    longitude: number;

    constructor(public platform: Platform, private ga: GoogleAnalytics,public storage: Storage,public GlobalService:GlobalService,public navCtrl: NavController,private navParams: NavParams,private Datafeeder : Datafeeder, public http:Http,elementRef: ElementRef,public renderer: Renderer2,public events: Events) {
        this.firstloading = true;
        this.id= navParams.get('id');
        this.loader = true;
        this.btreload = false;
        this.topos = "list";
        this.images= Array();
        this.idlg = 0;
        this.idlg_loc = Array();
        this.orientations = {N:false,NE:false,E:false,SE:false,S:false,SW:false,W:false,NW:false};
        this.offlineData = false;


        renderer.listen(elementRef.nativeElement, 'click', (event) => {
            if(event.path[0].className == "dlink")
            {

                this.gotoPage(event.path[0].attributes['data-type'].value,event.path[0].attributes['data-id'].value);


            }
        })

        this.platform.ready().then(() => {
            this.ga.trackView("Page waypoint","#proximity_page",true);
        });
    }

    ionViewDidEnter(){
        if(this.firstloading)
        {
            this.firstloading = false;
            this.loadWaypoint();

        }
    }

    gotoPage(type:string,id:string)
    {
        this.events.publish('goto:Page', {type:type,id:id});
    }

    gotoSlide() {
        this.navCtrl.push(Topos_slides,{images:this.images}); 
    }

    saveOffline()
    {
        this.storage.get('waypoints_list').then((val) => { 

            if(val == null)
                val = Array();

            if(val.indexOf(this.id) > -1 )
                return false;

            val.push(this.id); 

            this.storage.set('waypoints_list', val);                   
        });
        this.storage.set('waypoint-'+this.id, this.data);
        this.offlineData = true;
    }
    rmOffline()
    {

        this.offlineData = false;
        this.storage.remove('waypoint-'+this.id);
        this.storage.get('waypoints_list').then((val) => { 

            if(val.length == 0 )
                return false;

            val.splice(val.indexOf(this.id), 1);
            this.storage.set('waypoints_list', val);   


        });
    }

    errorWaypoint(err:any)
    {

        this.btreload = true;
        this.loader = false;
    }
    reloadWaypoint()
    {
        this.loader = true;
        this.btreload = false;
        this.loadWaypoint();
    }

    loadWaypoint()
    {
        this.storage.get('waypoint-'+this.id).then((val) => { 


            if(val != null)
            {
                this.setWaypoint(val);
                this.offlineData = true;
            }


        });

        this.Datafeeder.requestapi("waypoint",{id:this.id,view:this});
    }

    setWaypoint(data)
    {   


        this.data = data;
        for(let i = 0;i<data.locales.length;i++)
        {
            if(data.locales[i].lang == "fr")
            {
                this.idlg = i;
                break;
            }
        }

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

        if(data.orientations != null)
        {
            for(let i = 0;i<data.orientations.length;i++)
            {
                switch(data.orientations[i])
                        {
                    case "N":
                        this.orientations.N= true;
                        break;

                    case "NE":
                        this.orientations.NE= true;
                        break;

                    case "E":
                        console.log("on a bien l'est");
                        this.orientations.E= true;
                        break;

                    case "SE":
                        this.orientations.SE= true;
                        break;

                    case "S":
                        this.orientations.S= true;
                        break;

                    case "SW":
                        this.orientations.SW= true;
                        break;

                    case "W":
                        this.orientations.W= true;
                        break;

                    case "NW":
                        this.orientations.NW= true;
                        break;
                }
            }
        }

        this.images = data.associations.images;

        if(this.images != null)
        {
            if(this.images.length > 0)
                this.onload();
        }

        this.elevation = data.elevation;
        this.route_length = data.route_length;
        this.title = data.locales[this.idlg].title;

        if(data.locales[this.idlg].description != null)
            this.description = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].description);
        else
            this.description = data.locales[this.idlg].description

        if(data.locales[this.idlg].summary != null)
            this.summary = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].summary);
        else
            this.summary = data.locales[this.idlg].summary

        this.areas = data.areas;

        this.access_time = data.access_time;

        this.climbing_rating_min = data.climbing_rating_min;
        this.climbing_rating_median = data.climbing_rating_median;
        this.climbing_rating_max = data.climbing_rating_max;
        this.rain_proof = data.rain_proof;
        this.children_proof = data.children_proof;
        this.equipment_ratings = data.equipment_ratings;
        this.climbing_indoor_types = data.climbing_indoor_types;
        this.climbing_outdoor_types = data.climbing_outdoor_types;
        this.height_min = this.GlobalService.unit(data.height_min);
        this.height_median = this.GlobalService.unit(data.height_median);
        this.height_max = this.GlobalService.unit(data.height_max);
        this.phone = data.phone;
        this.custodianship = data.custodianship;
        this.url = data.url;
        this.climbing_styles = data.climbing_styles;
        this.best_periods = data.best_periods;
        this.type= data.type;
        this.elevation = this.GlobalService.unit(data.elevation);
        this.routes_quantity = data.routes_quantity;
        this.rock_types = data.rock_types;
        this.quality = data.quality;
        this.waypoint_type = data.waypoint_type;


        this.maps = data.maps;


        this.geometry = data.geometry;
        this.routes_types = data.routes_types;
        this.engagement_rating = data.engagement_rating;
        this.aid_rating = data.aid_rating;

        var geoc = JSON.parse(this.geometry.geom);
        var cn = this.GlobalService.meters2degress(geoc.coordinates[0],geoc.coordinates[1]);
        this.latitude = cn[1];
        this.longitude = cn[0];

        if(this.loader)
            this.loader = false;
    }
    raintostr(q:string)
    {
        switch(q)
                {
            case "exposed":
                return "Exposé à la pluie";

            case "partly_protected":
                return "Partiellement protégé";
            case "protected":
                return "Protégé de la pluie";
            case "inside":
                return "À l'intérieur";
            default:
                return q;

        }
    }
    monthtostr(q:string)
    {
        switch(q)
                {
                // ["jan", "feb", "mar", "apr", "may", "jun", "sep", "oct", "nov", "dec"]
            case "jan":
                return "Janvier ";

            case "feb":
                return "Février ";

            case "mar":
                return "Mars ";

            case "apr":
                return "Avril ";

            case "may":
                return "Mai ";

            case "jun":
                return "Juin ";

            case "jul":
                return "Juillet ";

            case "aug":
                return "Août ";

            case "sep":
                return "Septembre ";

            case "oct":
                return "Octobre ";

            case "nov":
                return "Novembre ";

            case "dec":
                return "Décembre ";

        }
    }
    childrentostr(q:string)
    {
        switch(q)
                {
            case "very_dangerous":
                return "dangereux";
            case "dangerous":
                return "peu adapté";
            case "safe":
                return "adapté";
            case "very_safe":
                return "bien adapté";

        }
    }
    childtostr(q:string)
    {
        switch(q)
                {
            case "very_safe":
                return "Bien adapté";
            case "safe":
                return "adapté";
            case "dangerous":
                return "peu adapté";
            case "very_dangerous":
                return "dangereux";
        }
    }
    typeClimbtostr(q:string)
    {
        switch(q)
                {
            case "slab":
                return "Dalle";
            case "vertical":
                return "Vertical";
            case "overhang":
                return "Dévers-surplomb";
            case "roof":
                return "Toit";
            case "small_pillar":
                return "Colonettes";
            case "crack_dihedral":
                return "fissure-dièdre";
        }
    }
    typetostr(q:string)
    {
        switch(q)
                {
            case "summit":
                return "Sommet";

            case "pass":
                return "Col";

            case "lake":
                return "Lac";

            case "waterfall":
                return "Cascade";

            case "locality":
                return "Lieu-dit";

            case "bisse":
                return "Bisse / béal";

            case "canyon":
                return "Canyon";

            case "access":
                return "Accès";

            case "climbing_outdoor":
                return "Site d'escalade";

            case "climbing_indoor":
                return "SAE";

            case "hut":
                return "Refuge/cabanne";

            case "gite":
                return "Gîte";

            case "shelter":
                return "Abri";

            case "bivouac":
                return "Bivouac";

            case "camp_site":
                return "Camping";

            case "base_camp":
                return "Camp de base";

            case "local_product":
                return "Produit locaux";

            case "paragliding_takeoff":
                return "Décollage parapente";

            case "paragliding_landing":
                return "Atterrissage parapente";

            case "cave":
                return "Grotte";

            case "waterpoint":
                return "Points d'eau/source";

            case "weather_station":
                return "Station météo";
            case "webcam":
                return "Webcam";

            case "virtual":
                return "Virtuel";
            case "misc":
                return "Divers";

            default:
                return "inconnu ";
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

    onload() {


        var headers = new Headers();
        headers.append("Accept", 'application/x-www-form-urlencoded');

        headers.append('Content-Type','application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {

                that.imgtmp = reader.result;

            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', 'https://api.webfit.io/img.php?f='+this.images[0].filename);
        xhr.responseType = 'blob';
        xhr.send();

    }
    showMap() {
        var that = this;
        nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
        //this.startMap();

    }
    startMap() {
        let iconList = Object();
        iconList.list = Array();

        var center = '{"lat":'+this.latitude+',"lon":'+this.longitude+'}';

        iconList.list.push({id:this.id,title: this.title, description: this.summary ,"lat": this.latitude,"lon": this.longitude,"icon": this.waypoint_type})

        if(this.data.associations.all_routes != null)
        {
            for(let i = 0; i < this.data.associations.all_routes.documents.length;i++)
            {
                var geo = JSON.parse(this.data.associations.all_routes.documents[i].geometry.geom);
                var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
                if(this.data.associations.all_routes.documents[i].locales[0].summary == null)
                    this.data.associations.all_routes.documents[i].locales[0].summary = "";

                var title = "";
                if(this.data.associations.all_routes.documents[i].locales[0].title_prefix != null)
                    title = this.data.associations.all_routes.documents[i].locales[0].title_prefix+ " : ";

                title = title+""+this.data.associations.all_routes.documents[i].locales[0].title;


                iconList.list.push({id:this.data.associations.all_routes.documents[i].document_id,title: title, description: this.GlobalService. c2cTagCleaner(this.data.associations.all_routes.documents[i].locales[0].summary ) ,"lat": c1[1],"lon": c1[0],"icon": "icon_itineraire"})
            }
        }

        var that = this;

        nativemap.startMap(center,iconList,"","","13","1","1","0",this.GlobalService.carte,function(e) {

            if(that.data.associations.all_routes != null)
            {
                for(let i=0;i<that.data.associations.all_routes.documents.length;i++)
                {
                    if(that.data.associations.all_routes.documents[i].document_id == e)
                    {
                        that.navCtrl.push(Topos_page,{id: e});
                        break;
                    }
                }
            }

        },function(){console.log("impossible de lancer la map")});
        console.log("startmap fait");
    }


}
