import { Network } from '@ionic-native/network';
import { Component} from '@angular/core';
import { Topos_page } from '../topos_page/topos_page';
import { Modal_filter } from './modal_filter';
import {NavController, FabContainer ,ModalController, NavParams, Platform} from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import { Addroute } from './../trace/add_route';
import { Renderer } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

declare var nativemap: any;


@Component({
    selector: 'page-topos-tabs',
    templateUrl: 'topos_tabs.html',
    providers: [Network]
})
export class Topos_tabs {

    first : boolean;
    iconfab : string;
    topos: string;
    searchQuery: string = '';
    routes: Array<any>;
    routes_off: Array<any>;
    offset: number;
    nbroutes: number;
    nbroutes_off: number;
    loader: boolean;
    search: string;
    private uscroll : any;
    private activitie: string;
    private filters: any;
    storage: any;
    btreload:boolean;

    showMenuItem= false;

showMenuItems() {
    this.showMenuItem = !this.showMenuItem;
}

gotoPage(p:any) {

    this.navCtrl.push(Topos_page,{id:p}); 

}

ionViewWillEnter() {

    if(this.first == false)
        this.refreshOffline();
    else
        this.first = false;

}
modalFilter() {
    let Modal = this.modalCtrl.create(Modal_filter,{filters: this.filters,activity:this.activitie});
    Modal.onDidDismiss(data => {

        this.filters = data;
        if( data != null) {
            this.filters.activitie = this.activitie;
        } else {

        }
        this.offset = 0;
        this.loader = true;
        this.routes = Array();
        this.btreload = false;


        setTimeout(() =>  {
            this.loadRoutes();
        }, 500);


        this.storage.set('topos_filters', this.filters);
    });

    Modal.present();
}
filter(act:string,fab: FabContainer)
{
    fab.close();
    this.loader = true;
    this.routes = Array();
    this.activitie = act;
    this.iconfab = "icon-" + act;
    this.offset = 0;
    this.showMenuItem = false;

    this.btreload = false;
    setTimeout(() =>  {
        this.loadRoutes();
    }, 500);

    this.refreshOffline();
}

doInfinite_off(infiniteScroll) {
    this.uscroll = infiniteScroll;

}


doInfinite(infiniteScroll) {

    this.uscroll = infiniteScroll;
    this.loadRoutes();

}
public refreshOffline()
{

    this.storage.get('topos_list').then((val) => { 

        if(val != null)
        {
            this.routes_off = Array();
            if(this.activitie == "")
                this.nbroutes_off = val.length;
            else
                this.nbroutes_off = 0;
            for(let i = 0;i<val.length;i++)
            {

                this.storage.get('topos-'+val[i]).then((data) => {
                    if(data != null)
                    {

                        if(data.elevation_max != null)
                            data.elevation_max = this.GlobalService.unit(data.elevation_max);
                        if(data.height_diff_up != null)
                            data.height_diff_up = this.GlobalService.unit(data.height_diff_up);

                        for(var j = 0;j<data.locales.length;j++)
                        {
                            if(data.locales[j].lang == "fr")
                                data.idlg = j;
                        }

                        if(data.idlg == null)
                            data.idlg = 0;

                        if(this.activitie == "")
                            this.routes_off.push(data);
                        else
                        {
                            if(data.activities.indexOf(this.activitie) > -1)
                            {
                                this.nbroutes_off++;
                                this.routes_off.push(data); 
                            }
                        }
                    }

                });

            }

        }
        else
        {
            this.nbroutes_off = 0;
            this.routes_off = Array();
        }

    });
}
constructor(public platform: Platform, private ga: GoogleAnalytics,public modalCtrl: ModalController,public GlobalService: GlobalService,public navCtrl: NavController,private Datafeeder : Datafeeder ,private network: Network,storage: Storage,private navParams: NavParams,public renderer: Renderer) {

    this.first = true;
    this.storage = storage;
    this.offset = 0;
    this.routes = Array();
    this.btreload = false;
    this.nbroutes = 0;
    this.search = "";
    this.activitie = "";
    this.loader = true;
    this.nbroutes_off = 0;
    this.routes_off = Array();
    this.iconfab = "glyphicon glyphicon-play-circle";

    this.storage.get('topos_filters').then((val) => {
        if(val != null) {
            this.filters = val;   
            this.activitie = this.filters.activitie;
            this.iconfab = "icon-" + this.filters.activitie;
        }
    });



    //-416959,4460171,1216958,6739828
    if(navParams.get('list') == "offline")
    {
        this.topos = "offline";
    }
    else
    {
        if(this.GlobalService.getIsOnline())
        {
            this.topos = "list";
        }
        else
        {
            this.topos = "offline";
        }
    }

    this.platform.ready().then(() => {
        this.ga.trackView("Page liste route","#topos_tabs",true);
    });

}

addRoute()
{
    this.navCtrl.push(Addroute); 
}

ionViewDidLoad() {

    this.GlobalService.refreshOption();
    setTimeout(() =>{ 
        this.loadRoutes();
        this.refreshOffline();
    },1000);
}

cancelItems(e:any) {
    if(this.search == "")
    {
            this.routes = Array();
            this.offset = 0;
            this.loadRoutes();
    }
}
clearItems(e:any)
{
    this.search = "";
    this.routes = Array();
    this.offset = 0;
    this.loadRoutes();

}
getItems(e:any)
{
        this.routes = Array();
        this.offset = 0;
        this.loadRoutes();
        this.renderer.invokeElementMethod(event.target,'blur');
}
setRoutes(data)
{

    this.nbroutes = data.total;
    if(this.offset +30 < data.total)
        this.offset = this.offset + 30;
    else
        this.offset = data.total;

    for(var i =0;i<data.documents.length;i++)
    {

        if(data.documents[i].elevation_max != null)
            data.documents[i].elevation_max = this.GlobalService.unit(data.documents[i].elevation_max);
        if(data.documents[i].height_diff_up != null)
            data.documents[i].height_diff_up = this.GlobalService.unit(data.documents[i].height_diff_up);
        if(data.documents[i].locales[0].summary != null)
            data.documents[i].locales[0].summary = this.GlobalService.c2cTagCleaner(data.documents[i].locales[0].summary)

        for(var j = 0;j<data.documents[i].locales.length;j++)
        {
            if(data.documents[i].locales[j].lang == "fr")
                data.documents[i].idlg = j;
        }

        if(data.documents[i].idlg == null)
            data.documents[i].idlg = 0;

        this.routes.push(data.documents[i]);

    }


    if(this.uscroll != null) 
        this.uscroll.complete();

    if(this.loader)
        this.loader = false;
}

routesError(err:any)
{
    this.btreload = true;
    this.loader= false;
}
reloadRoutes()
{
    this.loader = true;
    this.btreload = false;

    this.loadRoutes();
}
loadRoutes()
{

    this.Datafeeder.requestapi("routes",{bbox:"-416959,4460171,1216958,6739828",act:this.activitie,offset:this.offset,search:this.search.trim(), filters:this.filters,view:this});
}
showMap() {
    var that = this;
    nativemap.requestWS(function(e) { that.startMap();  },function(){that.startMap(); });
}
startMap() {
    let iconList = Object();
    iconList.list = Array();

    for(let i=0;i<this.routes.length;i++)
    {
        var geo = JSON.parse(this.routes[i].geometry.geom);
        var c1 = this.GlobalService.meters2degress(geo.coordinates[0],geo.coordinates[1])
        if(this.routes[i].locales[this.routes[i].idlg].summary == null)
            this.routes[i].locales[this.routes[i].idlg].summary = "";
        iconList.list.push({id:this.routes[i].document_id,title: this.routes[i].locales[this.routes[i].idlg].title_prefix+" : "+this.routes[i].locales[this.routes[i].idlg].title, description: this.routes[i].locales[this.routes[i].idlg].summary ,"lat": c1[1],"lon": c1[0],"icon": "icon_itineraire"})
    }



    this.ga.trackView("Page topos tabs map","#topos_tabs_map",true);

    var center = '{"lat":44.923001,"lon":6.359711}';
    var route ='{"list":[]}';
    var that = this;
    nativemap.startMap(center,iconList,route,"","5","0","0","0",this.GlobalService.carte,function(e) {

        if(e != null)
        {
            that.navCtrl.push(Topos_page,{id: e});
        }
    },function(){console.log("impossible de lancer la map")});
    console.log("startmap fait");
    //

}
}
