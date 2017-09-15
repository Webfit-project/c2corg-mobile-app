import { Component , NgZone} from '@angular/core';
import {NavController, ViewController, Platform } from 'ionic-angular';
import { Proximity_page} from '../proximity_page/proximity_page';
import { Datafeeder } from '../../app/datafeeder';
import { GlobalService } from '../../app/app.global.service';
import { Storage } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Addwaypoint } from './../trace/add_waypoint';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var nativemap: any;

@Component({
    selector: 'page-proximity-tabs',
    templateUrl: 'proximity_tabs.html',
    providers: [Geolocation,LocationAccuracy]
})


export class Proximity_tabs {

    proximity: string;
    search: string = '';
    uscroll:any;
    offset:number;
    nbwaypoints:number;
    waypoints: Array<any>;
    nbwaypoints_off:number;
    waypoints_off:Array<any>;
    waitingGeoloc:boolean;
    loader: boolean;
    showMenuItem: boolean = false;
    noresult:boolean;
    lon:string;
    lat:string;
    elevation:string;
    precision:number;
    btreload: boolean;
    firstloading:boolean;
    errgps:boolean;
    showMenuItems(){
        this.showMenuItem = !this.showMenuItem;
    }


    constructor(public platform: Platform, private ga: GoogleAnalytics,public GlobalService:GlobalService,public viewCtrl: ViewController,public navCtrl: NavController,private Datafeeder : Datafeeder,private zone:NgZone,public storage:Storage,private geolocation: Geolocation,private locationAccuracy:LocationAccuracy) {
        this.waitingGeoloc = true;
        this.noresult = false;
        this.errgps = false;
        this.proximity = "list";
        this.loader = true;
        this.waypoints = Array();
        this.offset =0;
        this.nbwaypoints = 0;
        this.firstloading = true;
        this.lat= "";
        this.lon ="";
        /*
        this.lat = "44.823293765840077";
        this.lon = "6.432233879234907";
        */
        this.btreload = false;
        this.nbwaypoints_off = 0;
        this.waypoints_off = Array();
        this.loadOfflineWaypoint();
        //-416959,4460171,1216958,6739828
        if(this.GlobalService.getIsOnline())
        {
            this.proximity = "list";
        }
        else
        {
            this.loader = false;
            this.proximity = "offline";
        }
        
        this.platform.ready().then(() => {
             this.ga.trackView("Page liste waypoint","#proximity_tabs",true);
         });
    }
    ionViewDidEnter() {
        this.GlobalService.refreshOption();

        setTimeout(() => { 
            this.loadOfflineWaypoint();
        },1000);

        if(this.firstloading)
        {  
            this.givemethegps(); 
            this.firstloading = false;
        }
    }
    loadOfflineWaypoint()
    {
        this.storage.get('waypoints_list').then((val) => { 
            this.waypoints_off = Array();
            if(val != null)
            {

                this.nbwaypoints_off = val.length;

                for(let i = 0;i<val.length;i++)
                {



                    this.storage.get('waypoint-'+val[i]).then((data) => { 
                        if(data != null)
                        {
                            if(data.elevation != null)
                                data.elevation = this.GlobalService.unit(data.elevation);
                            this.waypoints_off.push(data);
                        }

                    });

                }

            }

        });
    }

    addWaypoint()
    {
        this.navCtrl.push(Addwaypoint ,{lat:this.lat,lon:this.lon,elevation:this.elevation,precision:this.precision}); 
    }
    getLocation()
    {
        this.geolocation.getCurrentPosition({enableHighAccuracy :true,timeout : 10000}).then((resp) => {
      
            this.lat = resp.coords.latitude.toString();
            this.lon = resp.coords.longitude.toString();
            this.precision = resp.coords.accuracy;
            if(resp.coords.altitude != null)
                this.elevation = resp.coords.altitude.toString();
            this.waitingGeoloc = false;
            this.loader = false;
            this.loadWaypoints();
        }).catch((error) => {
            this.errgps = true;
            this.loader = false;
            this.btreload = true;
        });

    }

    gotoPage(id : Int16Array)
    {
        this.navCtrl.push(Proximity_page,{id:id}); 
    }

    getItems(e:any)
    {

        if(e.keyCode == 13)
        {
            this.waypoints = Array();
            this.offset = 0;
            this.loadWaypoints();
        }
        else if(this.search == "")
        {

            this.waypoints = Array();
            this.offset = 0;
            this.loadWaypoints();
        }

    }


    ionViewCanLeave() {
   
        return true;
    }

    givemethegps() {
         this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                if(canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            this.getLocation();
                        },
                        error => {
                            this.getLocation();
                        }
                    );
                }
                else
                {
                    this.getLocation();
                }

            });
    }

    waypointError() {
        this.loader = false;
        this.btreload = true;
    }

    reloadWaypoints()
    {
        if(this.errgps == false)
        {
            this.errgps = false;
            this.givemethegps();
           
        }
        else
        {
            this.errgps = false;
            this.btreload = false;
            this.loader = true;
            this.loadWaypoints();
        }

    }
    loadWaypoints()
    {

        let bbox = "-416959,4460171,1216958,6739828";
        if(this.lat != "")
        {   

            bbox = this.GlobalService.makeBoudingBox(this.lat,this.lon);
        }

        this.btreload = false;
        this.Datafeeder.requestapi("waypoints",{bbox:bbox,offset:this.offset,search:this.search.trim(),view:this});
    }
    setWaypoints(data)
    {



        this.nbwaypoints = data.total;
        if(this.nbwaypoints == 0)
            this.noresult = true;
        else
            this.noresult = false;
        if(this.offset +30 < data.total)
            this.offset = this.offset + 30;
        else
            this.offset = data.total;

        for(var i =0;i<data.documents.length;i++)
        {

            if(data.documents[i].elevation != null)
                data.documents[i].elevation = this.GlobalService.unit(data.documents[i].elevation);
            if(data.documents[i].locales != null)
            {
                if(data.documents[i].locales.summary  != null)
                {
                    data.documents[i].locales[0].summary = this.GlobalService.c2cTagCleaner(data.documents[i].locales[0].summary);
                }
                if(this.waypoints.indexOf(data.documents[i]) == -1)
                    this.waypoints.push(data.documents[i]);
            }
        }


        if(this.uscroll != null) 
            this.uscroll.complete();

        if(this.loader)
            this.loader = false;

        this.zone.run(() => { 
            //refresh ui
        });



    }

    doInfinite(infiniteScroll) {
        if(this.loader == false && this.waitingGeoloc == false)
        {
            this.uscroll = infiniteScroll;
            this.loadWaypoints();
        }
    }


    typetostr(q:string)
    {

        return this.GlobalService.typeWaypointToStr(q);
    }


    showMap() {
        var that = this;
        nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
    }

    startMap() 
    {

        let iconList = Object();
        iconList.list = Array();

        for(let i=0;i<this.waypoints.length;i++)
        {
            var geo = JSON.parse(this.waypoints[i].geometry.geom);
            var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
            if(this.waypoints[i].locales[0].summary == null)
                this.waypoints[i].locales[0].summary = "";
            iconList.list.push({id:this.waypoints[i].document_id,title: this.waypoints[i].locales[0].title, description: this.waypoints[i].locales[0].summary ,"lat": c1[1],"lon": c1[0],"icon": this.waypoints[i].waypoint_type})
        }
        for(let i=0;i<this.waypoints_off.length;i++)
        {
            var geo = JSON.parse(this.waypoints_off[i].geometry.geom);
            var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
            if(this.waypoints_off[i].locales[0].summary == null)
                this.waypoints_off[i].locales[0].summary = "";
            iconList.list.push({id:this.waypoints_off[i].document_id,title: this.waypoints_off[i].locales[0].title, description: this.waypoints_off[i].locales[0].summary ,"lat": c1[1],"lon": c1[0],"icon": this.waypoints_off[i].waypoint_type})
        }

        var route = '{"list":[]}';
        var center,zoom;
        if(this.lat != "")
        {
            zoom = "13";
            center = '{"lat":'+this.lat+',"lon":'+this.lon+'}';
        }
        else
        {
            zoom = "5";
            center = '{"lat":44.923001,"lon":6.359711}';
        }
        var that = this;

        

        nativemap.startMap(center,iconList,route,"",zoom,"0","0","0",this.GlobalService.carte,function(e) {
            
           if(e != null)
            {
                that.navCtrl.push(Proximity_page,{id: e});
            }
        });

    }


}
