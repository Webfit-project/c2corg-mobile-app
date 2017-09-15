import { Component ,  Renderer2 , ElementRef} from '@angular/core';
import { Topos_slides} from '../topos_slides/topos_slides';
import {NavController, NavParams , Events, Platform} from 'ionic-angular';
import { Datafeeder } from '../../app/datafeeder';
import {Http,  Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import {AlertController} from 'ionic-angular';
import { Proximity_page} from '../proximity_page/proximity_page';
import { Outing } from '../outing/outing';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var nativemap: any;



@Component({
    selector: 'page-topos-page',
    templateUrl: 'topos_page.html'
})
export class Topos_page {
    topos: string;
    id: any;
    data: any;
    loader : boolean;
    activities: Array<any>;
    areas: Array<any>;
    description: string;
    remarks : string;
    slope: string;
    summary: string;
    title:string;
    title_prefix: string;
    gear:string;
    elevation_min:string;
    elevation_max:string;
    route_length:string;
    configuration:Array<string>;
    maps:Array<any>;
    height_diff_difficulties:string;
    height_diff_access:string;
    height_diff_down:string;
    height_diff_up:string;
    difficulties_height:string;
    global_rating:string;
    labande_global_rating:string;
    labande_ski_rating:string;
    ski_rating:string;
    ski_exposition:string;
    geometry:any;
    route_types:any;
    type:string;
    climbing_outdoor_type:string;
    rock_required_rating:string;
    external_resources:string;
    exposition_rock_rating:string;
    glacier_gear:string;
    rock_types:Array<string>;
    durations:Array<string>;
    rock_free_rating:string;
    hiking_mtb_exposition:string;
    engagement_rating :string;
    hiking_rating:string;
    aid_rating:string;
    via_ferrata_rating:string;
    mixed_rating:string;
    images:Array<any>;
    quality:string;
    idlg : number;
    idlg_loc:Array<number>;
    waypoints:Array<any>;
    routes:Array<any>;
    outings:Array<any>;
    offlineData: boolean;
    btreload:boolean;
    lift_access:boolean;
    ice_rating:string;
    risk_rating:string;
    snowshoe_rating:string;

    mtb_down_rating:string;
    mtb_height_diff_portages:string;
    mtb_length_asphalt:string
    mtb_length_trail:string;
    mtb_up_rating:string;
    equipment_rating:string;
    firstloading: boolean;
    showcotdetail: boolean;
    cotbutton:string;

    imgtmp : string;
    orientations: {N:boolean,NE:boolean,E:boolean,SE:boolean,S:boolean,SW:boolean,W:boolean,NW:boolean};

    latitude: number;
    longitude: number;


    constructor(public platform: Platform, private ga: GoogleAnalytics,public GlobalService:GlobalService,public navCtrl: NavController,private navParams: NavParams,private Datafeeder : Datafeeder, public http:Http,public storage: Storage,elementRef: ElementRef,public renderer: Renderer2,public events: Events,private alertCtrl: AlertController) {

        this.loader = true;
        this.topos = "list";
        this.id= navParams.get('id');
        this.orientations = {N:false,NE:false,E:false,SE:false,S:false,SW:false,W:false,NW:false};
        this.images= Array();
        this.firstloading = true;
        this.idlg = 0;
        this.loader = true;
        this.idlg_loc = Array();
        this.waypoints = Array();
        this.routes = Array();
        this.outings = Array();
        this.offlineData = false;
        this.btreload = false;
        this.description = "";
        this.showcotdetail = false;
        this.cotbutton = "Détails de la cotation";

        renderer.listen(elementRef.nativeElement, 'click', (event) => {
            if(event.path[0].className == "dlink")
            {

                this.gotoPage(event.path[0].attributes['data-type'].value,event.path[0].attributes['data-id'].value);


            }
        })

        this.platform.ready().then(() => {
            this.ga.trackView("Page route","#topos_page",true);
        });

    }


    ionViewDidEnter(){
        if(this.firstloading)
        {
            this.firstloading = false;
            this.loadRoute();

        }
    }

    gotoRoute(id:string)
    {
        this.navCtrl.push(Topos_page,{id:id}); 
    }

    gotoWaypoint(id:string)
    {
        this.navCtrl.push(Proximity_page,{id:id}); 
    }

    gotoOuting(id:string)
    {
        this.navCtrl.push(Outing,{id:id}); 
    }

    gotoPage(type:string,id:string)
    {
        this.events.publish('goto:Page', {type:type,id:id});
    }

    gotoSlide() {
        this.navCtrl.push(Topos_slides,{images:this.images}); 
    }
    toggleDetailCot() {
        this.showcotdetail = !this.showcotdetail;
        if(this.showcotdetail)
            this.cotbutton = "Cacher les détails";
        else
            this.cotbutton = "Détails de la cotation";
    }
    saveOffline()
    {
        this.storage.get('topos_list').then((val) => { 
            if(val == null)
                val = Array();

            if(val.indexOf(this.id) > -1 )
                return false;
            val.push(this.id); 

            this.storage.set('topos_list', val); 

        });


        this.storage.set('topos-'+this.id, this.data);

        for(var i =0;i<this.waypoints.length;i++)
        {   
            this.Datafeeder.requestapi("waypoint_offline",{id:this.waypoints[i].document_id,view:this});
        }

        this.offlineData = true;
    }
    saveWaypoint(data) 
    {
        this.storage.get('waypoints_list').then((val) => { 

            if(val == null)
                val = Array();

            if(val.indexOf(data.document_id) > -1 )
                return false;

            val.push(data.document_id); 

            this.storage.set('waypoints_list', val);                   
        });
        this.storage.set('waypoint-'+data.document_id, data);
    }
    rmOffline()
    {
        let alert = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Ne plus rendre cet itinéraire consultable hors ligne ?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {

                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        setTimeout(() => { 

                            this.offlineData = false;
                            this.storage.remove('topos-'+this.id);
                            this.storage.get('topos_list').then((val) => { 

                                if(val.length == 0 )
                                    return false;

                                val.splice(val.indexOf(this.id), 1);
                                this.storage.set('topos_list', val);   


                            });

                            for(var i =0;i<this.waypoints.length;i++)
                            {   
                                this.storage.remove('waypoint-'+this.waypoints[i].document_id);
                                this.storage.get('waypoints_list').then((val) => { 

                                    if(val.length == 0 )
                                        return false;

                                    val.splice(val.indexOf(this.id), 1);
                                    this.storage.set('waypoints_list', val);   


                                });
                            }

                        } , 300);
                    }
                }
            ]
        });
        alert.present()



    }
    errorRoute(err:any)
    {

        this.btreload = true;
        this.loader = false;
    }
    reloadRoute()
    {
        this.loader = true;
        this.btreload = false;
        this.loadRoute();
    }
    loadRoute()
    {

        this.storage.get('topos-'+this.id).then((val) => { 


            if(val != null)
            {
                this.setRoute(val);

                this.offlineData = true;
            }


        });
        this.Datafeeder.requestapi("route",{id:this.id,view:this});
    }
    setRoute(data)
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


        this.configuration = data.configuration;
        this.elevation_min = this.GlobalService.unit(data.elevation_min);
        this.elevation_max = this.GlobalService.unit(data.elevation_max);

        if(data.route_length != null) {
            if(data.route_length != 0)
                this.route_length = this.GlobalService.unitK(data.route_length);
            else
                this.route_length = data.route_length;
        }
        this.title = data.locales[this.idlg].title;
        this.title_prefix = data.locales[this.idlg].title_prefix;
        if(data.locales[this.idlg].description != null)
            this.description = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].description);

        if(data.locales[this.idlg].external_resources != null)
            this.external_resources= this.GlobalService.c2cTagToHtml(data.locales[this.idlg].external_resources);
        if(data.locales[this.idlg].summary != null)
            this.summary = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].summary);

        this.durations = data.durations;

        this.activities = data.activities;
        this.areas = data.areas;
        if(data.locales[this.idlg].remarks != null)
            this.remarks = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].remarks);
        if(data.locales[this.idlg].slope != null)
            this.slope = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].slope);
        if(data.locales[this.idlg].gear != null)
            this.gear = this.GlobalService.c2cTagToHtml(data.locales[this.idlg].gear);

        if(data.maps != null)
            this.maps = data.maps;
        else
            this.maps = Array();
        this.height_diff_difficulties = this.GlobalService.unit(data.height_diff_difficulties);
        this.height_diff_access = this.GlobalService.unit(data.height_diff_access);
        this.height_diff_down = this.GlobalService.unit(data.height_diff_down);
        this.height_diff_up = this.GlobalService.unit(data.height_diff_up);
        this.labande_ski_rating = data.labande_ski_rating;
        this.labande_global_rating = data.labande_global_rating;
        this.ski_exposition = data.ski_exposition;
        this.hiking_rating = data.hiking_rating;
        this.hiking_mtb_exposition = data.hiking_mtb_exposition;
        this.geometry = data.geometry;
        this.route_types = data.route_types;
        this.engagement_rating = data.engagement_rating;
        this.aid_rating = data.aid_rating;
        this.mixed_rating = data.mixed_rating;
        this.via_ferrata_rating = data.via_ferrata_rating;
        this.difficulties_height = this.GlobalService.unit(data.difficulties_height);
        this.lift_access = data.lift_access;
        this.equipment_rating = data.equipment_rating;
        this.ski_rating = data.ski_rating;
        this.mtb_down_rating = data.mtb_down_rating;
        this.mtb_height_diff_portages = this.GlobalService.unitK(data.mtb_height_diff_portages);
        this.mtb_length_asphalt = this.GlobalService.unitK(data.mtb_length_asphalt);
        this.mtb_length_trail = this.GlobalService.unitK(data.mtb_length_trail);
        this.mtb_up_rating = data.mtb_up_rating;
        this.ice_rating = data.ice_rating;
        this.risk_rating = data.risk_rating;
        this.snowshoe_rating = data.snowshoe_rating;

        this.images = data.associations.images;

        if(this.images != null)
        {
            if(this.images.length > 0)
                this.onload();
        }
        this.climbing_outdoor_type = data.climbing_outdoor_type;
        this.rock_required_rating = data.rock_required_rating;
        this.rock_types = data.rock_types;
        this.exposition_rock_rating = data.exposition_rock_rating;
        this.quality = data.quality;
        this.rock_free_rating = data.rock_free_rating;
        this.glacier_gear = data.glacier_gear;
        this.global_rating = data.global_rating;

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

        this.waypoints = data.associations.waypoints;
        this.routes = data.associations.routes;
        this.outings = data.associations.recent_outings.documents;

        var geoc = JSON.parse(this.geometry.geom);
        var cn = this.GlobalService.meters2degress(geoc.coordinates[0],geoc.coordinates[1]);
        this.latitude = cn[1];
        this.longitude = cn[0];


        if(this.offlineData)
        {
            this.saveOffline()
        }

        if(this.loader)
            this.loader = false;
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
    dateToStr(q:string) {
        let tab = q.split("-");
        return tab[2]+"/"+tab[1]+"/"+tab[0];
    }
    rock_typestostr(q:string)
    {
        switch(q)
                {
            case "artificial":
                return "Artificiel";
            case "mollasse_calcaire":
                return "Molasse";
            default:
                return q.charAt(0).toUpperCase() + q.slice(1);
        }
    }
    routetypestostr(q:string)
    {
        switch(q)
                {
            case "return_same_way":
                return "Aller-retour";

            case "loop":
                return "Boucle";

            case "loop_hut":
                return "Boucle (refuge)";

            case "traverse":
                return "Traversée";
            case "raid":
                return "Raid";
            case "expedition":
                return "Expédition";

        }
    }
    configurationtostr(q:string)
    {
        switch(q)
                {
            case "edge":
                return "Arête";

            case "pillar":
                return "Pilier";

            case "face":
                return "Face";

            case "corridor":
                return "Couloir";

            case "goulotte":
                return "Goulotte";

            case "glacier":
                return "Glacier";
        }
    }

    glacier_geartostr(q:string)
    {


        switch(q)
                {
            case "no":
                return "Non";

            case "crampons_spring":
                return "Crampons en début de saison";

            case "crampons_req":
                return "Crampons indispensable";

            case "glacier_crampons":
                return "Crampons + matériel de sécurité sur glacier";


        }
    }

    typetostr(q:string)
    {
        return this.GlobalService.typeWaypointToStr(q);
    }

    climbing_outdoor_typetostr(q:string)
    {
        switch(q)
                {
            case "single":
                return "Couenne";

            case "multi":
                return "Grande voie";

            case "bloc":
                return "Bloc";

            case "psicobloc":
                return "Psicobloc";
        }
    }

    /*
activitietostr(q:string)
{

    switch(q)
            {
        case "skitouring":
            return "Ski, surf ";

        case "snow_ice_mixed":
            return "Neige, glace et mixte ";

        case "mountain_climbing":
            return "Rocher haute montagne ";

        case "rock_climbing":
            return "Escalade ";

        case "ice_climbing":
            return "Cascade de glace ";

        case "hiking":
            return "Randonnée / Trail ";

        case "snowshoeing":
            return "Raquette ";

        case "paragliding":
            return "Parapente ";

        case "mountain_biking ":
            return "Vtt";

        case "via_ferrata":
            return "Via ferrata ";


        default:
            return "inconnu ";
    }
}
*/
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

        var route = Object();
        route.list = Array();
        if(this.geometry.geom_detail != null)
        {
            var details = JSON.parse(this.geometry.geom_detail);

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
                that.navCtrl.push(Proximity_page,{id: e});
            }


        },function(){});

    }

    cotationToDesc(type:string,cotation:string)
    {
        if(type == "labande_ski_rating")
        {
            switch(cotation)
                    {
                case "S1":
                    return "Itinéraire facile ne nécessitant pas de technique particulière pour évoluer en sécurité, route forestière par exemple.";

                case "S2":
                    return "Pentes assez vastes, même un peu raides (25°), ou itinéraires vallonnés.";

                case "S3":
                    return "Inclinaison des pentes jusqu'à 35° (pistes noires les plus raides des stations, en neige dure). L'évolution en toutes sortes de neige doit se pratiquer sans difficultés techniques.";

                case "S4":
                    return "Inclinaison des pentes jusqu'à 45° si l'exposition n'est pas trop forte; a partir de 30° et jusqu'à 40° si l'exposition est forte ou le passage étroit. Une très bonne technique à ski devient indispensable.";

                case "S5":
                    return "Inclinaison de 45 à 50° voire plus si l'exposition est faible. A partir de 40° si l'exposition est forte. En plus d'une technique parfaite, la maîtrise nerveuse devient importante.";

                case "S6":
                    return "Au delà de 50° si l'exposition est forte, ce qui est le plus souvent le cas. Sinon à partir de 55° pour de courts passages peu exposés.";

                case "S7":
                    return "Passages à 60° ou plus, ou saut de barres en terrain très raide ou exposé.";

            }
        }
        else if(type == "labande_global_rating")
        {

            switch(cotation)
                    {
                case "F":
                case "F+":
                    return "Une course facile.";

                case "PD-":
                case "PD":
                case "PD+":
                    return "Une course peu difficile";

                case "AD-":
                case "AD":
                case "AD+":
                    return "Une course assez difficile.";

                case "D-":
                case "D":
                case "D+":
                    return "C’est une entreprise déjà sérieuse.";

                case "TD-":
                case "TD":
                case "TD+":
                    return "Les courses TD sont des entreprises très sérieuses avec des difficultés importantes.";

                case "ED-":
                case "ED":
                case "ED+":
                case "ED4":
                case "ED5":
                case "ED6":
                case "ED7":
                    return "Les courses extrêmement difficiles (ED) sont des itinéraires de grande difficulté, généralement assez engagés.";
            }
        }
        else if(type == "ski_rating")
        {
            switch(cotation)
                    {
                case "1.1":
                case "1.2":
                case "1.3":
                    return "Niveau initiation. Les pentes n’excèdent pas 30°. Les passages ne sont pas trop étroits. Le dénivelé est inférieur à 800m.";

                case "2.1":
                case "2.2":
                case "2.3":
                    return "Peu de difficultés techniques. Les pentes n’excèdent pas 35°.";

                case "3.1":
                case "3.2":
                case "3.3":
                    return "Présence de passages techniques. Pentes longues à 35°, quelques passages très courts jusqu’à 40-45°.";

                case "4.1":
                case "4.2":
                case "4.3":
                    return "Ski de couloir ou pente raide : Pentes à 40 ou 45° sur plus de 200m .";

                case "5.1":
                case "5.2":
                case "5.3":
                case "5.4":
                case "5.5":
                case "5.6":
                    return "Pente à 45°/50° sur plus de 300m ou de plus de 50° sur 100m.";

            }
        }
        else if(type == "ski_exposition")
        {
            switch(cotation)
                    {
                case "E1":
                    return "L’exposition est celle de la pente elle-même. Le risque de blessure est cependant important sur neige dure et/ou pente forte."

                case "E2":
                    return "A l'exposition de la pente s'ajoute des obstacles aggravant les blessures.";

                case "E3":
                    return "En cas de chute, la mort est probable.";

                case "E4":
                    return "En cas de chute, la mort est certaine.";
            }
        }
        else if(type == "snowshoe_rating")
        {
            switch(cotation)
                    {
                case "R1":
                    return "# Pentes faibles et balisage serré\n \
\
Itinéraire souvent tracé et bénéficiant d'un balisage spécifique rapproché. Terrain plat ou faible pente (maximum vers 20°), pas de risques de chute. \
Exigences : Aucune, convient pour les raquettes non-techniques.";

                case "R2":
                    return "# Pentes faibles et pas de balisage\n \
\n\
Itinéraire sur pentes faibles (maximum vers 20°) ne nécessitant pas de progresser en lacets ni de faire de traversée sur flancs raides.\n\n \
Exigences : avoir le pied assez sûr. Convient pour les raquettes non-techniques. Bonnes capacités d'orientation.";

                case "R3":
                case "R4":
                    return "# Pentes modérées à fortes\n \
\n\
Itinéraire sur pentes exigeantes nécessitant de progresser en lacets ou de traverser des flancs raides. Certains passages peuvent nécessiter de déchausser ou d'utiliser des couteaux en neige dure. \n\
Exigences : avoir le pied sûr. Raquettes techniques nécessaires. Bonnes capacités d'orientation. Bonne expérience de la montagne.";

                case "R5":
                    return "# Pentes très fortes ou alpines\n\
\n\
Itinéraire sur pentes très fortes (passages à plus de 40° ou longues pentes au delà d'environs 35°), exposées aux chutes et aux plaques de glace fréquentes ou nécessitant l'utilisation de crampons, piolet ou corde pour franchir des difficultés tels qu'un couloir, une arête effilée et très exposée, une barre rocheuse à franchir…";
            }
        }
        else if(type == "global_rating")
        {
            switch(cotation)
                    {
                case "F":
                case "F+":
                    return "Dans une course facile, l’alpiniste marche avec aisance. L’itinéraire est évident, par exemple la remontée d’un glacier peu pentu et peu crevassé suivie d’un éboulis ou d’une courte arête de blocs facile (difficultés en rocher < 3). En général, l’usage de la corde ne s’impose que pour la sécurité sur glacier.";

                case "PD-":
                case "PD":
                case "PD+":
                    return "Une course peu difficile est un itinéraire plus difficile qu’un itinéraire F, avec par exemple un glacier plus complexe à négocier (quelques crevasses) ou de l’escalade un peu plus difficile (dès le 3 en rocher mais sans passages de 4 qui ne soient pas facilement contournables), mais clairement disposée et facile à protéger, ou des pentes de neige et glace modérées entre 35 et 45°, dont les passages les plus raides sont courts. Des rappels peuvent être nécessaires à la descente.";

                case "AD-":
                case "AD":
                case "AD+":
                    return "Une course assez difficile est un itinéraire plus difficile qu’un itinéraire PD et qui nécessite souvent de tirer des longueurs à plusieurs reprises. La cordée devra par exemple négocier un glacier crevassé (mais une rimaye de petite taille), des difficultés en rocher dans le 4 ou des pentes de neige et glace plus soutenues, jusqu’à 40-55° (en glace, maximum grade 3+). La sécurité de la cordée requière l’emploi d’une grande variété de techniques. ";

                case "D-":
                case "D":
                case "D+":
                    return "Une course difficile est plus difficile qu’un itinéraire AD. C’est une entreprise déjà sérieuse où une bonne maîtrise de l’assurage et un bon sens de l’itinéraire sont nécessaires. La cordée devra tirer des longueurs successives pour négocier de longues sections d’escalade (dès qu’il y a des passages obligatoires de 5 ou s’il y a des difficultés soutenues dans le 4-5), des pentes de neige ou de glace raides (50-70°, en glace grade 4+ maximum) ou des glaciers très crevassés aux rimayes importantes. L’obligation de franchir certaines difficultés en artif., en plaçant ses points (A1), fera de l’itinéraire du TD.";

                case "TD-":
                case "TD":
                case "TD+":
                    return "Une course TD est plus difficile qu’un itinéraire D. Les courses TD sont des entreprises très sérieuses avec des difficultés importantes en rocher (dès qu’il y a des passages obligatoires dans le 6 ou de longues sections soutenues dans le 5) ou de longues pentes de neige ou glace raides et soutenues (entre 65 et 80°, en glace grade 5+ maximum) qui nécessitent en général de tirer un grand nombre de longueurs. Les risques objectifs peuvent être importants à ce niveau de difficulté. ";

                case "ED-":
                case "ED":
                case "ED+":
                case "ED4":
                case "ED5":
                case "ED6":
                case "ED7":
                    return "Les courses extrêmement difficiles (ED) sont des itinéraires de grande difficulté, généralement assez engagés, avec de l’escalade soutenue dans le 6 (ou de longues sections d’escalade artificielle délicate) ou de longs passages de glace raide ou verticale.";

            }
        }
        else if(type == "engagement_rating")
        {
            switch(cotation)
                    {
                case "I":
                    return "L'itinéraire est court et s'effectue rapidement. Comme il est proche de la vallée, du refuge ou d'une remontée mécanique, les secours sont vite alertés et peuvent intervenir quel que soit le temps. Il est possible de faire demi-tour à tout moment. Par convention, les grandes voies sportives de basse altitude et les cascades de glace bien équipées ont un engagement de I.";

                case "II":
                    return "L'itinéraire est plus long (4h environ) et se déroule donc un peu plus loin de la vallée, du refuge ou d'une remontée mécanique. Néanmoins, il est possible de faire demi-tour à tout instant. Les secours peuvent être avertis assez rapidement.";

                case "III":
                    return "L'itinéraire s'étale sur plus d'une demi-journée et ne se déroule plus aux abords directs de la vallée, d'un refuge ou d'une remontée mécanique. Il n'est plus forcement visible depuis la civilisation. La retraite est possible mais commence à être délicate. En cas de mauvais temps, les secours peuvent connaître de grosses difficultés pour apporter leur aide aux alpinistes.";

                case "IV":
                    return "L'itinéraire s'étale sur une journée complète. Il n'est pas accessible directement depuis une vallée, un refuge ou une remontée mécanique. Le parcours est long et n'est en général pas visible depuis la civilisation. La retraite est délicate. Un point de non retour peut être rencontré. En cas de mauvais temps, l'itinéraire peut s'avérer très dangereux et les secours ne peuvent intervenir.";

                case "V":
                    return "L'itinéraire est très long et demande entre 12 et 24h d'effort. L'accès est difficile. La retraite est délicate dès l'attaque de la voie. Rapidement il n'est plus possible de faire demi-tour. Les échappatoires sont rares et délicats. En cas de mauvais temps ou de problème, les alpinistes doivent compter sur eux-même.";

                case "VI":
                    return "L'itinéraire est long et peut demander plusieurs jours. L'approche est aussi longue et délicate. L'itinéraire est totalement isolé. Une fois engagé, il n'est plus possible de faire demi-tour. Les échappatoires sont des courses en soi. Une totale autonomie de la cordée est requise dans la difficulté.";
            }
        }
        else if(type == "equipment_rating")
        {
            switch(cotation)
                    {
                case "P1":
                case "P1+":
                    return "# Bien équipé\n\
\n\
Itinéraires totalement équipés ne nécessitant pas de pose de protection.";

                case "P2":
                case "P2+":
                    return "# Partiellement équipé\n\
\n\
Itinéraires nécessitant de poser des protections avec quelque points en places de bonnes qualités (dans les longueurs ou au relais). ";

                case "P3":
                case "P3+":
                    return "# Peu équipé \n\
\n\
Itinéraires nécessitant de protéger avec quelques points en places de qualités variable/mauvais.";

                case "P4":
                case "P4+":
                    return "# Pas équipé\n\
\n\
Itinéraires totalement non équipés nécessitant de poser toutes les protections y compris au relais et à la descente.";

            }
        }
        else if(type == "ice_rating")
        {
            switch(cotation)
                    {
                case "1":
                    return "Pas de description";

                case "2":
                    return "Pas de description";

                case "3":
                    return "Escalade peu inclinée (75°) avec de nombreux ressauts. La glace est bien fournie et compacte.";

                case "3+":
                    return "Escalade peu inclinée (75°) avec de nombreux ressauts mais présentant un ressaut plus raide (80°). La glace est bien fournie et compacte.";

                case "4":
                    return "Escalade présentant un passage raide (85°) pouvant aller jusqu’à 10 m de hauteur. La glace est bien fournie et compacte.";

                case "4+":
                    return "Escalade présentant un passage raide (85°) pouvant aller jusqu’à 10 m de hauteur. La glace est bien fournie et compacte. Le passage raide peut être quasi vertical et plus long, pour atteindre 15 m de hauteur.";

                case "5":
                    return "Escalade présentant une section verticale d’environ 20m. La glace commence à s’aérer et à prendre des formes particulières : choux-fleurs ou autres aspérités. En cascade de glace, il s’agit en général de cigares.";

                case "5+":
                    return "Escalade présentant une section verticale d’environ 30m. L’escalade devient assez technique.";

                case "6":
                    return "Escalade présentant une section verticale de presque 40 à 50m. L’escalade est technique. La glace peut devenir particulièrement aérée.";

                case "6+":
                    return "Escalade totalement verticale et pouvant présenter des petits surplombs, par exemple pour passer d’un rideau à un autre.";

                case "7":
                    return "Escalade extrême. Très raide, elle peut être surplombante sur plusieurs mètres. La technique (gestuelle, notamment) utilisée par l’alpiniste s’apparente alors à celle d’un grimpeur en rocher.";
            }
        }
        else if(type == "mixed_rating")
        {
            switch(cotation)
                    {
                case "M1":
                case "M2":
                case "M3":
                case "M3+":
                    return "Facile, peu pentu. L'utilisation de piolet(s) n'est pas obligatoire";

                case "M4":
                case "M4+":
                    return "Le grimpeur se tient verticalement et peut avoir recours aux techniques du dry-tooling.";

                case "M5":
                case "M5+":
                    return "Quelques sections verticales.";

                case "M6":
                case "M6+":
                    return "Vertical à légèrement déversant";

                case "M7":
                case "M7+":
                    return "Déversant. Dry-tooling difficile. Moins de 10m d'escalade difficile.";

                default:
                    return "Généralement, le mixte au delà de M6/M7 n'est pas rencontré en montagne et il est donc spécifique au dry-tooling.";

            }
        }
        else if(type == "risk_rating")
        {
            switch(cotation)
                    {
                case "X1":
                    return "# Cascade de glace\n\
Cascade courte protégée des avalanches (pas de pente au dessus et dans l'approche) et des chutes naturelles de stalactite. \n\
En règle générale, la fragilité de de la structure ainsi que la présence de stalactite sont quasiment toujours des risques à prendre en compte dans les cascades d'un niveau technique supérieure ou égale à 5. En conséquence, le risque objectif faible X1 ne concernera généralement pas ces cascades. \n\
# Alpinisme neige, glace, mixte \n\
Parcours de crête/arête ou sous des pente faibles (< 35° si c'est un éboulis, au delà il n'est pas stabilisé, et une petite avalanche de pierre déclenchée par la pluie est possible).";

                case "X2":
                    return "# Cascade de glace\n\
Cascade plus longue. Cascade protégée en grande partie des avalanches (pas de pente au dessus et dans l'approche). Mais la longueur de la cascade peut permettre des départ dans la cascade elle même. Les risques de chutes naturelles de stalactite sont modérés.\n\
# Alpinisme neige, glace, mixte\n\n\
L'itinéraire passe dans ou sous des pentes étant sujettes aux chutes de pierres (éboulis > 35°), ou loin sous des séracs peu menaçants. Les itinéraires dont les difficultés sont un couloir sont au moins X2. Idem pour les itinéraires passant par un couloir un peu raide sur l'approche ou la descente.";

                case "X3":
                    return "# Cascade de glace\n\
Cascades exposées à des pentes de neige. L'avalanche naturelle sera canalisée sur l'itinéraire. Ces cascades ont souvent, mais pas toujours, un gros culots d'avalanche au pied.\n\n\
# Alpinisme neige, glace, mixte\n\
L'itinéraire passe près d'un sérac menaçant. Il traverse un dépôt de blocs de glace toujours assez fraichement tombé. L'exposition est relativement courte en temps normal mais les mauvaises conditions (terrain et météo) peuvent augmenter notablement le temps d'expositions. \
Idem pour les zones où il y a des chutes de pierres tous les jours ou presque en été. \
Un couloir comportant un sérac même peu menaçant, ou comportant un grand bassin ou de nombreux affluents (entrainant des contrepentes d'orientation très variée), sera coté au moins X3.";

                case "X4":
                    return "# Cascade de glace\n\
Cascades présentant une structure fragile.\n\n\
# Alpinisme neige, glace, mixte\n\
L'itinéraire demande de rester assez longtemps sous un sérac menaçant. \n\
Chute de glace ou de rocher plus fréquentes ou avec plus de volume que pour X3.";

                case "X5":
                    return "# Cascade de glace\n\
Cascades présentant une structure  très  fragile. \n\n\
# Alpinisme neige, glace, mixte\n\
L'itinéraire demande de rester assez longtemps sous un sérac menaçant. \n\
Chute de glace ou de rocher plus fréquentes ou avec plus de volume que pour X4.";
            }
        }
        else if(type == "via_ferrata_rating")
        {
            switch(cotation)
                    {
                case "K1":
                    return "Pas de description";

                case "K2":
                    return "Pas de description";

                case "K3":
                    return "Pas de description";

                case "K4":
                    return "Pas de description";

                case "K5":
                    return "Pas de description";

                case "K6":
                    return "Pas de description";
            }
        }

        else if(type == "hiking_rating")
        {
            switch(cotation)
                    {
                case "T1":
                    return "# Randonnée\n\
Sentier bien tracé. Terrain plat ou en faible pente, pas de risques de chute. \n\
Exigences : Aucune, convient aussi pour baskets. L'orientation ne pose pas de problèmes, en général possible même sans carte.";

                case "T2":
                    return "# Randonnée en montagne\
Sentier avec tracé ininterrompu. Terrain parfois raide, risques de chute pas exclus. \n\
Exigences : Avoir le pied assez sûr. Chaussures de trekking recommandées. Capacités élémentaires d'orientation.";

                case "T3":
                    return "# Randonnée en montagne exigeante\n\
Sentier pas forcément visible partout. Les passages exposés peuvent être équipés de cordes ou de chaînes. Event. appui des mains nécessaire pour l'équilibre. Quelques passages exposés avec risques de chute, pierriers, pentes mêlées de rochers sans trace.\n\
Exigences : Avoir le pied très sûr. Bonnes chaussures de trekking. Capacités d'orientation dans la moyenne. Expérience élémentaire de la montagne souhaitable.";

                case "T4":
                    return "# Randonnée alpine\n\
Traces parfois manquantes. L'aide des mains est quelquefois nécessaire pour la progression. Terrain déjà assez exposé, pentes herbeuses délicates, pentes mêlées de rochers, névés faciles et passages sur glacier non recouverts de neige.\n\
Exigences : Etre familier du terrain exposé. Chaussures de trekking rigides. Une certaine capacité d'évaluation du terrain et une bonne capacité d'orientation. Expérience alpine. En cas de mauvais temps le repli peut s'avérer difficile. ";

                case "T5":
                    return "# Randonnée alpine exigeante\n\
L'itinéraire est souvent sans traces. Une bonne capacité d'orientation est nécessaire. Terrain exposé, exigeant, pentes raides mêlées de rochers. Quelques passages d'escalade faciles : 2 maximum (ponctuellement jusqu'à 3c si le pas est très court et la chute sans conséquence). Petits Glaciers et névés, non crevassés, pouvant nécessiter l'usage de crampons mais ne nécessitant pas, habituellement, le matériel d'encordement. Le matériel et les techniques d'alpinismes peuvent être employés occasionnellement pour un passage ponctuel mais pas comme un moyen de progression continu.\n\
Exigences : Chaussures de montagne. Évaluation sûre du terrain nécessaire. Bonne expérience de la haute montagne et connaissances élémentaires du maniement du piolet et de la corde. ";

            }
        }
        else if(type == "rock_free_rating" || type == "rock_required_rating")
        {

            switch(cotation)
                    {
                case "2":
                    return "Facile";
                case "3a":
                case "3b":
                case "3c":
                    return "Peu difficile";

                case "4a":
                case "4b":
                case "4c":
                    return "Assez difficile";

                case "5a":
                case "5b":
                case "5c":
                    return "Difficile";

                case "6a":
                case "6b":
                case "6c":
                    return "Tres difficile";

                case "7a":
                case "7b":
                case "7c":
                    return "Extremement difficile";

                default:
                    return "Pas de description";




            }
        }
        else if(type == "aid_rating")
        {

            switch(cotation)
                    {
                case "A0":
                    return "Tous les points sont en place et résistent chacun à la chute du premier de cordée. Le passage se gravit en \"tirant au clou\".";

                case "A0+":
                    return "Tous les points sont en place et résistent chacun à la chute du premier de cordée. Le passage se gravit en utilisant une pédale (sangle ou étrier) pour les pieds afin d'atteindre le point suivant.";

                case "A1":
                case "A1+":
                    return "Le grimpeur équipe lui-même le passage. La quasi-totalité des points résiste à la chute du premier de cordée. Des passages, d'au plus 2 points successifs peuvent se faire sur des points plus délicats, mais non réalisés sur des points de progression (crochet, plomb, …). Le matériel exigé est donc composé de pitons variés, de coins de bois, de coinceurs ou de friends.";

                case "A2":
                case "A2+":
                    return "Le grimpeur équipe entièrement sa longueur. Des points intermédiaires peuvent sécuriser la voie. La plupart des points résistent à la chute du premier de cordée. Certains passages sont plus techniques : couplage, court passage sur crochet, … Les sections délicates correspondent à 5 à 10 points successifs. Dans ce dernier cas la longueur est cotée A2+. La chute potentielle oscille entre 10 et 20m.";

                case "A3":
                    return "Les passages techniques s'allongent et sont entrecoupés de points \"bétons\" (spit ou excellents pitons). Il n'est pas rare d'enchaîner les couplages et les pas sur crochet (bon crochet), voire de placer rurp, bird beak ou autres copper et plombs. La chute potentielle est alors plus importante (autour de 20 à 25m). C'est à ce niveau que le grimpeur commence à tester quasi systématiquement ses points avant de mettre son poids dessus.";

                case "A3+":
                    return "Les passages techniques s'allongent et sont entrecoupés de points \"bétons\" (spit ou excellents pitons). Il n'est pas rare d'enchaîner les couplages et les pas sur crochet (bon crochet), voire de placer rurp, bird beak ou autres copper et plombs. La chute potentielle est alors plus importante (autour de 20 à 30m). C'est à ce niveau que le grimpeur commence à tester quasi systématiquement ses points avant de mettre son poids dessus.";

                case "A4":
                    return "De longues sections techniques attendent le grimpeur. Les points de progression (à opposer aux points d'assurage) s'enchaînent pour atteindre 10m (10 à 20 mouvements successifs). Des points solides entrecoupent ces sections délicates. Le matériel s'étoffe et laisse place aux plombs, copper, micro-pitons, coins de bois, cales de bois, crochets de toutes sortes, … Une longueur peut alors demander de nombreuses heures : 4 à 6h. La chute potentielle peut atteindre les 50m. Mieux vaut être en pleine forme physique et morale !";

                case "A4+":
                    return "De longues sections techniques attendent le grimpeur. Les points de progression (à opposer aux points d'assurage) s'enchaînent pour atteindre 10m (10 à 20 mouvements successifs). Des points solides entrecoupent ces sections délicates. Le matériel s'étoffe et laisse place aux plombs, copper, micro-pitons, coins de bois, cales de bois, crochets de toutes sortes, … Une longueur peut alors demander de nombreuses heures : 4 à 6h. La chute potentielle peut atteindre les 50m. Mieux vaut être en pleine forme physique et morale ! On trouve au plus, dans la longueur, un ou deux bons points. Une cotation réservée à l'élite. ";

                case "A5":
                    return "On touche à l’extrême. Les points sont tous des points de progression. La chute est interdite pour qui ne veut pas tenter le diable. Le grimpeur passera une journée entière à grimper sa longueur (notamment en calcaire; en granit).";

                case "A5+":
                    return "Aucun point, sauf les relais, ne résiste à la chute du premier de cordée. La chute pouvant atteindre, potentiellement, les 100m !";

                case "A6":
                    return "Aucun point ne résiste plus au poids du grimpeur, pas même les relais. La cordée n'a alors pas le droit de chuter, sous peine de dévisser !";


            }
        }
        else if(type == "exposition_rock_rating")
        {

            switch(cotation)
                    {
                case "E1":
                    return "Surprotégé avec des points à demeure ou des bonnes protections amovibles tous les mètres depuis le sol.";

                case "E2":
                    return "Bien protégé avec des points à demeure ou des bonnes protections amovibles depuis le sol.";

                case "E3":
                    return "La chute va être longue mais sans conséquences physiques. Les points à demeure ou protections amovibles sont espacés.";

                case "E4":
                    return "La chute n'est pas bénigne. Elle entraîne un accident mineur même si les points à demeure ou protections amovibles ne sont pas trop espacés.";

                case "E5":
                    return "La chute est dangereuse. Elle entraînerait un accident grave. E5 correspond a des points à demeure très espacés, des protections amovibles suffisamment mauvaises ou un petit retour au sol/vire.";

                case "E6":
                    return "La chute est dangereuse. Elle entraînerait trés probablement la mort même en étant protégé. E6 correspond a des points à demeure très espacés, des protections amovibles suffisamment mauvaises ou un petit retour au sol/vire.";



            }
        }
        return "";


    }

}