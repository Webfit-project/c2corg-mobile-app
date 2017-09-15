import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events} from 'ionic-angular';
import 'rxjs/add/operator/timeout'
import {Http,  Headers, RequestOptions} from '@angular/http';
import { AuthHttp } from 'angular2-jwt';


@Injectable()

export class Datafeeder {
    http: any;

    id: number;
    name: string;
    token: string;
    portrait:string;
    username: string;
    forum_username:string;
    expire: number;
    public lang: string;
    private relogerror: boolean;
    isLogged:boolean;
    apiurl: string = "https://api.camptocamp.org"

    constructor(public storage: Storage,http:Http,private authHttp:AuthHttp,public events:Events) {
        this.http = http;
        this.relogerror = false;
        this.isLogged = false;
        storage.ready().then(() => {


            storage.get('id').then((val) => { this.id = val; if(this.id != null) this.isLogged = true; });
            storage.get('name').then((val) => { this.name = val; });
            storage.get('username').then((val) => { this.username = val; });
            storage.get('forum_username').then((val) => { this.forum_username = val; });
            storage.get('token').then((val) => { this.token = val; });
            storage.get('lang').then((val) => { this.lang = val; });

            storage.get('portrait').then((val) => { this.portrait = val; });

        });
    }

    public getIsLogged() {
        return this.isLogged;
    }
    public setIsLogged(d:boolean) {
        this.isLogged = d;
    }
    public getUserObject()
    {
        return {
            "version": 1,
            "activities": null,
            "document_id": this.id,
            "forum_username": this.forum_username,
            "available_langs": ["fr"],
            "name": this.name,
            "categories": [],
            "type": "u",
            "protected": false,
            "areas": [],
            "locales": [{
                "lang": "fr",
                "version": 1
            }]
        };
    }

    loadandstorePortrait(forum_username) {


        var headers = new Headers();
        headers.append("Accept", 'application/x-www-form-urlencoded');

        headers.append('Content-Type','application/x-www-form-urlencoded');

        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var reader = new FileReader();
            reader.onloadend = () => {
                this.storage.set('portrait',reader.result);
                this.events.publish('user:Portrait', {portrait:reader.result});
            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', 'https://api.webfit.io/portrait-full.php?f='+forum_username);
        xhr.responseType = 'blob';
        xhr.send();

    }


    public summaryCode(str:string)
    {
        if(str == null)
            return "";
        //fasst fix for markdown
        var mark = /(#)+([a-zA-Z])/g;
        str = str.replace(mark,'$1 $2');

        var img = /\[img=([0-9]*)\ ([a-z ]*)\](.*?)\[\/img\]/g;
        str = str.replace(img,'<img src="https://api.camptocamp.org/images/proxy/$1?size=MI"></img>');
        var img2 = /\[img=([0-9]*)\ ([a-z_ ]*)\/\]/g;
        str = str.replace(img2,'<img src="https://api.camptocamp.org/images/proxy/$1?size=MI"></img>');
        var b = /\[b\](.*?)\[\/b\]/g;
        str = str.replace(b,'<b>$1</b>');
        var i = /\[i\](.*?)\[\/i\]/g;
        str = str.replace(i,'<i>$1</i>');
        var url = /\[url=(.*?)\](.*?)\[\/url\]/g;
        str = str.replace(url,'<a href="$1">$2</a>');
        var waypoint = /\[\[waypoints\/([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(waypoint,'<span (click)="gotoPage(\'w\',\'$1\')">$3</span>');
        var route = /\[\[routes(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(route,'<span (click)="gotoPage(\'r\',\'$1\')">$3</span>');
        var outing = /\[\[outings(\/)+([0-9]*)\|(.*?)\]\]/g;
        str = str.replace(outing,'<span (click)="gotoPage(\'o\',\'$1\')">$3</span>');
        var toc= /\[toc\]/g;
        str = str.replace(toc,'<br />');
        return str;

    }

    public relogin(data)
    {
        console.log("on relogin");
        if(this.relogerror == true)
        {
            this.events.publish('user:loginFail');
            return false;
        }
        else
        {
            this.storage.get('login').then((login) => { 
                this.storage.get('pass').then((pass) => { 
                    this.requestapi("relogin",{login:login,password:pass,view:data});
                });
            });

        }
    }
    public requestapi(type:String,data:any)
    {
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );

        let options = new RequestOptions({ headers: headers });
        let postParams : any;

        switch(type) {

            case "relogin":

                if(data.login == null)
                {
                    data.view.gotoConnexion();
                    this.relogerror = true;
                    return;
                }
                postParams = {
                    discourse: false,
                    password: data.password,
                    remember: true,
                    username: data.login.trim()
                }


                this.http.post(this.apiurl+"/users/login", postParams, options).subscribe(_data=>{
                    this.saveIdent(data.login,data.password);
                    this.saveData("login",_data);
                    data.view.loadFeed();
                },error=>{
                    data.view.gotoConnexion();
                    this.relogerror = true;

                })
                break;


            case "login":


                postParams = {
                    discourse: false,
                    password: data.password,
                    remember: true,
                    username: data.login.trim()
                }

                this.http.post(this.apiurl+"/users/login", postParams, options).subscribe(_data=>{
                    this.saveIdent(data.login,data.password);
                    this.saveData("login",_data);
                    setTimeout(() => { data.view.loginResult(true); 

                                      this.isLogged = true;
                                     } , 200);

                },error=>{

                    data.view.loginResult(false);


                })
                break;


            case "forget":


                postParams = {
                    email: data.email
                }

                this.http.post(this.apiurl+"/users/request_password_change", postParams, options).subscribe(_data=>{
                    data.view.forgetResult(true);
                },error=>{
                    data.view.forgetResult(false);
                })
                break;

            case "image_add_outing":

                this.authHttp.post(this.apiurl+'/images/list', data.data, { headers: headers  })
                    .subscribe(
                    _data => {  data.view.imgOk(data); },
                    err => {  data.view.imgErr(err); },
                    () => {  }
                );

                break;

            case "waypoints":
                var q = "";
                var offset = "";
                if(data.offset > 0)
                {
                    offset = "&offset="+data.offset;
                }
                if(data.search != null)
                {
                    if(data.search.length > 4)
                    {
                        q= "&q="+data.search;
                    }
                }

                this.http.get(this.apiurl+"/waypoints?bbox="+data.bbox+""+offset+""+q+"&pl=fr",  options).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setWaypoints(jsonData);
                },error=>{
                    data.view.waypointError();
                })

                break;

            case "waypoint_offline":
                this.http.get(this.apiurl+"/waypoints/"+data.id,  options).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.saveWaypoint(jsonData);
                },error=>{

                })

                break;    

            case "waypoint_search":
                this.http.get(this.apiurl+"/search?q="+data.search+"&pl=fr&limit=7&t=w",  options).subscribe(_data=>{
                    var jsonData = _data.json();

                    data.view.setAutocompleteWp(jsonData);
                },error=>{

                })
                break;

            case "waypoint":
                this.http.get(this.apiurl+"/waypoints/"+data.id,  options).timeout(10000).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setWaypoint(jsonData);
                },error=>{
                    data.view.errorWaypoint(error);
                })

                break;

            case "waypoint_add":

                this.authHttp.post(this.apiurl+'/waypoints', data.waypoint, { headers: headers  })
                    .subscribe(
                    _data => { data.view.addOk(); },
                    err => { data.view.addOff(data.waypoint,err); },
                    () => { }
                );

                break;

            case "outing_add":

                this.authHttp.post(this.apiurl+'/outings', data.outing, { headers: headers  })
                    .subscribe(
                    _data => {  var jsonData = _data.json(); data.view.addOk(jsonData.document_id); },
                    err => { data.view.addOff( data.outing,err); },
                    () => {  }
                );

                break;


            case "route_add":

                this.authHttp.post(this.apiurl+'/routes', data.route, { headers: headers  })
                    .subscribe(
                    _data => {  var jsonData = _data.json(); data.view.addOk(data.route,jsonData.document_id);  },
                    err => { data.view.addOff(data.route,null,err); },
                    () => {  }
                );

                break;

            case "user_search":

                this.authHttp.get(this.apiurl+"/search?q="+data.search+"&pl=fr&limit=7&t=u", { headers: headers  }).subscribe(_data=>{
                    var jsonData = _data.json();

                    data.view.setAutocompletePt(jsonData);
                },error=>{

                })
                break;

            case "route_search":


                this.http.get(this.apiurl+"/search?q="+data.search+"&pl=fr&limit=7&t=r",  options).subscribe(_data=>{
                    var jsonData = _data.json();

                    data.view.setAutocompleteRt(jsonData);
                },error=>{

                })
                break;
            case "article":
                this.http.get(this.apiurl+"/articles/"+data.id,  options).timeout(10000).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setArticle(jsonData);
                },error=>{
                    data.view.errorArticle(error);
                })


                break;
                
            case "route":
                this.http.get(this.apiurl+"/routes/"+data.id,  options).timeout(10000).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setRoute(jsonData);
                },error=>{
                    data.view.errorRoute(error);
                })


                break;

            case "outing":
                this.http.get(this.apiurl+"/outings/"+data.id,  options).timeout(10000).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setOuting(jsonData);
                },error=>{
                    data.view.errorOuting(error);
                })

                break;

            case "routes":
                var offset = "";
                var q = "";
                var act = "";
                var filters = "";
                if(data.offset > 0)
                {
                    offset = "&offset="+data.offset;
                }
                if(data.search != null)
                {
                    if(data.search.length > 4)
                    {
                        q= "&q="+data.search;
                    }
                }

                if(data.act != "")
                {
                    act="act="+data.act;
                }
                if(data.filters != null) {
                    console.log(data.filters)

                    for (var k in data.filters) {
                        if (data.filters[k] != null) {
                            if(data.filters[k] != "") {
                                filters = filters + "&"+k+"="+data.filters[k];
                            }
                        }
                    }

                    if(data.filters['lg'] != null) {
                        if(data.filters['lg'].length == 0)
                        {
                            filters =  filters +"&pl=fr";
                        }
                    }
                }
                if(filters == "")
                    filters = "&pl=fr"
                this.http.get(this.apiurl+"/routes?"+act+""+q+""+offset+""+filters,  options).subscribe(_data=>{
                    var jsonData = _data.json();
                    data.view.setRoutes(jsonData);
                },error=>{
                    data.view.routesError(error);
                })

                break;
                
            case "feed-nolog":

                let urlnl = this.apiurl+"/feed?pl=fr";

                if(data.token != null)
                    urlnl = urlnl+"&token="+data.token;

                this.http.get(urlnl,  options).subscribe(_data=>{


                    var jsonData = _data.json();
                    var result= {token:"",feed:[]};
                    result.token = jsonData.pagination_token;

                    for(var i =0;i<jsonData.feed.length;i++)
                    {

                        var Obj = {
                            id:jsonData.feed[i].document.document_id,
                            type:jsonData.feed[i].document.type,
                            realtime:jsonData.feed[i].time,
                            title: jsonData.feed[i].document.locales[0].title,
                            summary: this.summaryCode(jsonData.feed[i].document.locales[0].summary),
                            activities: jsonData.feed[i].document.activities,
                            elevation_max: null,
                            height_diff_up:null,
                            orientation:Array(),
                            rock_free_rating:null,
                            rock_required_rating:null,
                            height_diff_difficulties:null,
                            images:Array(),
                            portraittmp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAQAAAAi5ZK2AAAJ90lEQVR4Ae3dY5AkWbyG8ZPVHtv2dIznrm3btm3btr29tmdte/eJxdxYc2bt3Y6Ojv/9XIPbVd15Mk9mve/v8/BpJarSmVQcZ6Loouii6KLoouii6JKl6Pmbpuj5n6JTw0AWYWOO4Epm8QFz+J0W/uVHPuMFbuZ0dmR5xtCZSNEzPSKGsB5X8itWhmfZi6nUK3rGRj3LcyMtWAe8x64MUPQMjCqW5DEsNnPYjR6KHuzowRE0Yx48zVQiRQ9sDKAJ8+oLVgomvKLTixuxRHzFMoqe+qjhKCxRrzNC0VMcS/E7loJzqVH0FEY9d2Kp+ZmZip7wmMbvWMpOp6DoCY2II7AgfEAPRU9g1DILC8a/TFd0z6MnX2CB2ULRPY6R/I0F6HhF9zQm0YoF6jIiRY99LIIFrSnm7IrOdAxT9gqKTiOWCZcpekxjIC1YRhyr6DGMLvyMZcjmit7BUQVYxkxV9A6Na7DM+Zvuit7usRmWSVBQ9HaN/lhmHa/o7RgFZmMZNkXRyx4HYZk2l2pFL2sMwDLvFEUva7yC5cBgRS95LIPlwnOKXuIoMBfLicUUvaSxAZYb/0uk6G2OAr9iObKkorc51sBy5QNFb3N8huXMeEX3cLtE4O5W9P93XI/lUGdFX+iox3Jpc0Vf6FgFy6XZir7QMQvLqZ6KvsBRh+XWJoru4d72wD2m6Ascx2M5Vq3oCxjfYTk2WtHDO1xL4bBN0cdhuXazos83NsZy7XdFn2+cheVcraLPM97Gcm6Aos8zWrGcm6boRaMGy711FL1odMdybz9FLxqDsNw7Q9E9HKUHrknRPVxsCdyTil40Fsdy7xVFLxpLY7n3nqIXjWWx3PtA0YvGEljuvano/t8ENPDXsCr6JCz37lP0ojEcy71LFL1o9MFy7yhFLxoNWO5to+hFI8Jyb2lFn2fMxbDKuh9W0W/Dcq6Los8z9sByLlL0Srvk8rqbb4reC8u1wxR9vhHRiuXY4oq+gHEvlmPdFH0BY30st+a4BU7R+2K5dayiV94JmkZFX8g4AMulFgqKvpAxBMul85xT9IWOT3TWPQ/R9Sr175xT9Ep7W7HNFL2NcSqWKy3UKHobozeWK0c4p+genq8atE6KXmmf64c7p+gljbOxXPiXOkUvcdTTrLcBrrwnMG5eeY/nUvSIN7GMG+mcont4enrATnJO0cseO2T6S3uVordrPI5l1EDXzil6Az9jGbShc4re7jEKy5wLnVP0Do31sEx5iYKid3gchmXGF9Q5p+gxjMuxTPidHi6mKXrEzVjw/qa/c4oeZ/a7g7+4MsQ5RY87exMWrD8Z6Jyi+8h+CRakH+njnKJX0sshoLNziu5xrIkF5T6qnVN0z2MYP2KBOIjIOUVPYNTzEJa6P/kfVzRF9zy2wFI1q133uSo6BXowjpXZi1O5jNt4nIfZmJqS75p9AUtFM2u5EscELuE57uVazuUINmQ6A6ivwOjUMYk9FprsXzal4Eoa6/I3lrBrS/0cZwSvYgs0l7NYgd4VEZ06luMBrE2fMM6VNGo5FkvMm4wu+V96Mdamb9iNfjmOznCux8pwMbWupNGNczHvYIYrcazAn1jJPmE1qnIXnUV4FSvbryzuXMnhD6MF8+RxJrsSR2fuw8r2N7tTn5vojOnQE5NvpsGVOKpZJfanM//NYfQt66aPFqydmtmGQuaj05VbYrh+tWqZDwzYltlYhzVzNpPKiUAvnsU6aA5LZjo6K9OMxeIxupf94bYcl/Ar1g5Psx1Dicq8HLRjjMcHNZmMTk3Ml0Jb2YrIlT0608gmnMvrbXwAfsEt7MWS9G3XnzIEsBjNZULmotOdT7wcMA1wHRhVdKY3wxjDRCbRyDhG0p9u1BJ16Hc9CvNgg0xFZwR/Yp4cTJULaEzhG8yTozITnUbMqx9ZLpDgvbgP8+qSTERnLK2Yd68wLuXgDRyFJeDs4KMzjBYsIa8wOaXgXTkeS8yJQUenK79jiXqP5alKNPhQLsQStkWw0akCLAXNHE5v531UswpgqZgSavRbsBS9ylo0eMod0cgFtGCp+ZeeAUZnYywAs1guzvQUGM1x/I2l7k2iwKLTh1YsGLArw4g6lLsbK9MU1L/q4KCiUwAsOC08zO5Mp5sredQygvW4mDlYgMaGFH1nLGgtvMmV7MMaTGIEA+lNNzrRhZ70ZyhjWYptOJVZ/IwF7TMKgUSnOyYJ2TmU6PdhkpjuAURnGiYJujP16ER8hEmiRqYdfQVMEvZcqtEppHJoI1PTjL4qJil4M7XoRHyFSSrGpRV9cUxS8nha0d/DJDWDUojOUExSdEYa0c/DJEWt1CQcnTpMUrZu0tHXxCRlHyQd/RVMUtfbQ/TAL6bKzklG3wwLgHyTZPQ3sSBIn4Si04AFQjZLKvqyWCDkFQ/Rg3++udQnEJ2IZiwYMiOJ6AOwgMhxSUTfGAuIfJdE9HuxoEhXz9GJaMWCIov6jt4XC4wc7jv6SlhgBN/Rz8CCIzV+o3+GBUeGeIxONRYgWc1n9EFYgORUn9FXwgIks31GPwoLkhT8RX8aC5L08he9BQuSTPMUnU5YoGQbX9FHYIGSi31FXw4LlLznK/ruWLAk8hA98HvjpMFP9A+wYMlgP9EtYDLdQ3RqsIDJej6i98ICJgf5iD4KC5hc6SP6IljA5Gkf0dfCAibf+Yi+MxYy8RH9aCxoUog/+nlY0KQ2/uhNWNCkU/zRH8OCJj3ij/4OFjTpH3/0OVjQZET80VuxoEljzNGJsMDJIopeeZaMO3oBC5wsG3f0KixwsmLc0auxwMlqcUevwQIna8cdvRYLnKwfd/R6LHCyiaJXns0q78u7rKtDtsqzUuWdkZMl4r/gYoGTqfFH/woLmgyNP/odWNCkSwzR9c5Suht2Ayxg8quP+97HYwGTG31Er8cCJpv4eVOCb7BgyQg/0c/AgiU1fqLPxAIls5zzE70aC5Ss7O+9Ya/HgiQNHqIH/QVeHnPOX/SIOVhwZJLfB/dsiAVGPnHOb/RqmrGgyMr+n7W6ORYQmU3kP3rEJ1gwZKJz3qM7RyMWCLnZuUSiO8fZWADkVxqSi14ALFx6GwIP0Z2jJy2YpGof5/xHD+k7u1zmXOLRnWNxTFJyC1Eq0Z1jRUxS8AAF51KK7hyTacYSJWcTOZdidOfol+hFGNnRFS+N6M5Rxy1YAuRHJjmXYvTisYq+zHt3FTXOBRTdOTpzMSaezGaqK1560YvHAB7AYiY/sgqRc8FFLwp/Kq1YLOQllqDgihZM9OJRw2o8jEkHfMP+9HdFCzZ6UfpFOJGPsDLInzSxIb1d8cKPXjyqGcIybMupPMwn/KqwRf7lO17lcvZhTRrp7IqWQnR/I6JQ8SIi52EeogczTdE1RdcUXVN0RZcKo+iKLoouii458X/vTnQ2aRqetQAAAABJRU5ErkJggg==",
                            imgtmp: "data:image/png;base64,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",
                            area: null,
                            author: {name:jsonData.feed[i].user.name,forum_username:jsonData.feed[i].user.forum_username, id:jsonData.feed[i].user.document_id},
                            hidden: false
                        };
                        if(jsonData.feed[i].document.locales[0].title_prefix != null)
                            jsonData.feed[i].document.locales[0].title = jsonData.feed[i].document.locales[0].title_prefix + " " + jsonData.feed[i].document.locales[0].title;

                        if(jsonData.feed[i].document.elevation_max != null)
                        {
                            Obj.elevation_max = jsonData.feed[i].document.elevation_max+ " m";
                        }

                        if(jsonData.feed[i].document.geometry != null)
                        {

                        }
                        if(jsonData.feed[i].document.areas != null)
                        {   
                            if(jsonData.feed[i].document.areas.length > 0)
                            {
                                Obj.area = jsonData.feed[i].document.areas[ jsonData.feed[i].document.areas.length-1].locales[0].title
                            }
                        }
                        if(jsonData.feed[i].image1 != null)
                        {   

                            Obj.images.push(jsonData.feed[i].image1);
                        }
                        if(jsonData.feed[i].image2 != null)
                        {
                            Obj.images.push(jsonData.feed[i].image2);
                        }
                        if(jsonData.feed[i].image3 != null)
                        {
                            Obj.images.push(jsonData.feed[i].image3);
                        }


                        result.feed.push(Obj);
                    }


                    data.view.setFeed(result);
                },error=>{
                    data.view.feedError(error);
                })
                break;
            case "feed":

                let url = this.apiurl+"/personal-feed?pl=fr";


                if(data.token != null)
                    url = url+"&token="+data.token;
                this.authHttp.get(url)
                    .subscribe(
                    _data =>  {

                        var jsonData = _data.json();
                        var result= {token:"",feed:[]};
                        result.token = jsonData.pagination_token;

                        for(var i =0;i<jsonData.feed.length;i++)
                        {

                            var Obj = {
                                id:jsonData.feed[i].document.document_id,
                                type:jsonData.feed[i].document.type,
                                realtime:jsonData.feed[i].time,
                                title: jsonData.feed[i].document.locales[0].title,
                                summary: this.summaryCode(jsonData.feed[i].document.locales[0].summary),
                                activities: jsonData.feed[i].document.activities,
                                elevation_max: null,
                                height_diff_up:null,
                                orientation:Array(),
                                rock_free_rating:null,
                                rock_required_rating:null,
                                height_diff_difficulties:null,
                                images:Array(),
                                portraittmp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAQAAAAi5ZK2AAAJ90lEQVR4Ae3dY5AkWbyG8ZPVHtv2dIznrm3btm3btr29tmdte/eJxdxYc2bt3Y6Ojv/9XIPbVd15Mk9mve/v8/BpJarSmVQcZ6Loouii6KLoouii6JKl6Pmbpuj5n6JTw0AWYWOO4Epm8QFz+J0W/uVHPuMFbuZ0dmR5xtCZSNEzPSKGsB5X8itWhmfZi6nUK3rGRj3LcyMtWAe8x64MUPQMjCqW5DEsNnPYjR6KHuzowRE0Yx48zVQiRQ9sDKAJ8+oLVgomvKLTixuxRHzFMoqe+qjhKCxRrzNC0VMcS/E7loJzqVH0FEY9d2Kp+ZmZip7wmMbvWMpOp6DoCY2II7AgfEAPRU9g1DILC8a/TFd0z6MnX2CB2ULRPY6R/I0F6HhF9zQm0YoF6jIiRY99LIIFrSnm7IrOdAxT9gqKTiOWCZcpekxjIC1YRhyr6DGMLvyMZcjmit7BUQVYxkxV9A6Na7DM+Zvuit7usRmWSVBQ9HaN/lhmHa/o7RgFZmMZNkXRyx4HYZk2l2pFL2sMwDLvFEUva7yC5cBgRS95LIPlwnOKXuIoMBfLicUUvaSxAZYb/0uk6G2OAr9iObKkorc51sBy5QNFb3N8huXMeEX3cLtE4O5W9P93XI/lUGdFX+iox3Jpc0Vf6FgFy6XZir7QMQvLqZ6KvsBRh+XWJoru4d72wD2m6Ascx2M5Vq3oCxjfYTk2WtHDO1xL4bBN0cdhuXazos83NsZy7XdFn2+cheVcraLPM97Gcm6Aos8zWrGcm6boRaMGy711FL1odMdybz9FLxqDsNw7Q9E9HKUHrknRPVxsCdyTil40Fsdy7xVFLxpLY7n3nqIXjWWx3PtA0YvGEljuvano/t8ENPDXsCr6JCz37lP0ojEcy71LFL1o9MFy7yhFLxoNWO5to+hFI8Jyb2lFn2fMxbDKuh9W0W/Dcq6Los8z9sByLlL0Srvk8rqbb4reC8u1wxR9vhHRiuXY4oq+gHEvlmPdFH0BY30st+a4BU7R+2K5dayiV94JmkZFX8g4AMulFgqKvpAxBMul85xT9IWOT3TWPQ/R9Sr175xT9Ep7W7HNFL2NcSqWKy3UKHobozeWK0c4p+genq8atE6KXmmf64c7p+gljbOxXPiXOkUvcdTTrLcBrrwnMG5eeY/nUvSIN7GMG+mcont4enrATnJO0cseO2T6S3uVordrPI5l1EDXzil6Az9jGbShc4re7jEKy5wLnVP0Do31sEx5iYKid3gchmXGF9Q5p+gxjMuxTPidHi6mKXrEzVjw/qa/c4oeZ/a7g7+4MsQ5RY87exMWrD8Z6Jyi+8h+CRakH+njnKJX0sshoLNziu5xrIkF5T6qnVN0z2MYP2KBOIjIOUVPYNTzEJa6P/kfVzRF9zy2wFI1q133uSo6BXowjpXZi1O5jNt4nIfZmJqS75p9AUtFM2u5EscELuE57uVazuUINmQ6A6ivwOjUMYk9FprsXzal4Eoa6/I3lrBrS/0cZwSvYgs0l7NYgd4VEZ06luMBrE2fMM6VNGo5FkvMm4wu+V96Mdamb9iNfjmOznCux8pwMbWupNGNczHvYIYrcazAn1jJPmE1qnIXnUV4FSvbryzuXMnhD6MF8+RxJrsSR2fuw8r2N7tTn5vojOnQE5NvpsGVOKpZJfanM//NYfQt66aPFqydmtmGQuaj05VbYrh+tWqZDwzYltlYhzVzNpPKiUAvnsU6aA5LZjo6K9OMxeIxupf94bYcl/Ar1g5Psx1Dicq8HLRjjMcHNZmMTk3Ml0Jb2YrIlT0608gmnMvrbXwAfsEt7MWS9G3XnzIEsBjNZULmotOdT7wcMA1wHRhVdKY3wxjDRCbRyDhG0p9u1BJ16Hc9CvNgg0xFZwR/Yp4cTJULaEzhG8yTozITnUbMqx9ZLpDgvbgP8+qSTERnLK2Yd68wLuXgDRyFJeDs4KMzjBYsIa8wOaXgXTkeS8yJQUenK79jiXqP5alKNPhQLsQStkWw0akCLAXNHE5v531UswpgqZgSavRbsBS9ylo0eMod0cgFtGCp+ZeeAUZnYywAs1guzvQUGM1x/I2l7k2iwKLTh1YsGLArw4g6lLsbK9MU1L/q4KCiUwAsOC08zO5Mp5sredQygvW4mDlYgMaGFH1nLGgtvMmV7MMaTGIEA+lNNzrRhZ70ZyhjWYptOJVZ/IwF7TMKgUSnOyYJ2TmU6PdhkpjuAURnGiYJujP16ER8hEmiRqYdfQVMEvZcqtEppHJoI1PTjL4qJil4M7XoRHyFSSrGpRV9cUxS8nha0d/DJDWDUojOUExSdEYa0c/DJEWt1CQcnTpMUrZu0tHXxCRlHyQd/RVMUtfbQ/TAL6bKzklG3wwLgHyTZPQ3sSBIn4Si04AFQjZLKvqyWCDkFQ/Rg3++udQnEJ2IZiwYMiOJ6AOwgMhxSUTfGAuIfJdE9HuxoEhXz9GJaMWCIov6jt4XC4wc7jv6SlhgBN/Rz8CCIzV+o3+GBUeGeIxONRYgWc1n9EFYgORUn9FXwgIks31GPwoLkhT8RX8aC5L08he9BQuSTPMUnU5YoGQbX9FHYIGSi31FXw4LlLznK/ruWLAk8hA98HvjpMFP9A+wYMlgP9EtYDLdQ3RqsIDJej6i98ICJgf5iD4KC5hc6SP6IljA5Gkf0dfCAibf+Yi+MxYy8RH9aCxoUog/+nlY0KQ2/uhNWNCkU/zRH8OCJj3ij/4OFjTpH3/0OVjQZET80VuxoEljzNGJsMDJIopeeZaMO3oBC5wsG3f0KixwsmLc0auxwMlqcUevwQIna8cdvRYLnKwfd/R6LHCyiaJXns0q78u7rKtDtsqzUuWdkZMl4r/gYoGTqfFH/woLmgyNP/odWNCkSwzR9c5Suht2Ayxg8quP+97HYwGTG31Er8cCJpv4eVOCb7BgyQg/0c/AgiU1fqLPxAIls5zzE70aC5Ss7O+9Ya/HgiQNHqIH/QVeHnPOX/SIOVhwZJLfB/dsiAVGPnHOb/RqmrGgyMr+n7W6ORYQmU3kP3rEJ1gwZKJz3qM7RyMWCLnZuUSiO8fZWADkVxqSi14ALFx6GwIP0Z2jJy2YpGof5/xHD+k7u1zmXOLRnWNxTFJyC1Eq0Z1jRUxS8AAF51KK7hyTacYSJWcTOZdidOfol+hFGNnRFS+N6M5Rxy1YAuRHJjmXYvTisYq+zHt3FTXOBRTdOTpzMSaezGaqK1560YvHAB7AYiY/sgqRc8FFLwp/Kq1YLOQllqDgihZM9OJRw2o8jEkHfMP+9HdFCzZ6UfpFOJGPsDLInzSxIb1d8cKPXjyqGcIybMupPMwn/KqwRf7lO17lcvZhTRrp7IqWQnR/I6JQ8SIi52EeogczTdE1RdcUXVN0RZcKo+iKLoouii458X/vTnQ2aRqetQAAAABJRU5ErkJggg==",
                                imgtmp: "data:image/png;base64,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",
                                area: null,
                                author: {name:jsonData.feed[i].user.name,forum_username:jsonData.feed[i].user.forum_username, id:jsonData.feed[i].user.document_id},
                                hidden: false
                            };
                            if(jsonData.feed[i].document.locales[0].title_prefix != null)
                                jsonData.feed[i].document.locales[0].title = jsonData.feed[i].document.locales[0].title_prefix + " " + jsonData.feed[i].document.locales[0].title;

                            if(jsonData.feed[i].document.elevation_max != null)
                            {
                                Obj.elevation_max = jsonData.feed[i].document.elevation_max+ " m";
                            }

                            if(jsonData.feed[i].document.geometry != null)
                            {

                            }
                            if(jsonData.feed[i].document.areas != null)
                            {   
                                if(jsonData.feed[i].document.areas.length > 0)
                                {
                                    Obj.area = jsonData.feed[i].document.areas[ jsonData.feed[i].document.areas.length-1].locales[0].title
                                }
                            }
                            if(jsonData.feed[i].image1 != null)
                            {   

                                Obj.images.push(jsonData.feed[i].image1);
                            }
                            if(jsonData.feed[i].image2 != null)
                            {
                                Obj.images.push(jsonData.feed[i].image2);
                            }
                            if(jsonData.feed[i].image3 != null)
                            {
                                Obj.images.push(jsonData.feed[i].image3);
                            }


                            result.feed.push(Obj);
                        }


                        data.view.setFeed(result);

                    },
                    err => {

                        data.view.feedError(err);

                    },
                    () => console.log('Request Complete')
                );

                break;

            default:
                break;
                   }

    }

    public saveIdent(login:string,pass:string)
    {
        this.storage.set('login', login);
        this.storage.set('pass', pass);
    }
    public saveData(type:string,data:any)
    {
        switch(type)
                {
            case "login":

                var json = JSON.parse(data._body);

                this.id = json.id;
                this.name = json.name;
                this.username = json.username;
                this.forum_username = json.forum_username;
                this.token = 'JWT token="'+json.token+'"';
                this.expire = json.expire
                this.lang = json.lang;

                this.storage.set('id', json.id);
                this.storage.set('name', json.name);
                this.storage.set('username', json.username); 
                this.storage.set('forum_username', json.forum_username); 
                this.storage.set('token', 'JWT token="'+json.token+'"'); 
                this.storage.set('expire', json.expire); 
                this.storage.set('lang', json.lang); 

                this.loadandstorePortrait(json.forum_username);
                this.events.publish('user:Name', {name:json.name});
                break;

            default:
                break;

        }

    }


}
