import { Component } from '@angular/core';
import {  ViewController} from 'ionic-angular';

@Component({
    selector: 'page-modalconditionlevel',
    templateUrl: 'modal_conditions_levels.html'
})
export class ModalConditionsLevels {

level_place:string;
level_place_nd:boolean;
level_snow_height_soft:string;
level_snow_height_soft_nd:boolean;
level_snow_height_total:string;
level_snow_height_total_nd:boolean;
level_comment:string;

constructor(public viewCtrl: ViewController) 
{
    
 
}
save()
{
    if(this.level_place == "")
    {
        this.level_place_nd = true;
    }
    else
    {
        this.level_place_nd = false;
    }
    if(this.level_snow_height_soft == "")
    {
        this.level_snow_height_soft_nd = true;
    }
    else
    {
        this.level_snow_height_soft_nd = false;
    }
    if(this.level_snow_height_total == "")
    {
        this.level_snow_height_total_nd = true;
    }
    else
    {
        this.level_snow_height_total_nd = false;
    }
    
    if(this.level_snow_height_total_nd || this.level_place_nd || this.level_snow_height_soft_nd )
    {
        return;
    }
    
    this.dismiss();
}

dismiss() {
 
        this.viewCtrl.dismiss({ level_place:this.level_place,level_snow_height_soft:this.level_snow_height_soft,level_snow_height_total:this.level_snow_height_total,level_comment:this.level_comment});
    
} 

}