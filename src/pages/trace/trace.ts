import { Component , NgZone} from '@angular/core';
import { Addwaypoint } from './add_waypoint';
import { Waypoints } from './waypoints';
import { ModalTopos } from './modal_topos';
import { Addouting } from './add_outing';
import { Addroute } from './add_route';
import {NavController, FabContainer,  AlertController,ModalController, ViewController, Platform} from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { GlobalService } from '../../app/app.global.service';
import { Proximity_page} from '../proximity_page/proximity_page';
import { Topos_page } from '../topos_page/topos_page';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { Picture } from '../picture/picture';
import {Camera} from 'ionic-native';
import { cameraExif } from '../../../plugins/cordova-plugin-camera-with-exif/www/Camera.js'
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var nativemap: any;
declare var navigator : any; 

@Component({
    selector: 'page-trace',
    templateUrl: 'trace.html',
    providers: [BackgroundGeolocation,Toast,LocationAccuracy]
})
export class Trace {
    topos:string;
    btstop:boolean;
    btplay:boolean;
    btpause:boolean;
    nbwaypoint:number;
    alt_prec: number;
    alt_min: number;
    alt_max: number;
    distance:number;
    denivele_pos:number;
    denivele_neg:number;
    elevation:number;
    chrono:string;
    orientation:number;
    precision:number;
    iconfab:string;
    lat: number;
    lon: number;
    activity:string;
    picturetoul:Array<string>;
    traceGps: Array<{lat:number,lon:number,accuracy:number,altitude:number,time:number}>;
    traceGpsSG: Array<any>;
    startUT: number;
    stockUT: number;
    interval:any;
    inmesure:boolean;
    bypassexit:boolean;
    bgc:string;
    debug:number;
    waypoints:Array<any>;
    geom_detail: string;
    id:string;
    modalopened:boolean;
    route:any;
    showAlertMessage:boolean;
    waypoints_id : Array<number>;
    isLoaded : boolean;

    constructor(public platform: Platform, private ga: GoogleAnalytics,public modalCtrl: ModalController,private toast: Toast,public GlobalService:GlobalService,public navCtrl: NavController,private alertCtrl: AlertController,private backgroundGeolocation: BackgroundGeolocation,private zone:NgZone, public storage: Storage,private locationAccuracy: LocationAccuracy,public viewCtrl:ViewController) {

        this.lat = null;
        this.lon = null;
        this.btstop = false;
        this.btplay = true;
        this.btpause = false;
        this.inmesure = false;
        this.bypassexit = false;
        this.nbwaypoint = 0;
        this.alt_max = 0;
        this.alt_min = 10000;
        this.denivele_pos = 0;
        this.denivele_neg = 0;
        this.distance = 0;
        this.elevation = 0;
        this.precision = 0;
        this.orientation = -1;
        this.chrono = "00:00:00";
        this.modalopened = false;
        this.iconfab = "glyphicon glyphicon-cog";
        this.picturetoul = Array();
        this.traceGps = Array();
        this.traceGpsSG = Array();
        this.bgc = "assets/img/f/f4.png";
        this.showAlertMessage = true;
        this.isLoaded = false;
        setTimeout(() => {

            this.loadState();
        }, 1000);
        this.debug = 0;
        
        this.platform.ready().then(() => {
             this.ga.trackView("Page trace","#trace",true);
         });
        
    }

    showMenuItem= false;
showMenuItems(){
    this.showMenuItem = !this.showMenuItem;
}
ionViewDidLoad() {

    this.GlobalService.refreshOption();

}

ionViewCanLeave() {
    if(this.modalopened)
    {

        return false;
    }
    if(!this.inmesure || this.bypassexit)
    {
        this.bypassexit = false;
        return true;
    }
    if(this.showAlertMessage) {
        let alertPopup = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Attention, en quittant cette page pour perdrez les mesures qui n\'ont pas été enregistré.',
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

        // Show the alert
        alertPopup.present();

        // Return false to avoid the page to be popped up
        return false;
    }
}

private exitPage() {

    this.showAlertMessage = false;
    if(this.navCtrl.getViews().length > 1)
    {
        this.backgroundGeolocation.stop();
        this.navCtrl.pop();
    }
}
dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    console.log(out);

}
showInfo(i:number)
{
    switch(i)
            {
        case 0:
            this.toast.show("Distance parcouru", '3000', 'bottom').subscribe(toast => {});
            break;

        case 1:
            this.toast.show("Précision du GPS", '3000', 'bottom').subscribe(toast => {});
            break;

        case 2:
            this.toast.show("Dénivelé positif", '3000', 'bottom').subscribe(toast => {});
            break;

        case 3:
            this.toast.show("Chronomètre", '3000', 'bottom').subscribe(toast => {});
            break;
    }

}


activityToBg(act:string)
{
    switch(act)
            {
        case "skitouring":
            return "assets/img/f/f11.png";

        case "snow_ice_mixed":
            return "assets/img/f/f5.png";

        case "mountain_climbing":
            return "assets/img/f/f5.png";

        case "rock_climbing":
            return "assets/img/f/f4.png";

        case "ice_climbing":
            return "assets/img/f/f8.png";

        case "snowshoeing":
            return "assets/img/f/f8.png";

        case "paragliding":
            return "assets/img/f/f10.png";    

        case "mountain_biking":
            return "assets/img/f/f9.png";

        case "via_ferrata":
            return "assets/img/f/f7.png";

        case "hiking":
            return "assets/img/f/f7.png";

        default:
            return "assets/img/f/f5.png";
    }
}
filter(act:string,fab: FabContainer)
{
    if(act == "glyphicon glyphicon-cog")
    {
        this.iconfab = act;
        this.showMenuItem = false;
        this.activity = null;
        fab.close();
    }
    else
    {
        this.activity = act;
        this.bgc = this.activityToBg(act);
        this.iconfab = "icon-" + act;
        fab.close();
        this.showMenuItem = false;
    }

}

addWaypoint() {
    this.bypassexit = true;
    this.navCtrl.push(Addwaypoint,{lat:this.lat,lon:this.lon,elevation:this.elevation,precision:this.precision}); 
}

getWaypoints() 
{
    this.navCtrl.push(Waypoints,{lat:this.lat,lon:this.lon,waypoints:this.waypoints}); 
}

timeToStr(time)
{

    if(time == null)
        time = 0;

    let sec = Math.floor((time/1000)%60);
    let min = Math.floor((time/60000)%60);
    let h = Math.floor(time/3600000);

    let secStr= "";
    let minStr= "";
    let hStr= "";

    if(sec < 10)
        secStr = "0" + sec;
    else
        secStr = sec.toString();

    if(min < 10)
        minStr = "0" + min;
    else
        minStr = min.toString();
    if(h < 10)
        hStr = "0" + h;
    else
        hStr = h.toString();


    return hStr+':'+minStr+':'+secStr+'';

}

precisionToReal(prec:number)
{
    if(this.GlobalService.precision > 100)
        return 1000;
    else if(this.GlobalService.precision > 50)
        return 100;
    else
        return 10;
}

getLocation()
{


    const config: BackgroundGeolocationConfig = {
        desiredAccuracy: this.precisionToReal(this.GlobalService.precision),
        stationaryRadius: 20,
        distanceFilter: this.GlobalService.distanceFilter,
        fastestInterval: this.GlobalService.frequency/10,
        locationProvider:1,
        interval : this.GlobalService.frequency,
        activitiesInterval: this.GlobalService.frequency,
        startForeground: true,
        minBattery: this.GlobalService.battery,
        activityType:"Fitness",
        notificationTitle : "Camptocamp",
        notificationText : "Enregistrement de la trace en cours.",
        debug: this.GlobalService.debugmode,
        pauseLocationUpdates: false,
        saveBatteryOnBackground: false,
        stopOnTerminate: true, 
    };


    this.backgroundGeolocation.configure(config).subscribe((location: any) => {

       
        this.lat = location.latitude;
        this.lon = location.longitude;
        this.elevation = location.altitude;
        
        this.precision = this.GlobalService.unitNB(location.accuracy.toFixed(2));
        // si on demande la meilleure precision possible (idealement cest le cas), on enregistre quand meme les coordonnées avec une precision de 30m pour palier a la qualité du signal gps

        if(location.accuracy < this.GlobalService.precision || ( this.GlobalService.precision < 30 && location.accuracy <= 30))
        {
       
            
            if(this.alt_max < location.altitude)
                this.alt_max = location.altitude;

            if(this.alt_min > location.altitude)
                this.alt_min = location.altitude;

            // calcul denivelé
            if(this.alt_prec == null)
                this.alt_prec = location.altitude;
            else
            {
                if(Math.abs(this.alt_prec - location.altitude) >= 25)
                {
                    if(this.alt_prec < location.altitude)
                    {
                        this.denivele_pos = Math.round(this.denivele_pos + (location.altitude - this.alt_prec));
                    }
                    else if(this.alt_prec > location.altitude)
                    {
                        this.denivele_neg = Math.round(this.denivele_neg + (this.alt_prec - location.altitude));
                    }
                    this.alt_prec = location.altitude;
                }
            }

            if(this.traceGps.length > 0)
            {
                if(this.traceGps[this.traceGps.length-1].lat != location.latitude && this.traceGps[this.traceGps.length-1].lon != location.longitude)
                {
                    var dn = new Date();
                    this.traceGps.push({lat:location.latitude,lon:location.longitude,accuracy:location.accuracy,altitude:location.altitude,time:dn.getTime()});
                }
                else
                {
                    this.zone.run(() => { });
                    return;
                }
            }
            else
            {
                var dn = new Date();
                this.traceGps.push({lat:location.latitude,lon:location.longitude,accuracy:location.accuracy,altitude:location.altitude,time:dn.getTime()});
            }
            if(this.traceGps.length >= 2)
            {

                this.distance = this.distance + Math.round(this.GlobalService.getDistanceFromLatLonInM(this.traceGps[this.traceGps.length-2].lat,this.traceGps[this.traceGps.length-2].lon,this.traceGps[this.traceGps.length-1].lat,this.traceGps[this.traceGps.length-1].lon));
            }

            this.saveState();
        } 

        this.zone.run(() => { });

        //this.backgroundGeolocation.finish(); // FOR IOS ONLY


    }, (err) => {

        console.log(err);

    });

    this.backgroundGeolocation.start();

    console.log("on vient de start");
}

stopSensor() {
    this.btstop = false;
    this.btpause = false;
    this.btplay = true;

    this.backgroundGeolocation.stop();


    clearInterval(this.interval);
    this.stockUT = this.stockUT +  Math.round(new Date().getTime()) - this.startUT;
    let alert = this.alertCtrl.create({
        title: 'Camptocamp',
        message: 'Voulez vous enregistrer une nouvelle sortie ou un itineraire ?',
        buttons: [

            {
                text: 'Sortie',
                handler: () => {
                    this.navCtrl.push(Addouting,{
                        picturetoul: this.picturetoul,
                        data: { latitude:this.lat,
                               longitude:this.lon,
                               trace:this.traceGps,
                               //trace:this.convoluate(),
                               length_total:this.distance/1000,
                               elevation_min:this.alt_min,
                               elevation_max:this.alt_max,
                               height_diff_up:this.denivele_pos,
                               height_diff_down:this.denivele_neg,
                               start:this.startUT,
                               route:this.route,
                               activity:this.activity
                              }
                    }); 
                    this.razSensor(false);
                }
            },
            {
                text: 'Itineraire',
                handler: () => {
                    this.navCtrl.push(Addroute,{picturetoul: this.picturetoul,data: { latitude:this.lat,
                                                                                     longitude:this.lon,
                                                                                     trace:this.traceGps,
                                                                                     //trace:this.convoluate(),
                                                                                     route_length:this.distance/1000,
                                                                                     elevation_min:this.alt_min,
                                                                                     elevation_max:this.alt_max,
                                                                                     height_diff_up:this.denivele_pos,
                                                                                     height_diff_down:this.denivele_neg,
                                                                                     start:this.startUT,
                                                                                     route:this.route,
                                                                                     activity:this.activity}}); 
                    this.razSensor(true);
                }
            },
            {
                text: 'Remise à 0',
                role: 'cancel',
                handler: () => {
                    this.razSensor(true);
                }
            },
            {
                text: 'Annuler',
                role: 'cancel',
                handler: () => {
                    this.btstop = true;
                    this.btpause = false;
                    this.btplay = true;

                }
            }
        ]
    });
    alert.present();

}
loadState()
{
    this.storage.get('tracing').then((val) => {  
        if(val != null)
        {
            let alert = this.alertCtrl.create({
                title: 'Camptocamp',
                message: 'Un itinéraire etait en cours d\'enregistrement, voulez vous reprendre la ou vous vous etiez arreté ?',
                buttons: [
                    {
                        text: 'Non',
                        role: 'cancel',
                        handler: () => {
                            this.storage.remove('tracing');
                        }
                    },
                    {
                        text: 'Oui',
                        handler: () => {
                            this.startUT = val.startUT;
                            this.stockUT = val.stockUT;
                            this.alt_prec = val.alt_prec;
                            this.alt_max = val.alt_max;
                            this.denivele_pos = val.denivele_pos;
                            this.denivele_neg = val.denivele_neg;
                            this.distance = val.distance;
                            this.elevation = val.elevation;
                            this.chrono = val.chrono;
                            this.traceGps = val.traceGps;
                            this.picturetoul = val.picturetoul;
                            this.btpause = false;
                            this.btplay = true;
                            this.isLoaded = true;
                        }
                    }
                ]
            });
            alert.present();
        }
    });
}
saveState()
{
    this.storage.set('tracing', {
        startUT: this.startUT,
        stockUT: this.stockUT +  Math.round(new Date().getTime()) - this.startUT,
        alt_prec: this.alt_prec,
        alt_max: this.alt_max,
        denivele_pos: this.denivele_pos,
        denivele_neg: this.denivele_neg,
        distance: this.distance,
        elevation: this.elevation,
        chrono: this.chrono,
        traceGps: this.traceGps,
        picturetoul: this.picturetoul
    }); 
}
razSensor(deletePicture:boolean)
{
    this.stockUT = 0;
    this.startUT = 0;
    this.alt_prec=null;
    this.alt_max = 0;
    this.alt_min = 0;
    this.denivele_pos = 0;
    this.denivele_neg = 0;
    this.distance = 0;
    this.elevation = 0;
    this.chrono = "00:00:00";
    this.traceGps = Array();
    this.inmesure = false;
    if(deletePicture)
    {
        for(var i = 0;i<this.picturetoul.length;i++)
        {
            this.storage.remove('imginwait-'+this.picturetoul[i]);
        }

    }
    this.storage.remove('tracing');
    this.picturetoul = Array();
}
pauseSensor() {
    this.btpause = false;
    this.btplay = true;

    clearInterval(this.interval);
    this.stockUT = this.stockUT +  Math.round(new Date().getTime()) - this.startUT;

    this.backgroundGeolocation.stop();

}
beforeStartSensor()
{
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                    this.startSensor();
                },
                error => {
                    this.startSensor();
                }
            );
        }
        else
        {
            this.startSensor();
        }

    });
}
startSensor() {

    this.btplay = false;
    this.inmesure = true;
    console.log("bt stop = " + this.btstop);
    if(this.btstop == false && this.isLoaded == false) // premier demarrage, sinon reprise
    {
        this.stockUT = 0;

    }
    this.btstop = true;
    this.btpause = true;

    this.startUT = Math.round(new Date().getTime());

    this.interval = setInterval(()=> { 
        this.chrono = this.timeToStr(this.stockUT+Math.round(new Date().getTime())-this.startUT);
    },500); 

    setTimeout(() => { this.getLocation();  }, 2000 );

}


showTopo() {
    console.log(this.route);

    if(this.route == null)
    {
        let alert = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Vous n\'avez pas choisi d\'itinéraire, voulez vous en choisir un ?',
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
                        setTimeout(() => { this.toposModal(false); } , 500);
                    }
                }
            ]
        });
        alert.present();
    }
    else
    {
        this.bypassexit = true;
        this.navCtrl.push(Topos_page,{id: this.route.document_id});
    }

}
showMap() {
    if(this.id == null)
    {
        let alert = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Voulez vous ajouter un itineraire enregistré sur la carte ?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {
                        setTimeout(() => { 
                            var that = this;
                            nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });



                        }, 300);
                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        setTimeout(() => { this.toposModal(true); } , 500);
                    }
                }
            ]
        });
        alert.present();
    }
    else
    {
        var that = this;
        nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
    }


}

addWaypointOffline(lon,lat) 
{
    this.storage.get('waypoints_list').then((val) => { 

        if(val != null)
        {
            for(let i = 0;i<val.length;i++)
            {
                if(this.waypoints_id.indexOf(val[i]) === -1)
                {
                    this.storage.get('waypoint-'+val[i]).then((data) => {

                        if(data == null)
                            return;
                        let coord = JSON.parse(data.geometry.geom);
                        let lonlat = this.GlobalService.meters2degress(coord.coordinates[0],coord.coordinates[1])

                        if(this.GlobalService.getDistanceFromLatLonInM(lat,lon,lonlat[1],lonlat[0]) <= 4000)
                        {
                            this.waypoints.push(data);
                        }

                    });
                }

            }

        }

    });
}

pictureModal(obj:any) {

    let profileModal = this.modalCtrl.create(Picture, { data: obj ,activity: this.activity });
    profileModal.onDidDismiss(data => {     
        if(data != null)
            this.picturetoul.push(data.id);
    });
    profileModal.present();
}
toposModal(withMap:boolean) {
    this.modalopened = true;
    let profileModal = this.modalCtrl.create(ModalTopos, { userId: 8675309 });
    profileModal.onDidDismiss(data => {
        this.modalopened = false;
        if(data === null)
        {
            console.log("on return");
            if(withMap)
            {
                var that = this;
                nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
            }
            return;
        }
        this.route = data.route;
        this.waypoints = data.waypoints;
        if(this.waypoints != null)
        {
            this.nbwaypoint = this.waypoints.length;
        }
        else
        {
            this.nbwaypoint = 0;
        }

        this.waypoints_id = Array();
        if(this.waypoints != null)
        {
            for(var i = 0;i<this.waypoints.length;i++)
            {
                this.waypoints_id.push(this.waypoints[i].document_id);
            }
        }


        this.geom_detail = data.geom_detail;
        this.id = data.id;
        if(data.geom != null)
        {
            let coord = JSON.parse(data.geom);


            let lonlat = this.GlobalService.meters2degress(coord.coordinates[0],coord.coordinates[1])
            this.addWaypointOffline(lonlat[0],lonlat[1]);
        }

        if(withMap)
        {
            var that = this;
            nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
        }

    });
    profileModal.present();
}



startMap() 
{
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
    var route = Object();
    route.list = Array();
    if(this.geom_detail != null)
    {
        var details = JSON.parse(this.geom_detail);
        console.log(details);
        for(var i = 0;i<details.coordinates.length;i++)
        {
            var cr = this.GlobalService.meters2degress(details.coordinates[i][0],details.coordinates[i][1]);
            route.list.push({lat:cr[1],lon:cr[0]});

        }
    }


    var myroute = Object();
    myroute.list = Array();
    if(this.traceGps != null)
    {

        for(var i = 0;i<this.traceGps.length;i++)
        {
            myroute.list.push({lat:this.traceGps[i].lat,lon:this.traceGps[i].lon});

        }
    }

    var center = Object();
    var zoom = "10";
    if(this.lat == null)
    {
        if(route.list.length > 0)
        {
            center = '{"lat":'+route.list[0].lat+',"lon":'+route.list[0].lon+'}';
            zoom = "10";
        }
        else 
        {
            center = '{"lat":44.923001,"lon":6.359711}';
            zoom = "5";
        }
    }
    else
    {
        center = '{"lat":'+this.lat+',"lon":'+this.lon+'}';
    }

    var that = this;
    nativemap.startMap(center,iconList,route,myroute,zoom,"0","1","1",this.GlobalService.carte,function(e) {
        if(e != null)
        {
            if(e == that.id)
                that.navCtrl.push(Topos_page,{id: e});
            else
                that.navCtrl.push(Proximity_page,{id: e});


        }
    },function(){console.log("impossible de lancer la map")});
}

takePicture() {

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                    this.launchCamera();
                },
                error => {
                    this.launchCamera();
                }
            );
        }
        else
        {
            this.launchCamera();
        }

    });

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


}
