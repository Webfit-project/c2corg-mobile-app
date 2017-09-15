import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ViewController} from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';

@Component({
    selector: 'page-modaltopos',
    templateUrl: 'modal_topos.html'
})
export class ModalTopos {
    nbroutes_off:number;
    routes_off: Array<any>;
    routes:Array<any>;
    search:String;

    storage: any;
    constructor(public viewCtrl: ViewController,storage: Storage,private Datafeeder : Datafeeder) 
    {
        this.routes = Array();
        this.routes_off = Array();
        this.storage = storage;
        this.loadToposOffline();
    }

    loadToposOffline() {
        this.storage.get('topos_list').then((val) => { 

            if(val != null)
            {
                this.routes_off = Array();
                this.nbroutes_off = val.length;

                for(let i = 0;i<val.length;i++)
                {
                    this.storage.get('topos-'+val[i]).then((data) => {
                        this.routes_off.push(data);
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

    getItems(e:any)
    {
        if(e.keyCode == 13)
        {
            this.routes = Array();
            this.loadRoutes();
        }
        else if(this.search == "")
        {

            this.routes = Array();

            this.loadRoutes();
        }

    }

    setRoutes(data)
    {
        for(var i =0;i<data.documents.length;i++)
        {
            this.routes.push(data.documents[i]);
        }
    }
    setRoute(data)
    {
        this.saveOffline(data);
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
    saveOffline(data:any)
    {
        this.storage.get('topos_list').then((val) => { 

            if(val == null)
                val = Array();

            if(val.indexOf(data.document_id) > -1 )
                return false;

            val.push(data.document_id); 

            this.storage.set('topos_list', val); 



        });

        this.storage.set('topos-'+data.document_id, data);

        for(var i =0;i<data.associations.waypoints.length;i++)
        {   
            this.Datafeeder.requestapi("waypoint_offline",{id:data.associations.waypoints[i].document_id,view:this});
        }

        this.dismiss(data);
    }

    loadRoute(id:string)
    {
        this.Datafeeder.requestapi("route",{id:id,view:this});
    }
    
    loadRoutes()
    {
        this.Datafeeder.requestapi("routes",{bbox:"-416959,4460171,1216958,6739828",act:null,offset:0,search:this.search.trim(),view:this});
    }
    
    itemSelectedOnLine(item:any)
    {
        this.loadRoute(item.document_id);
    }
    
    itemSelected(item:any)
    {
        this.dismiss(item);
    }
    
    dismiss(item:any) {
        if(item == null)
            this.viewCtrl.dismiss({ id:null,waypoints:null,geom:null,geom_detail:null});
        else
        {
            let data = { route:item,id:item.document_id,waypoints: item.associations.waypoints, geom:item.geometry.geom, geom_detail: item.geometry.geom_detail };
            this.viewCtrl.dismiss(data);
        }
    }
}