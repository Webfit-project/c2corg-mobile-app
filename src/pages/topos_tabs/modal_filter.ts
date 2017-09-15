import { Component } from '@angular/core';
import { NavController,NavParams,  ViewController,AlertController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'modal-filter',
    templateUrl: 'modal_filter.html'
})

export class Modal_filter {
    data:any;

    sltyp: Array<string>;
    rmaxa_default : any= {lower:0,upper:8850};
    rmaxa: any= {lower:0,upper:8850};
    badge_trat: any= {lower:1.1,upper:5.6};
    trat_default: any= {lower:0,upper:18};
    trat: any= {lower:0,upper:18};
    sexpo_default: any= {lower:1,upper:4}; 
    sexpo: any= {lower:1,upper:4};
    badge_lrat: any= {lower:"F",upper:"ED7"};
    lrat_default : any= {lower:0,upper:20};
    lrat : any= {lower:0,upper:20};
    srat_default: any= {lower:1,upper:7};
    srat: any= {lower:1,upper:7};
    crtyp: Array<string>;
    badge_frat: any= {lower:"2",upper:"9c+"};
    frat_default: any= {lower:0,upper:36};
    frat: any= {lower:0,upper:36};
    badge_rrat: any= {lower:"2",upper:"9c+"};
    rrat_default: any= {lower:0,upper:36};
    rrat: any= {lower:0,upper:36};
    rexpo_default: any={lower:1,upper:6};
    rexpo: any={lower:1,upper:6};
    badge_arat: any= {lower:"A0",upper:"A5+"};
    arat_default: any={lower:0,upper:11};
    arat: any={lower:0,upper:11};
    badge_grat: any= {lower:"F",upper:"ED7"};
    grat_default: any= {lower:0,upper:20};
    grat: any= {lower:0,upper:20};
    badge_erat: any= {lower:'I',upper:'VI'};
    erat_default: any= {lower:1,upper:6};
    erat: any= {lower:1,upper:6};
    orrat_default: any= {lower:1,upper:5};
    orrat: any= {lower:1,upper:5};
    badge_prat: any= {lower:'P1',upper:'P4+'};
    prat_default: any= {lower:0,upper:7};
    prat: any= {lower:0,upper:7};
    ralt_default: any= {lower:0,upper:6000};
    ralt: any= {lower:0,upper:6000};
    rappr_default: any={lower:0,upper:3000};
    rappr: any={lower:0,upper:3000};
    dhei_default: any={lower:0,upper:3000};
    dhei: any={lower:0,upper:3000};
    badge_irat: any= {lower:'1',upper:'7+'};
    irat_default: any= {lower:1,upper:12};
    irat: any= {lower:1,upper:12};
    badge_mrat: any= {lower:'M1',upper:'M12+'};
    mrat_default: any= {lower:1,upper:22};
    mrat: any= {lower:1,upper:22};
    krat_default: any= {lower:1,upper:6};
    krat: any= {lower:1,upper:6};
    hrat_default: any={lower:1,upper:5};
    hrat: any={lower:1,upper:5};
    wrat_default: any={lower:1,upper:5};
    wrat: any={lower:1,upper:5};
    mbur_default: any={lower:1,upper:5};
    mbur: any={lower:1,upper:5};
    mbdr_default: any={lower:1,upper:5};
    mbdr: any={lower:1,upper:5};
    mbroad_default: any={lower:0,upper:50000};
    mbroad: any={lower:0,upper:50000};
    mbtrack_default: any={lower:0,upper:50000};
    mbtrack: any={lower:0,upper:50000};
    mbpush_default: any={lower:0,upper:5000};
    mbpush: any={lower:0,upper:5000};
    hexpo_default: any={lower:1,upper:4};
    hexpo: any={lower:1,upper:4};
    rmina_default: any = {lower:0,upper:6000};
    rmina: any = {lower:0,upper:6000};
    hdif_default: any={lower:0,upper:10000};
    hdif: any={lower:0,upper:10000};
    ddif_default: any={lower:0,upper:10000};
    ddif: any={lower:0,upper:10000};
    badge_time: any= {lower:'1 jour',upper:'10+ jours'};
    time_default: any={lower:1,upper:11};
    time: any={lower:1,upper:11};
    rtyp: Array<string>;
    conf: Array<string>;
    glac: Array<string>;
    rlen_default: any={lower:0,upper:100000};
    rlen: any={lower:0,upper:100000};
    lg: Array<string>;
    badge_qa: any={lower:'vide',upper:'excellent'};
    qa_default: any={lower:0,upper:4};
    qa: any={lower:0,upper:4};

    activity: string;
    constructor(public viewCtrl: ViewController, public navCtrl: NavController,navParams: NavParams,public alertCtrl: AlertController, public storage:Storage) {

        let filters = navParams.get('filters');
        console.log(filters);
        if(filters != null) {

            if(filters.arat != null) {
                let tab = filters.arat.split(',');
                this.arat ={lower:this.strToArat(tab[0]),upper:this.strToArat(tab[1])};
            }


            this.conf = filters.conf.split(',');

            this.crtyp = filters.crtyp.split(',');
            this.glac = filters.glac.split(',');

            if(filters.ddif != null) {
                let tab = filters.ddif.split(',');
                this.ddif ={lower:tab[0],upper:tab[1]};
            }

            if(filters.dhei != null) {
                let tab = filters.dhei.split(',');
                this.dhei ={lower:tab[0],upper:tab[1]};
            }

            if(filters.erat != null) {
                let tab = filters.erat.split(',');
                this.erat ={lower:this.strToErat(tab[0]),upper:this.strToErat(tab[1])};
            }

            if(filters.frat != null) {
                let tab = filters.frat.split(',');
                this.frat ={lower:this.strToFrat(tab[0]),upper:this.strToFrat(tab[1])};
            }

            if(filters.grat != null) {
                let tab = filters.grat.split(',');
                this.grat ={lower:tab[0],upper:tab[1]};
            }

            if(filters.hdif != null) {
                let tab = filters.hdif.split(',');
                this.hdif ={lower:tab[0],upper:tab[1]};
            }

            if(filters.hexpo != null) {
                let tab = filters.hexpo.split(',');
                this.hexpo ={lower:tab[0],upper:tab[1]};
            }

            if(filters.hrat != null) {
                let tab = filters.hrat.split(',');
                this.hrat ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }

            if(filters.irat != null) {
                let tab = filters.irat.split(',');
                this.irat ={lower:this.strToIrat(tab[0]),upper:this.strToIrat(tab[1])};
            }

            if(filters.krat != null) {
                let tab = filters.krat.split(',');
                this.krat ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }


            this.lg = filters.lg.split(',');

            if(filters.lrat != null) {
                let tab = filters.lrat.split(',');
                this.lrat ={lower:this.strToLrat(tab[0]),upper:this.strToLrat(tab[1])};
            }

            if(filters.mbdr != null) {
                let tab = filters.mbdr.split(',');
                this.mbdr ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }


            if(filters.mbpush != null) {
                let tab = filters.mbpush.split(',');
                this.mbpush ={lower:tab[0],upper:tab[1]};
            }


            if(filters.mbroad != null) {
                let tab = filters.mbroad.split(',');
                this.mbroad ={lower:tab[0],upper:tab[1]};
            }

            if(filters.mbtrack != null) {
                let tab = filters.mbtrack.split(',');
                this.mbtrack ={lower:tab[0],upper:tab[1]};
            }

            if(filters.mbur != null) {
                let tab = filters.mbur.split(',');
                this.mbur ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }

            if(filters.mrat != null) {
                let tab = filters.mrat.split(',');
                this.mrat ={lower:this.strToMrat(tab[0]),upper:this.strToMrat(tab[1])};
            }

            if(filters.orrat != null) {
                let tab = filters.orrat.split(',');
                this.orrat ={lower:tab[0],upper:tab[1]};
            }

            if(filters.prat != null) {
                let tab = filters.prat.split(',');
                this.prat ={lower:this.strToPrat(tab[0]),upper:this.strToPrat(tab[1])};
            }

            if(filters.qa != null) {
                let tab = filters.qa.split(',');
                this.qa ={lower:this.strToApiQa(tab[0]),upper:this.strToApiQa(tab[1])};
            }

            if(filters.ralt != null) {
                let tab = filters.ralt.split(',');
                this.ralt ={lower:tab[0],upper:tab[1]};
            }

            if(filters.rappr != null) {
                let tab = filters.rappr.split(',');
                this.rappr ={lower:tab[0],upper:tab[1]};
            }

            if(filters.rexpo != null) {
                let tab = filters.rexpo.split(',');
                this.rexpo ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }

            if(filters.rlen != null) {
                let tab = filters.rlen.split(',');
                this.rlen ={lower:tab[0],upper:tab[1]};
            }

            if(filters.rmaxa != null) {
                let tab = filters.rmaxa.split(',');
                this.rmaxa ={lower:tab[0],upper:tab[1]};
            }

            if(filters.rmina != null) {
                let tab = filters.rmina.split(',');
                this.rmina ={lower:tab[0],upper:tab[1]};
            }

            if(filters.rrat != null) {
                let tab = filters.rrat.split(',');
                this.rrat ={lower:tab[0],upper:tab[1]};
            }

            this.rtyp = filters.rtyp.split(',');

            if(filters.sexpo != null) {
                let tab = filters.sexpo.split(',');
                this.sexpo ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }


            if(filters.srat != null) {
                let tab = filters.srat.split(',');
                this.srat ={lower:tab[0],upper:tab[1]};
            }


            if(filters.time != null) {
                let tab = filters.time.split(',');
                this.time ={lower:tab[0],upper:tab[1]};
            }

            if(filters.trat != null) {
                let tab = filters.trat.split(',');
                this.trat ={lower:this.strToTrat(tab[0]),upper:this.strToTrat(tab[1])};
            }

            if(filters.wrat != null) {
                let tab = filters.wrat.split(',');
                this.wrat ={lower:tab[0].substr(1),upper:tab[1].substr(1)};
            }

            this.sltyp = filters.sltyp.split(',');


        }

        this.activity = navParams.get('activity');

    }
    strToTrat(str:string)
    {
        if(str == "1.1")
            return 0;
        else if(str == "1.2")
            return 1;
        else if(str == "1.3")
            return 2;
        else if(str == "2.1")
            return 3;
        else if(str == "2.2")
            return 4;
        else if(str == "2.3")
            return 5;
        else if(str == "3.1")
            return 6;
        else if(str == "3.2")
            return 7;
        else if(str == "3.3")
            return 8;
        else if(str == "4.1")
            return 9;
        else if(str == "4.2")
            return 10;
        else if(str == "4.3")
            return 11;
        else if(str == "5.1")
            return 12;
        else if(str == "5.2")
            return 13;
        else if(str == "5.3")
            return 14;
        else if(str == "5.4")
            return 15;
        else if(str == "5.5")
            return 16;
        else if(str == "5.6")
            return 17;
    }


    tratToStr(str:number)
    {

        switch(str)
                {
            case 0:
                return "1.1";

            case 1:
                return "1.2";

            case 2:
                return "1.3";

            case 3:
                return "2.1";

            case 4:
                return "2.2";

            case 5:
                return "2.3";

            case 6:
                return "3.1";

            case 7:
                return "3.2";

            case 8:
                return "3.3";

            case 9:
                return "4.1";

            case 10:
                return "4.2";

            case 11:
                return "4.3";

            case 12:
                return "5.1";

            case 13:
                return "5.2";

            case 14:
                return "5.3";

            case 15:
                return "5.4";

            case 16:
                return "5.5";

            case 17:
                return "5.6";
        }
    }
    strToLrat(str:string)
    {
        if(str == "F") 
            return 0;
        else if(str == "F+") 
            return 1;
        else if(str == "PD-") 
            return 2;
        else if(str == "PD") 
            return 3;
        else if(str == "PD+") 
            return 4;
        else if(str == "AD-") 
            return 5;
        else if(str == "AD") 
            return 6;
        else if(str == "AD+") 
            return 7;
        else if(str == "D-") 
            return 8;
        else if(str == "D") 
            return 9;
        else if(str == "D+") 
            return 10;
        else if(str == "TD-") 
            return 11;
        else if(str == "TD") 
            return 12;
        else if(str == "TD+") 
            return 13;
        else if(str == "ED-") 
            return 14;
        else if(str == "ED") 
            return 15;
        else if(str == "ED+") 
            return 16;
        else if(str == "ED4") 
            return 17;
        else if(str == "ED5") 
            return 18;
        else if(str == "ED6") 
            return 19;
        else if(str == "ED7") 
            return 20;

    }
    lratToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "F";

            case 1:
                return "F+";

            case 2:
                return "PD-";

            case 3:
                return "PD";

            case 4:
                return "PD+";

            case 5:
                return "AD-";

            case 6:
                return "AD";

            case 7:
                return "AD+";

            case 8:
                return "D-";

            case 9:
                return "D";

            case 10:
                return "D+";

            case 11:
                return "TD-";

            case 12:
                return "TD";

            case 13:
                return "TD+";

            case 14:
                return "ED-";

            case 15:
                return "ED";

            case 16:
                return "ED+";

            case 17:
                return "ED4";

            case 18:
                return "ED5";

            case 19:
                return "ED6";

            case 20:
                return "ED7";
        }
    }

    strToFrat(str:string)
    {
        if(str == "2")
            return 0;
        else if(str == "3a")
            return 1;
        else if(str == "3b")
            return 2;
        else if(str == "3c")
            return 3;

        else if(str == "4a")
            return 4;
        else if(str == "4b")
            return 5;
        else if(str == "4c")
            return 6;
        else if(str == "5a")
            return 7;
        else if(str == "5a+")
            return 8;
        else if(str == "5b")
            return 9;
        else if(str == "5b+")
            return 10;
        else if(str == "5c")
            return 11;
        else if(str == "5c+")
            return 12;
        else if(str == "6a")
            return 13;
        else if(str == "6a+")
            return 14;
        else if(str == "6b")
            return 15;
        else if(str == "6b+")
            return 16;
        else if(str == "6c")
            return 17;

        else if(str == "6c+")
            return 18;
        else if(str == "7a")
            return 19;
        else if(str == "7a+")
            return 20;
        else if(str == "7b")
            return 21;
        else if(str == "7b+")
            return 22;
        else if(str == "7c")
            return 23;
        else if(str == "7c+")
            return 24;
        else if(str == "8a")
            return 25;
        else if(str == "8a+")
            return 26;
        else if(str == "8b")
            return 27;
        else if(str == "8b+")
            return 28;
        else if(str == "8c")
            return 29;
        else if(str == "8c+")
            return 30;
        else if(str == "9a")
            return 31;
        else if(str == "9a+")
            return 32;
        else if(str == "9b")
            return 33;
        else if(str == "9b+")
            return 34;
        else if(str == "9c")
            return 35;
        else if(str == "9c+")
            return 36;

    }

    fratToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "2";

            case 1:
                return "3a";

            case 2:
                return "3b";

            case 3:
                return "3c";

            case 4:
                return "4a";

            case 5:
                return "4b";

            case 6:
                return "4c";

            case 7:
                return "5a";

            case 8:
                return "5a+";

            case 9:
                return "5b";

            case 10:
                return "5b+";

            case 11:
                return "5c";

            case 12:
                return "5c+";

            case 13:
                return "6a";

            case 14:
                return "6a+";

            case 15:
                return "6b";

            case 16:
                return "6b+";

            case 17:
                return "6c";

            case 18:
                return "6c+";

            case 19: 
                return "7a";

            case 20:
                return "7a+";

            case 21:
                return "7b";

            case 22:
                return "7b+";

            case 23:
                return "7c";

            case 24:
                return "7c+";

            case 25:
                return "8a";

            case 26:
                return "8a+";

            case 27:
                return "8b";

            case 28:
                return "8b+";

            case 29:
                return "8c";

            case 30:
                return "8c+";

            case 31:
                return "9a";

            case 32:
                return "9a+";

            case 33:
                return "9b";

            case 34:
                return "9b+";

            case 35:
                return "9c";

            case 36:
                return "9c+";

        }
    }

    rratToStr(str:string)
    {
        return str;
    }

    strToArat(str:string)
    {
        if(str == "A0")
            return 0;
        else if(str == "A0+")
            return 1;
        else if(str == "A1")
            return 2;
        else if(str == "A1+")
            return 3;
        else if(str == "A2")
            return 4;
        else if(str == "A2+")
            return 5;
        else if(str == "A3")
            return 6;
        else if(str == "A3+")
            return 7;
        else if(str == "A4")
            return 8;
        else if(str == "A4+")
            return 9;
        else if(str == "A5")
            return 10;
        else if(str == "A5+")
            return 11;

    }

    aratToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "A0";

            case 1:
                return "A0+";

            case 2:
                return "A1";

            case 3:
                return "A1+";

            case 4:
                return "A2";

            case 5:
                return "A2+";

            case 6:
                return "A3";

            case 7:
                return "A3+";

            case 8:
                return "A4";

            case 9:
                return "A4+";

            case 10:
                return "A5";

            case 11:
                return "A5+";
        }
    }
    strToGrat(str:string)
    {
        if(str == "F") 
            return 0;
        else if(str == "F+") 
            return 1;
        else if(str == "PD-") 
            return 2;
        else if(str == "PD") 
            return 3;
        else if(str == "PD+") 
            return 4;
        else if(str == "AD-") 
            return 5;
        else if(str == "AD") 
            return 6;
        else if(str == "AD+") 
            return 7;
        else if(str == "D-") 
            return 8;
        else if(str == "D") 
            return 9;
        else if(str == "D+") 
            return 10;
        else if(str == "TD-") 
            return 11;
        else if(str == "TD") 
            return 12;
        else if(str == "TD+") 
            return 13;
        else if(str == "ED-") 
            return 14;
        else if(str == "ED") 
            return 15;
        else if(str == "ED+") 
            return 16;
        else if(str == "ED4") 
            return 17;
        else if(str == "ED5") 
            return 18;
        else if(str == "ED6") 
            return 19;
        else if(str == "ED7") 
            return 20;

    }

    gratToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "F";

            case 1:
                return "F+";

            case 2:
                return "PD-";

            case 3:
                return "PD";

            case 4:
                return "PD+";

            case 5:
                return "AD-";

            case 6:
                return "AD";

            case 7:
                return "AD+";

            case 8:
                return "D-";

            case 9:
                return "D";

            case 10:
                return "D+";

            case 11:
                return "TD-";

            case 12:
                return "TD";

            case 13:
                return "TD+";

            case 14:
                return "ED-";

            case 15:
                return "ED";

            case 16:
                return "ED+";

            case 17:
                return "ED4";

            case 18:
                return "ED5";

            case 19:
                return "ED6";

            case 20:
                return "ED7";
        }
    }

    strToErat(str:string)
    {
        if(str == "I")
            return 1;
        else if(str == "II")
            return 2;
        else if(str == "III")
            return 3;
        else if(str == "IV")
            return 4;
        else if(str == "V")
            return 5;
        else if(str == "VI")
            return 6;
    }

    eratToStr(str:number)
    {
        switch(str)
                {
            case 1:
                return "I";
            case 2:
                return "II";
            case 3:
                return "III";
            case 4:
                return "IV";
            case 5:
                return "V";
            case 6:
                return "VI";
        }
    }

    orratToStr(str:string)
    {
        return str;
    }
    strToPrat(str:string)
    {
        if(str == "P1")
            return 0;
        else if(str == "P1+")
            return 1;
        else if(str == "P2")
            return 2;
        else if(str == "P2+")
            return 3;
        else if(str == "P3")
            return 4;
        else if(str == "P3+")
            return 5;
        else if(str == "P4")
            return 6;
        else if(str == "P4+")
            return 7;
    }

    pratToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "P1";
            case 1:
                return "P1+";
            case 2:
                return "P2";
            case 3:
                return "P2+";
            case 4:
                return "P3";
            case 5:
                return "P3+";
            case 6:
                return "P4";
            case 7:
                return "P4+";  
        }
    }

    strToIrat(str:string)
    {
        if(str == "1" || str == "2" || str == "3")
            return str;
        else if(str == "3+")
            return 4;
        else if(str == "4")
            return 5;
        else if(str == "4+")
            return 6;
        else if(str == "5")
            return 7;
        else if(str == "5+")
            return 8;
        else if(str == "6")
            return 9;
        else if(str == "6+")
            return 10;
        else if(str == "7")
            return 11;
        else if(str == "7+")
            return 12;

    }
    iratToStr(str:number)
    {
        switch(str)
                {
            case 1:
            case 2:
            case 3:
                return str;
            case 4:
                return "3+";
            case 5:
                return "4";
            case 6:
                return "4+";
            case 7:
                return "5";
            case 8:
                return "5+";
            case 9:
                return "6";
            case 10:
                return "6+";
            case 11:
                return "7";
            case 12:
                return "7+";
        }
    }

    strToMrat(str:string)
    {
        if(str == "1" || str == "2") {
            return str;
        } else if(str == "M3") {
            return 3;
        }
        else if(str == "M3+") {
            return 4;
        } else if(str == "M4") {
            return 5;
        } else if(str == "M4+") {
            return 6;
        } else if(str == "M5") {
            return 7;
        } else if(str == "M5+") {
            return 8;
        } else if(str == "M6") {
            return 9;
        } else if(str == "M6+") {
            return 10;
        } else if(str == "M7") {
            return 11;
        } else if(str == "M7+") {
            return 12;
        } else if(str == "M8") {
            return 13;
        } else if(str == "M8+") {
            return 14;
        } else if(str == "M9") {
            return 15;
        } else if(str == "M9+") {
            return 16;
        } else if(str == "M10") {
            return 17;
        } else if(str == "M10+") {
            return 18;
        } else if(str == "M11") {
            return 19;
        } else if(str == "M11+") {
            return 20;
        } else if(str == "M12") {
            return 21;
        } else if(str == "M12+") {
            return 22;
        }


    }


    mratToStr(str:number)
    {
        switch(str)
                {
            case 1:
            case 2:
            case 3:
                return "M"+str;
            case 4:
                return "M3+";
            case 5:
                return "M4";
            case 6:
                return "M4+";
            case 7:
                return "M5";
            case 8:
                return "M5+";
            case 9:
                return "M6";
            case 10:
                return "M6+";
            case 11:
                return "M7";
            case 12:
                return "M7+";
            case 13:
                return "M8";
            case 14:
                return "M8+";
            case 15:
                return "M9";
            case 16:
                return "M9+";
            case 17:
                return "M10";
            case 18:
                return "M10+";
            case 19:
                return "M11";
            case 20:
                return "M11+";
            case 21:
                return "M12";
            case 22:
                return "M12+";
        }
    }

    timeToStr(str:number)
    {
        switch(str)
                {
            case 1:
                return "1 jour";
            case 11:
                return "10+ jours";
            default:
                return str+" jours";
        }
    }
    strToApiQa(str:string)
    {
        if(str == 'empty')
            return 0;
        else if(str == "draft")
            return 1;
        else if(str == "medium")
            return 2;
        else if(str == "fine")
            return 3;
        else if(str == "great")
            return 4;

    }
    qaToApiStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "empty";
            case 1:
                return "draft";
            case 2:
                return "medium";
            case 3:
                return "fine";
            case 4:
                return "great";
        }
    }
    qaToStr(str:number)
    {
        switch(str)
                {
            case 0:
                return "vide";
            case 1:
                return "ébauche";
            case 2:
                return "moyen";
            case 3:
                return "bon";
            case 4:
                return "excellent";
        }
    }


    itemChange(id: string, item: string) {

        switch(id)
                {
            case "trat":
                this.badge_trat.lower = this.tratToStr(this.trat.lower);
                this.badge_trat.upper = this.tratToStr(this.trat.upper);
                break;

            case "lrat":
                this.badge_lrat.lower = this.lratToStr(this.lrat.lower);
                this.badge_lrat.upper = this.lratToStr(this.lrat.upper);
                break;

            case "frat":
                this.badge_frat.lower = this.fratToStr(this.frat.lower);
                this.badge_frat.upper = this.fratToStr(this.frat.upper);
                break;

            case "rrat":
                this.badge_rrat.lower = this.fratToStr(this.rrat.lower);
                this.badge_rrat.upper = this.fratToStr(this.rrat.upper);
                break;

            case "arat":
                this.badge_arat.lower = this.aratToStr(this.arat.lower);
                this.badge_arat.upper = this.aratToStr(this.arat.upper);
                break;

            case "grat":
                this.badge_grat.lower = this.gratToStr(this.grat.lower);
                this.badge_grat.upper = this.gratToStr(this.grat.upper);
                break;

            case "erat":
                this.badge_erat.lower = this.eratToStr(this.erat.lower);
                this.badge_erat.upper = this.eratToStr(this.erat.upper);
                break;

            case "prat":
                this.badge_prat.lower = this.pratToStr(this.prat.lower);
                this.badge_prat.upper = this.pratToStr(this.prat.upper);
                break;  

            case "irat":
                this.badge_irat.lower = this.iratToStr(this.irat.lower);
                this.badge_irat.upper = this.iratToStr(this.irat.upper);
                break;

            case "time":
                this.badge_time.lower = this.timeToStr(this.time.lower);
                this.badge_time.upper = this.timeToStr(this.time.upper);
                break;

            case "qa":
                this.badge_qa.lower = this.qaToStr(this.qa.lower);
                this.badge_qa.upper = this.qaToStr(this.qa.upper);
                break;

        }

    }
    close() {
        this.viewCtrl.dismiss();
    }
    raz() {
        let alertPopup = this.alertCtrl.create({
            title: 'Camptocamp',
            message: 'Attention, voulez vous remettre la configuration du filtre à sa configuration d\'origine ?.',
            buttons: [{
                text: 'Valider',
                role: 'cancel',
                handler: () => {
                    this.sltyp = Array();
                    this.rmaxa_default == {lower:0,upper:8850};
                    this.rmaxa = {lower:0,upper:8850};
                    this.badge_trat= {lower:1.1,upper:5.6};
                    this.trat_default= {lower:0,upper:18};
                    this.trat= {lower:0,upper:18};
                    this.sexpo_default= {lower:1,upper:4}; 
                    this.sexpo= {lower:1,upper:4};
                    this.badge_lrat= {lower:"F",upper:"ED7"};
                    this.lrat_default = {lower:0,upper:20};
                    this.lrat = {lower:0,upper:20};
                    this.srat_default= {lower:1,upper:7};
                    this.srat= {lower:1,upper:7};
                    this.crtyp= Array();
                    this.badge_frat= {lower:"2",upper:"9c+"};
                    this.frat_default= {lower:0,upper:36};
                    this.frat= {lower:0,upper:36};
                    this.badge_rrat= {lower:"2",upper:"9c+"};
                    this.rrat_default= {lower:0,upper:36};
                    this.rrat= {lower:0,upper:36};
                    this.rexpo_default={lower:1,upper:6};
                    this.rexpo={lower:1,upper:6};
                    this.badge_arat= {lower:"A0",upper:"A5+"};
                    this.arat_default={lower:0,upper:11};
                    this.arat={lower:0,upper:11};
                    this.badge_grat= {lower:"F",upper:"ED7"};
                    this.grat_default= {lower:0,upper:20};
                    this.grat= {lower:0,upper:20};
                    this.badge_erat= {lower:'I',upper:'VI'};
                    this.erat_default= {lower:1,upper:6};
                    this.erat= {lower:1,upper:6};
                    this.orrat_default= {lower:1,upper:5};
                    this.orrat= {lower:1,upper:5};
                    this.badge_prat= {lower:'P1',upper:'P4+'};
                    this.prat_default= {lower:0,upper:7};
                    this.prat= {lower:0,upper:7};
                    this.ralt_default= {lower:0,upper:6000};
                    this.ralt= {lower:0,upper:6000};
                    this.rappr_default={lower:0,upper:3000};
                    this.rappr={lower:0,upper:3000};
                    this.dhei_default={lower:0,upper:3000};
                    this.dhei={lower:0,upper:3000};
                    this.badge_irat= {lower:'1',upper:'7+'};
                    this.irat_default= {lower:1,upper:12};
                    this.irat= {lower:1,upper:12};
                    this.badge_mrat= {lower:'M1',upper:'M12+'};
                    this.mrat_default= {lower:1,upper:22};
                    this.mrat= {lower:1,upper:22};
                    this.krat_default= {lower:1,upper:6};
                    this.krat= {lower:1,upper:6};
                    this.hrat_default={lower:1,upper:5};
                    this.hrat={lower:1,upper:5};
                    this.wrat_default={lower:1,upper:5};
                    this.wrat={lower:1,upper:5};
                    this.mbur_default={lower:1,upper:5};
                    this.mbur={lower:1,upper:5};
                    this.mbdr_default={lower:1,upper:5};
                    this.mbdr={lower:1,upper:5};
                    this.mbroad_default={lower:0,upper:50000};
                    this.mbroad={lower:0,upper:50000};
                    this.mbtrack_default={lower:0,upper:50000};
                    this.mbtrack={lower:0,upper:50000};
                    this.mbpush_default={lower:0,upper:5000};
                    this.mbpush={lower:0,upper:5000};
                    this.hexpo_default={lower:1,upper:4};
                    this.hexpo={lower:1,upper:4};
                    this.rmina_default= {lower:0,upper:6000};
                    this.rmina={lower:0,upper:6000};
                    this.hdif_default={lower:0,upper:10000};
                    this.hdif={lower:0,upper:10000};
                    this.ddif_default={lower:0,upper:10000};
                    this.ddif={lower:0,upper:10000};
                    this.badge_time= {lower:'1 jour',upper:'10+ jours'};
                    this.time_default={lower:1,upper:11};
                    this.time={lower:1,upper:11};
                    this.rtyp= Array();
                    this.conf= Array();
                    this.glac= Array();
                    this.rlen_default={lower:0,upper:100000};
                    this.rlen={lower:0,upper:100000};
                    this.lg= Array();
                    this.badge_qa={lower:'vide',upper:'excellent'};
                    this.qa_default=={lower:0,upper:4};
                    this.qa = {lower:0,upper:4};
                }
            },
                      {
                          text: 'Annuler',
                          role:'cancel',
                          handler: () => {

                          }
                      }]
        });

        alertPopup.present();
    }
    save() {

        if(this.sltyp == null)
            this.sltyp = Array();
        if(this.rtyp == null)
            this.rtyp = Array();
        if(this.conf== null)
            this.conf = Array();
        if(this.glac == null)
            this.glac = Array();
        if(this.lg == null)
            this.lg = Array();
        if(this.crtyp == null)
            this.crtyp = Array();
        var obj = {rmaxa : null,trat: null,sexpo:null,lrat:null,srat:null,crtyp:this.crtyp.join(','),frat:null,rrat:null,rexpo:null,arat:null,grat:null,erat:null,orrat:null,prat:null,ralt:null,rappr:null,dhei:null,irat:null,mrat:null,krat:null,hrat:null,wrat:null,mbur:null,mbdr:null,mbroad:null,mbtrack:null,mbpush:null,hexpo:null,rmina:null,hdif:null,ddif:null,time:null, rtyp: this.rtyp.join(','), conf: this.conf.join(','),glac: this.glac.join(','),sltyp: this.sltyp.join(','),rlen:null,lg:this.lg.join(","),qa:null};

        if(this.rmaxa.lower != this.rmaxa_default.lower || this.rmaxa.upper != this.rmaxa_default.upper)
            obj.rmaxa = this.rmaxa.lower+","+this.rmaxa.upper;
        if(this.trat.lower != this.trat_default.lower || this.trat.upper != this.trat_default.upper)
            obj.trat = this.badge_trat.lower+","+this.badge_trat.upper;
        if(this.sexpo.lower != this.sexpo_default.lower || this.sexpo.upper != this.sexpo_default.upper)
            obj.sexpo = "E"+this.sexpo.lower+",E"+this.sexpo.upper;
        if(this.lrat.lower != this.lrat_default.lower || this.lrat.upper != this.lrat_default.upper)
            obj.lrat = this.badge_lrat.lower+","+this.badge_lrat.upper;
        if(this.srat.lower != this.srat_default.lower || this.srat.upper != this.srat_default.upper)
            obj.srat = this.srat.lower+","+this.srat.upper;

        if(this.frat.lower != this.frat_default.lower || this.frat.upper != this.frat_default.upper)
            obj.frat = this.badge_frat.lower+","+this.badge_frat.upper;
        if(this.rrat.lower != this.rrat_default.lower || this.rrat.upper != this.rrat_default.upper)
            obj.rrat = this.badge_rrat.lower+","+this.badge_rrat.upper;
        if(this.rexpo.lower != this.rexpo_default.lower || this.rexpo.upper != this.rexpo_default.upper)
            obj.rexpo = "E"+this.rexpo.lower+",E"+this.rexpo.upper;
        if(this.arat.lower != this.arat_default.lower || this.arat.upper != this.arat_default.upper)
            obj.arat = this.badge_arat.lower+","+this.badge_arat.upper;
        if(this.grat.lower != this.grat_default.lower || this.grat.upper != this.grat_default.upper)
            obj.grat = this.badge_grat.lower+","+this.badge_grat.upper;
        if(this.erat.lower != this.erat_default.lower || this.erat.upper != this.erat_default.upper)
            obj.erat = this.badge_erat.lower+","+this.badge_erat.upper;
        if(this.orrat.lower != this.orrat_default.lower || this.orrat.upper != this.orrat_default.upper)
            obj.orrat = this.orrat.lower+","+this.orrat.upper;
        if(this.prat.lower != this.prat_default.lower || this.prat.upper != this.prat_default.upper)
            obj.prat = this.badge_prat.lower+","+this.badge_prat.upper;
        if(this.ralt.lower != this.ralt_default.lower || this.ralt.upper != this.ralt_default.upper)
            obj.ralt = this.ralt.lower+","+this.ralt.upper;
        if(this.rappr.lower != this.rappr_default.lower || this.rappr.upper != this.rappr_default.upper)
            obj.rappr = this.rappr.lower+","+this.rappr.upper;
        if(this.dhei.lower != this.dhei_default.lower || this.dhei.upper != this.dhei_default.upper)
            obj.dhei = this.dhei.lower+","+this.dhei.upper;
        if(this.irat.lower != this.irat_default.lower || this.irat.upper != this.irat_default.upper)
            obj.irat = this.irat.lower+","+this.irat.upper;
        if(this.mrat.lower != this.mrat_default.lower || this.mrat.upper != this.mrat_default.upper)
            obj.mrat = this.badge_mrat.lower+","+this.badge_mrat.upper;
        if(this.krat.lower != this.krat_default.lower || this.krat.upper != this.krat_default.upper)
            obj.krat = "K"+this.krat.lower+",K"+this.krat.upper;
        if(this.hrat.lower != this.hrat_default.lower || this.hrat.upper != this.hrat_default.upper)
            obj.hrat = "T"+this.hrat.lower+",T"+this.hrat.upper;
        if(this.wrat.lower != this.wrat_default.lower || this.wrat.upper != this.wrat_default.upper)
            obj.wrat = "R"+this.wrat.lower+",R"+this.wrat.upper;
        if(this.mbur.lower != this.mbur_default.lower || this.mbur.upper != this.mbur_default.upper)
            obj.mbur = "M"+this.mbur.lower+",M"+this.mbur.upper;
        if(this.mbdr.lower != this.mbdr_default.lower || this.mbdr.upper != this.mbdr_default.upper)
            obj.mbdr = "V"+this.mbdr.lower+",V"+this.mbdr.upper;
        if(this.mbroad.lower != this.mbroad_default.lower || this.mbroad.upper != this.mbroad_default.upper)
            obj.mbroad = this.mbroad.lower+","+this.mbroad.upper;
        if(this.mbtrack.lower != this.mbtrack_default.lower || this.mbtrack.upper != this.mbtrack_default.upper)
            obj.mbtrack = this.mbtrack.lower+","+this.mbtrack.upper;
        if(this.mbpush.lower != this.mbpush_default.lower || this.mbpush.upper != this.mbpush_default.upper)
            obj.mbpush = this.mbpush.lower+","+this.mbpush.upper;
        if(this.hexpo.lower != this.hexpo_default.lower || this.hexpo.upper != this.hexpo_default.upper)
            obj.hexpo = "E"+this.hexpo.lower+",E"+this.hexpo.upper;
        if(this.rmina.lower != this.rmina_default.lower || this.rmina.upper != this.rmina_default.upper)
            obj.rmina = this.rmina.lower+","+this.rmina.upper;
        if(this.hdif.lower != this.hdif_default.lower || this.hdif.upper != this.hdif_default.upper)
            obj.hdif = this.hdif.lower+","+this.hdif.upper;
        if(this.hdif.lower != this.hdif_default.lower || this.hdif.upper != this.hdif_default.upper)
            obj.hdif = this.hdif.lower+","+this.hdif.upper;
        if(this.ddif.lower != this.ddif_default.lower || this.ddif.upper != this.ddif_default.upper)
            obj.ddif = this.ddif.lower+","+this.ddif.upper;
        if(this.time.lower != this.time_default.lower || this.time.upper != this.time_default.upper)
            obj.time = this.badge_time.lower.replace(" jours","").replace(" jour","")+","+this.badge_time.upper.replace(" jours","").replace(" jour","");
        if(this.rlen.lower != this.rlen_default.lower || this.rlen.upper != this.rlen_default.upper)
            obj.rlen = this.rlen.lower+","+this.rlen.upper;
        if(this.qa.lower != this.qa_default.lower || this.qa.upper != this.qa_default.upper)
            obj.qa = this.qaToApiStr(this.qa.lower)+","+this.qaToApiStr(this.qa.upper);



        console.log(obj);
        this.viewCtrl.dismiss(obj);

    }

}