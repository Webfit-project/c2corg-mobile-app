import { Component } from '@angular/core';
import {LoadingController, NavController, AlertController } from 'ionic-angular';
import { Datafeeder  } from '../../app/datafeeder';


@Component({
    selector: 'page-forget',
    templateUrl: 'forget.html',
    providers: [Datafeeder]
})
export class Forget {
    femail: string;
    loader: any;

    constructor(public navCtrl: NavController,public loadingController: LoadingController, public alertCtrl: AlertController, private Datafeeder : Datafeeder) {

    }

    public forgetResult(result)
    {
        if(result)
        {
            this.loader.dismiss();

            let alert = this.alertCtrl.create({
                title: 'Camptocamp.org',
                subTitle: 'Vous allez bientôt recevoir un email vous permettant de réinitialiser votre mot de passe.',
                buttons: ['Fermer']
            });
            alert.present();

        }
        else
        {
            this.loader.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Adresse inconnu',
                subTitle: 'Aucun compte ne correspond à votre email.',
                buttons: ['Fermer']
            });
            alert.present();
        }
    }
    sendMail()
    {
        this.loader = this.loadingController.create({
            content: "Envoie de l'email en cours",
            dismissOnPageChange: true
        });  
        this.loader.present();
        this.Datafeeder.requestapi("forget",{email:this.femail,view:this});
    }

}