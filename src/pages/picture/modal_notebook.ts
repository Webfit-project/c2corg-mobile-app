import { Component , NgZone} from '@angular/core';
import { NavController,NavParams,  ViewController,AlertController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Datafeeder  } from '../../app/datafeeder';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-modalnotebook',
    templateUrl: 'modal_notebook.html',
    providers:[Transfer]
})
export class ModalNotebook {
    picturestoul:Array<string>;
    pictures:Array<any>;
    btsave:boolean;
    btcancel:boolean;
    btclose:boolean;
    idinupload:number;
    id_outing:number;
    fileTransfer: TransferObject;
    errorintransfert:boolean;
    picturetodelete: Array<any>;

    constructor(public platform: Platform,public transfer: Transfer,public viewCtrl: ViewController, public navCtrl: NavController,navParams: NavParams, public storage:Storage, public GlobalService:GlobalService,private zone:NgZone,public Datafeeder:Datafeeder,public alertCtrl: AlertController) {
        this.btsave = false;
        this.btclose = true;

        var picturestoul = navParams.get("picturetoul");
       
        this.id_outing = navParams.get("id_outing");


        this.pictures = Array();
        this.picturetodelete = Array();
        this.errorintransfert = false;
        this.picturestoul = picturestoul;
        if(picturestoul != null)
        {
            for(var i=0;i<picturestoul.length;i++)
            {

                this.storage.get("imginwait-"+picturestoul[i]).then((val) => { 
                    if(val == null) {
                        return;
                    }

                    val.todelete = false;
                    val.error = false;
                    this.pictures.push(val);
                });
            }

        }

    }
    
    togglePicture(p:any)
    {
        if(p.todelete)
            p.todelete = false;
        else
            p.todelete = true;

        console.log(this.pictures);
    }
    cancel() {
        this.btclose = true;
        this.btsave = true;
        this.btcancel = false;
        this.fileTransfer.abort();

    }

    save() {
    }

    deleteImg(withalert:boolean)
    {
        if(withalert)
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Camptocamp',
                message: 'Voulez-vous effacer les images sélectionnées ?',
                buttons: [{
                    text: 'Oui',
                    role: 'cancel',
                    handler: () => {
                        for(var i = 0;i<this.pictures.length;i++)
                        {
                            if(this.pictures[i].todelete)
                            {
                                this.pictures.splice(i, 1);
                                this.storage.remove("imginwait-"+this.picturestoul[i]);
                                this.storage.get("imginwait").then((val) => { 
                                    if(val != null)
                                    {
                                        this.picturetodelete.push(this.picturestoul[i]);
                                        val.splice(val.indexOf(this.picturestoul[i]), 1);
                                        
                                        this.storage.set("imginwait",val).then((val) => {
                                            this.deleteImg(false);
                                        });
                                          

                                    }
                                    else
                                    {
                                        this.deleteImg(false);
                                    }
                                });

                                break;
                            }
                        }

                        if(this.pictures.length == 0)
                        {
                            this.btclose = true;
                            this.btcancel = false;
                            this.btsave = false;
                        }
                    }
                },
                          {
                              text: 'Annuter',
                              role:'cancel',
                              handler: () => {

                              }
                          }]
            });

            alertPopup.present();

        }
        else
        {

            for(var i = 0;i<this.pictures.length;i++)
            {
                if(this.pictures[i].todelete)
                {
                    this.pictures.splice(i, 1);
                    this.storage.remove("imginwait-"+this.picturestoul[i]);
                    this.storage.get("imginwait").then((val) => { 
                        if(val != null)
                        {
                            val.splice(val.indexOf(this.picturestoul[i]), 1);
                            this.storage.set("imginwait",val).then((val) => {
                                this.deleteImg(false);
                            });

                        }
                        else
                        {
                            this.deleteImg(false);
                        }
                    });

                    break;
                }
            }
            
            if(this.pictures.length == 0)
            {
                this.btclose = true;
                this.btcancel = false;
                this.btsave = false;
            }
        }
    }

    associateImgToOuting(img:any,dataul:any)
    {
        let d = new Date();
        let dateiso = d.toISOString();

        let meta = JSON.parse(img.data.json_metadata)
        if(img.id_outing != null)
            this.id_outing = img.id_outing

        let obj = {
            "images": [{
                "id": img.data.filename.substr(img.data.filename.lastIndexOf("/")+1)+""+dateiso,
                "activities": img.attribute.activities,
                "categories": img.attribute.categories,
                "image_type": img.attribute.type,
                "elevation": null,
                "geometry": null,
                "date_time": dateiso,
                "exposure_time": null,
                "iso_speed": null,
                "focal_length": null,
                "fnumber": null,
                "camera_name": meta.make +" "+ meta.model,
                "filename": dataul.filename,
                "title": img.attribute.title,
                "file_size": null,
                "associations": {
                    "outings": [{
                        "document_id": this.id_outing
                    }]
                },
                "locales": [{
                    "lang": "fr",
                    "title": img.attribute.title
                }]
            }]
        };
        
        this.Datafeeder.requestapi("image_add_outing",{data:obj,view:this});

    }

    close() {
       
        this.viewCtrl.dismiss({ picturetodelete: this.picturetodelete});
      
    }

}