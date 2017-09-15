import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';


@Injectable()

export class GlobalService {

    type_unit:string;
    precision: number;
    frequency: number;
    battery: number;
    distanceFilter:number;
    debugmode:boolean;
    carte:string;
    constructor(public network: Network,public storage: Storage) {
        this.precision = 25;
        this.frequency = 0;
        this.battery = 30;
        this.debugmode = false;
        storage.get('debugmode').then((val) => {
            if(val == null)
                this.debugmode = false;
            else
                this.debugmode = val;
        });

        storage.get('carte').then((val) => {
            if(val == null)
                this.carte = "esri";
            else
                this.carte = val;
        });
        
        storage.get('unit').then((val) => {
            if(val == null || val == "m")
                this.type_unit = "m";
            else if(val == "i")
                this.type_unit = "i";
        });

        storage.get('precision').then((val) => {
            if(val == null)
                this.precision = 25;
            else
                this.precision = val;
        });

        storage.get('frequency').then((val) => {
            if(val == null)
                this.frequency = 0;
            else
                this.frequency = val;
        });

        storage.get('battery').then((val) => {
            if(val == null)
                this.battery = 30;
            else
                this.battery = val;
        });


        storage.get('distanceFilter').then((val) => {
            if(val == null)
                this.distanceFilter = 25;
            else
                this.distanceFilter = val;
        });

    }

    typeWaypointToStr(q:string)
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

    
    getIsOnline()
    {
        /*
        Cette partie ne fonctionne pas tres bien visible, dans le doute on renvoie vrai à tous les coups pour le moment.
         if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g' || this.network.type === 'unknow' || this.network.type === "ethernet") 
         {
             return true;
         }
         else
         {
             return false;
         }
        */
        return true;
    }
    c2cTagCleaner(str:string)
    {
        if(str == null)
            return null;
        var img = /\[img=([0-9]*)\ ([a-z ]*)\](.*?)\[\/img\]/g;
        str = str.replace(img,'');
        var img2 = /\[img=([0-9]*)\ ([a-z_ ]*)\/\]/g;
        str = str.replace(img2,'');
        var b = /\[b\](.*?)\[\/b\]/g;
        str = str.replace(b,'$1');
        var i = /\[i\](.*?)\[\/i\]/g;
        str = str.replace(i,'$1');
        var urlgpx = /\[url=(.*?).gpx\](.*?)\[\/url\]/g;
        str = str.replace(urlgpx,'$2');
        var url = /\[url=(.*?)\](.*?)\[\/url\]/g;
        str = str.replace(url,'$2');
        var waypoint = /\[\[waypoints(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(waypoint,'$3');
        var route = /\[\[routes(\/)+([0-9]*)(.*)\|(.*?)\]\]/g;
        str = str.replace(route,'$4');
        var outing = /\[\[outings(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(outing,'$3');
        var article = /\[articles(\/)+([0-9]*)\/[a-z][a-z]\|([a-z]*)\]/g;
        str = str.replace(article,'$3');
        var toc= /\[toc\]/g;
        str = str.replace(toc,'');
        return str;
    }

    c2cTagToHtml(str:string)
    {
        if(str == null)
            return null;

        var mark = /(#)+([a-zA-Z])/g;
        str = str.replace(mark,'$1 $2');

        var img = /\[img=([0-9]*)\ ([a-z ]*)\](.*?)\[\/img\]/g;
        str = str.replace(img,'<img src="https://api.camptocamp.org/images/proxy/$1?size=MI" imageViewer></img>');
        var img2 = /\[img=([0-9]*)\ ([a-z_ ]*)\/\]/g;
        str = str.replace(img2,'<img src="https://api.camptocamp.org/images/proxy/$1?size=MI" imageViewer></img>');
        var b = /\[b\](.*?)\[\/b\]/g;
        str = str.replace(b,'<b>$1</b>');
        var i = /\[i\](.*?)\[\/i\]/g;
        str = str.replace(i,'<i>$1</i>');
        var urlgpx = /\[url=(.*?).gpx\](.*?)\[\/url\]/g;
        str = str.replace(urlgpx,'$2');
        var url = /\[url=(.*?)\](.*?)\[\/url\]/g;
        str = str.replace(url,'<a href="$1">$2</a>');

        var waypoint = /\[\[waypoints(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(waypoint,'<span data-type="w" data-id="$2" class="dlink">$3</span>');
        var route = /\[\[routes(\/)+([0-9]*)(.*)\|(.*?)\]\]/g;
        str = str.replace(route,'<span data-type="r" data-id="$2" class="dlink">$4</span>');
        var outing = /\[\[outings(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(outing,'<span data-type="o" data-id="$2" class="dlink">$3</span>');
        var article = /\[articles(\/)+([0-9]*)\/[a-z][a-z]\|([a-z]*)\]/g;
        str = str.replace(article,'<span data-type="a" data-id="$2" class="dlink">$3</span>');
        var article2 = /\[\[(.*?)\/articles\/([0-9]*)\/(.*?)\|(.*?)\]\]/g;
        str = str.replace(article2,'<span data-type="a" data-id="$2" class="dlink">$4</span>');
        var warning = /\[warning\](.*?)\[\/warning\]/g;
        str = str.replace(warning,'<div class="warning">$1</div>');
        var toc= /\[toc\]/g;
        str = str.replace(toc,'<br />');
        return str;
    }

    refreshOption() {
        this.storage.get('unit').then((val) => {

            if(val == null || val == "m")
                this.type_unit = "m";
            else if(val == "i")
                this.type_unit = "i";
        });

        this.storage.get('carte').then((val) => {
            if(val == null)
                this.carte = "esri";
            else
                this.carte = val;
        });
        
        this.storage.get('debugmode').then((val) => {
            if(val == null)
                this.debugmode = false;
            else
                this.debugmode = true;
        });
        
        this.storage.get('distanceFilter').then((val) => {
            if(val == null)
                this.distanceFilter = 25;
            else
                this.distanceFilter = val;
        });
        this.storage.get('precision').then((val) => {
            if(val == null)
                this.precision = 25;
            else
                this.precision = val;
        });

        this.storage.get('frequency').then((val) => {
            if(val == null)
                this.frequency = 0;
            else
                this.frequency = val;
        });

        this.storage.get('battery').then((val) => {
            if(val == null)
                this.battery = 10;
            else
                this.battery = val;
        });
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    unitNB(num:any)
    {
        if(num == null)
            return null;

        if(this.type_unit == "i")
        {

            return  (num*0.00062137119223733).toFixed(2);
        }
        else
            return num ;
    }
    unit(num:string)
    {
        if(num == null)
            return null;

        if(this.type_unit == "i")
        {

            return  (parseInt(num)*0.00062137119223733).toFixed(2) + " mi";
        }
        else
            return num + " m";
    }
    unitK(num:string)
    {
        if(num == null)
            return null;

        if(this.type_unit == "i")
        {

            return  (parseInt(num)*0.00062137119223733).toFixed(2) + " mi";
        }
        else
            return (parseInt(num)/1000).toFixed(2) + " km";
    }
    degrees2meters(lon,lat) {

        var x = lon * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        return [x, y]

    }

    meters2degress(x,y) {
        var lon = x *  180 / 20037508.34 ;
        var lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
        return [lon, lat]
    }

    toRad(n) {
        return n * Math.PI / 180;
    };
    toDeg(n) {
        return n * 180 / Math.PI;
    };



    getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
        var R = 6371000; // Radius of the earth in m
        var dLat = this.toRad(lat2-lat1);  // deg2rad below
        var dLon = this.toRad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
    computeDestinationPoint(latitude,longitude, distance, bearing) {

        var lat = latitude;
        var lng = longitude;

        var radius = 6378137;

        var δ = distance / radius; // angular distance in radians
        var θ = this.toRad(bearing);

        var φ1 = this.toRad(lat);
        var λ1 = this.toRad(lng);

        var φ2 = Math.asin( Math.sin(φ1)*Math.cos(δ) +
                           Math.cos(φ1)*Math.sin(δ)*Math.cos(θ) );
        var λ2 = λ1 + Math.atan2(Math.sin(θ)*Math.sin(δ)*Math.cos(φ1),
                                 Math.cos(δ)-Math.sin(φ1)*Math.sin(φ2));
        λ2 = (λ2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

        return Array(this.toDeg(φ2),this.toDeg(λ2))

    }

    gpsSG(p1,p2,p3,p4,p5)
    {
        var lon = ( p1.lon + p2.lon + p3.lon + p4.lon + p5.lon ) / 5;
        var lat = ( p1.lat + p2.lat + p3.lat + p4.lat + p5.lat ) / 5;

        return {lat:lat,lon:lon};
    }
    makeBoudingBox(lat,lon)
    {


        let coord1 = this.computeDestinationPoint(lat,lon, 5000, 45);
        let coord2 = this.computeDestinationPoint(lat,lon, 5000, 225);


        let deg1 = this.degrees2meters(coord1[1],coord1[0]);
        let deg2 = this.degrees2meters(coord2[1],coord2[0]);



        return Math.round(deg2[0])+"%2C"+Math.round(deg2[1])+"%2C"+Math.round(deg1[0])+"%2C"+Math.round(deg1[1]);
    }

}