import { Component , NgZone} from '@angular/core';
import { NavController,NavParams,  ViewController,AlertController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../../app/app.global.service';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Datafeeder  } from '../../app/datafeeder';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
    selector: 'page-picturetoupload',
    templateUrl: 'picturetoupload.html',
    providers:[Transfer]
})
export class PictureToUpload {
    picturestoul:Array<string>;
    pictures:Array<any>;
    btsave:boolean;
    btcancel:boolean;
    btclose:boolean;
    idinupload:number;
    id_outing:number;
    fileTransfer: TransferObject;
    errorintransfert:boolean;

    constructor(public platform: Platform, private ga: GoogleAnalytics,public transfer: Transfer,public viewCtrl: ViewController, public navCtrl: NavController,navParams: NavParams, public storage:Storage, public GlobalService:GlobalService,private zone:NgZone,public Datafeeder:Datafeeder,public alertCtrl: AlertController) {
        this.btsave = true;
        this.btclose = false;
        this.btcancel = false;
        var picturestoul = navParams.get("picturetoul");
        this.id_outing = navParams.get("id_outing");


        this.pictures = Array();
        this.errorintransfert = false;
        this.picturestoul = picturestoul;
        if(picturestoul != null)
        {
            for(var i=0;i<picturestoul.length;i++)
            {

                this.storage.get("imginwait-"+picturestoul[i]).then((val) => { 
                    if(val == null)
                        return;


                    val.upload = true;
                    val.uploaded= false;
                    val.inupload = false;
                    val.loaded = "";
                    val.error = false;
                    // if(this.id_outing != null)
                    this.pictures.push(val);
                });
            }

        }
        /*
        this.pictures.push({inupload:false,error:false,'upload':true,data:{'filename':"C:\\Users\\Nicolas\\Pictures\\port saint louis\\20120730_111424.jpg"},attribute:{title:"test",categories:"test",type:"test"}}) */
        
        this.platform.ready().then(() => {
             this.ga.trackView("Picture to upload","#picturetoupad",true);
         });

    }
    dump(obj) {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }

        console.log(out);

    }
    togglePicture(p:any)
    {
        if(p.upload)
            p.upload = false;
        else
            p.upload = true;

        console.log(this.pictures);
    }
    cancel() {
        this.btclose = true;
        this.btsave = true;
        this.btcancel = false;
        this.fileTransfer.abort();

    }

    save() {
        if(!this.GlobalService.getIsOnline())
        {


            this.endOfTransfert(false,true);
            return;
        }
        this.btclose = false;
        this.btsave = false;
        this.btcancel = true;
        for(var i = 0;i<this.pictures.length;i++)
        {
            if(this.pictures[i].upload && this.pictures[i].uploaded == false)
            {
                this.idinupload = i;
                this.uploadImg(this.pictures[i]);
                break;
            }
        }

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
                            if(this.pictures[i].upload)
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
                },
                          {
                              text: 'Annuter',
                              role:'cancel',
                              handler: () => {
                                  // need to do something if the user stays?
                              }
                          }]
            });

            // Show the alert
            alertPopup.present();

        }
        else
        {


            for(var i = 0;i<this.pictures.length;i++)
            {
                if(this.pictures[i].upload)
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

    uploadImg(img:any)
    {

        if(this.id_outing == null && img.id_outing == null)
        {
            let alert = this.alertCtrl.create({
                title: 'Camptocamp',
                subTitle: 'Vous devez enregistrer la sortie de cette photo avant de l\'enregistrer.',
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                        handler: () => {
                            //this.navCtrl.pop();
                            this.gotoNextImg();
                        }
                    },
                    {
                        text: 'Fermer',
                        handler: () => {
                            // this.navCtrl.pop();
                            this.gotoNextImg();
                        }
                    }
                ]
            });
            alert.present(); 
            if(this.idinupload+1 >= this.pictures.length)
            {
                this.endOfTransfert(true,false);
            }
            else {
                this.gotoNextImg();
            }

        }
        else
        {
            img.inupload = true;
            img.error = false;
            if(this.fileTransfer == null)
                this.fileTransfer = this.transfer.create();
            let optionsul: FileUploadOptions = {
                fileKey: 'file',
                fileName: img.data.filename.substr(img.data.filename.lastIndexOf("/")+1),
                chunkedMode:false,
                headers: {}
            }
            var that = this;
            this.fileTransfer.onProgress (function(e:any) {
                img.loaded = Math.floor(e.loaded*100/e.total)+"%";
                that.zone.run(() => { 
                    //refresh ui
                });
            });
            this.fileTransfer.upload(img.data.filename, 'https://images.camptocamp.org/upload', optionsul)
                .then((data) => {

                let d = JSON.parse(data.response)
                this.zone.run(() => {  });
                this.associateImgToOuting(img,d);


            }, (err) => {
                console.log(" c'est ici qu'il y a une erreur");
                img.error = true;
                this.errorintransfert = true;
                if(this.idinupload+1 >= this.pictures.length)
                {
                    this.endOfTransfert(true,false);
                }
                else {
                    this.gotoNextImg();
                }

            })
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
        console.log("on rajoute l'mage a la sortie")
        this.Datafeeder.requestapi("image_add_outing",{data:obj,view:this});

    }

    close() {
        this.navCtrl.pop();
    }
    gotoNextImg()
    {
        this.pictures[this.idinupload].uploaded = true;
        this.idinupload++;

        for(var i = this.idinupload;i<this.pictures.length;i++)
        {
            if(this.pictures[i].upload)
            {
                this.idinupload = i;
                this.uploadImg(this.pictures[i]);
                break;
            }
        }
    }

    endOfTransfert(needinerror:boolean,alertnc:boolean)
    {
        this.pictures[this.idinupload].uploaded = true;
        this.btsave = false;
        this.btcancel = false;
        this.btclose = true;
        if(this.errorintransfert || alertnc)
        {

            this.storage.get("imginwait").then((val) => { 
                console.log("on garde les anciens");
                var result = Array();
                if(val != null)
                    result = val;

                for(var i =0;i<this.pictures.length;i++)
                {
                    if(needinerror)
                    {
                        if(this.pictures[i].error == true)
                        {
                            if(result.indexOf(this.picturestoul[i]) == -1)
                                result.push(this.picturestoul[i]);
                        }
                    }
                    else
                    {
                        this.pictures[i].id_outing = this.id_outing;
                        this.storage.set("imginwait-"+this.picturestoul[i],this.pictures[i]);

                        if(result.indexOf(this.picturestoul[i]) == -1)
                            result.push(this.picturestoul[i]);
                    }
                }

                this.storage.set('imginwait', result);
                if(alertnc)
                {
                    let alert = this.alertCtrl.create({
                        title: 'Camptocamp',
                        subTitle: 'Votre connexion ne vous permet pas de transferer les images actuellement. Vous pourrez les transférer plus tard.',
                        buttons: [
                            {
                                text: 'Annuler',
                                role: 'cancel',
                                handler: () => {
                                    this.btcancel = false;
                                    this.btsave = true;
                                }
                            },
                            {
                                text: 'Fermer',
                                handler: () => {
                                    this.navCtrl.pop();
                                }
                            }
                        ]
                    });
                    alert.present(); 
                }

            });
        }
    }

    imgOk(data:any)
    {

        this.pictures[this.idinupload].loaded = "100%";
        this.storage.remove("imginwait-"+this.picturestoul[this.idinupload])
        this.storage.get("imginwait").then((val) => { 
            if(val != null)
            {
                val.splice(val.indexOf(this.picturestoul[this.idinupload]), 1);
                this.storage.set("imginwait",val);
            }
        });

        console.log("avant next ou end");

        if((this.idinupload+1) < this.pictures.length)
        {
            console.log("next");
            this.gotoNextImg();
        }
        else
        {
            console.log("end");
            this.endOfTransfert(true,false);

        }


    }

    imgErr(err:any)
    {
        console.log(err);
        console.log("this.idinupload = " + this.idinupload);
        console.log("this.pictures.length = " + this.pictures.length);

        this.pictures[this.idinupload].error = true;
        this.errorintransfert = true;
        this.pictures[this.idinupload].id_outing = this.id_outing;
        this.storage.set("imginwait-"+this.picturestoul[this.idinupload],this.pictures[this.idinupload]);

        if(this.idinupload+1 < this.pictures.length)
        {
            this.gotoNextImg();
        }
        else
        {
            this.endOfTransfert(true,false);
        }



    }




}