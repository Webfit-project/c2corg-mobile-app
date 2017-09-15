import { Component } from '@angular/core';
import { Proximity_page} from '../proximity_page/proximity_page';
import {NavController, NavParams} from 'ionic-angular';
import { GlobalService } from '../../app/app.global.service';
@Component({
    selector: 'page-waypoints',
    templateUrl: 'waypoints.html'
})

export class Waypoints {

    nbwaypoints:number;
    waypoints: Array<any>;

    loader: boolean;

    constructor(public GlobalService:GlobalService,public navCtrl: NavController,private navParams: NavParams) {
        this.waypoints = navParams.get('waypoints');


        if(this.waypoints != null)
        {
            this.nbwaypoints = this.waypoints.length;

            for(var i =0;i<this.waypoints.length;i++)
            {
                if(this.waypoints[i].elevation != null)
                    this.waypoints[i].elevation = this.GlobalService.unit(this.waypoints[i].elevation);

            }

        }
        else
            this.nbwaypoints = 0;
    }


    gotoPage(id : any)
    {

        this.navCtrl.push(Proximity_page,{id:id}); 
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

}