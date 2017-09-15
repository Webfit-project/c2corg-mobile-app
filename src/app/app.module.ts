import { NgModule, ErrorHandler,  enableProdMode } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { GlobalService } from './app.global.service';
import { MyApp } from './app.component';
import { Article } from '../pages/article/article';
import { Main } from '../pages/main/main';
import { Config } from '../pages/config/config';
import { Config_gnl } from '../pages/config_gnl/config_gnl';
import { Config_gps } from '../pages/config_gps/config_gps';
import { Config_alerte } from '../pages/config_alerte/config_alerte';
import { Config_alerte_sms } from '../pages/config_alerte_sms/config_alerte_sms';
import { Copyright } from '../pages/copyright/copyright';
import { Shop } from '../pages/shop/shop';
import { Topos_tabs } from '../pages/topos_tabs/topos_tabs';

import { Modal_filter } from '../pages/topos_tabs/modal_filter';
import { Topos_page } from '../pages/topos_page/topos_page';
import { Outing } from '../pages/outing/outing';
import { Picture } from '../pages/picture/picture';
import { PictureToUpload } from '../pages/picture/picturetoupload';
import { ModalNotebook } from '../pages/picture/modal_notebook';
import { Topos_slides } from '../pages/topos_slides/topos_slides';
import { Trace } from '../pages/trace/trace';
import { ModalTopos } from '../pages/trace/modal_topos';
import { ModalConditionsLevels } from '../pages/trace/modal_conditions_levels';
import { Addwaypoint } from '../pages/trace/add_waypoint';
import { Addouting } from '../pages/trace/add_outing';
import { Addroute } from '../pages/trace/add_route';
import { Waypoints } from '../pages/trace/waypoints';
import { Connexion } from '../pages/connexion/connexion';
import { Forget } from '../pages/forget/forget';
import { Proximity_tabs } from '../pages/proximity_tabs/proximity_tabs';
import { Proximity_page } from '../pages/proximity_page/proximity_page';
import { BrowserModule } from '@angular/platform-browser';
import { MarkdownModule } from 'angular2-markdown';
import { Network } from '@ionic-native/network';
import { Datafeeder } from './datafeeder';
import { Notebook} from '../pages/notebook/notebook';
import { AutosizeModule } from 'ionic2-autosize';

let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noTokenScheme: true,
    globalHeaders: [{'Accept': 'application/json'}],
     
    tokenGetter: (() => storage.get('token'))
    
     
  }), http);
}

enableProdMode();
@NgModule({
    declarations: [
        MyApp,
        Connexion,
        Forget,
        Config,
        Config_gps,
        Config_gnl,
        Config_alerte,
        Config_alerte_sms,
        Copyright,
        Proximity_tabs,
        Proximity_page,
        Shop,
        Topos_tabs,
        Topos_page,
        Topos_slides,
        Main,
        Trace,
        Addwaypoint,
        Waypoints,
        ModalTopos,
        Addouting,
        Addroute,
        ModalConditionsLevels,
        ModalNotebook,
        Picture,
        PictureToUpload,
        Article,
        Outing,
        Notebook,
        Modal_filter
    ],
    imports: [
        IonicModule.forRoot(MyApp, {
canDisableScroll: false,
             mode: 'md'
}),
    IonicStorageModule.forRoot(), BrowserModule, MarkdownModule.forRoot(), AutosizeModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Connexion,
        Forget,
        Config,
        Config_gps,
        Config_gnl,
        Config_alerte,
        Config_alerte_sms,
        Copyright,
        Proximity_tabs,
        Proximity_page,
        Shop,
        Topos_tabs,
        Topos_page,
        Topos_slides,
        Main,
        Trace,
        Addwaypoint,
        Waypoints,
        ModalTopos,
        Addouting,
        Addroute,
        ModalConditionsLevels,
        Picture,
        PictureToUpload,
        Article,
        Outing,
        Notebook,
        Modal_filter,
        ModalNotebook

    ],
    providers: [Network,GlobalService,Datafeeder,{ provide: ErrorHandler, useClass: IonicErrorHandler },{ provide: AuthHttp,useFactory: getAuthHttp,deps: [Http]}]
})
export class AppModule {}
