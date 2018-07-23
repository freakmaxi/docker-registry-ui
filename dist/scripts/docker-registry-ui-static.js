/*!
 * docker-registry-ui
 * Copyright (C) 2016-2018  Jones Magloire @Joxit
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
function Http(){this.oReq=new XMLHttpRequest,this.oReq.hasHeader=Http.hasHeader,this.oReq.getErrorMessage=Http.getErrorMessage,this._events={},this._headers={}}Http.prototype.addEventListener=function(t,e){this._events[t]=e;var r=this;switch(t){case"loadend":r.oReq.addEventListener("loadend",function(){if(401==this.status){var t=new XMLHttpRequest;for(key in t.open(r._method,r._url),r._events)t.addEventListener(key,r._events[key]);for(key in r._headers)t.setRequestHeader(key,r._headers[key]);t.withCredentials=!0,t.hasHeader=Http.hasHeader,t.getErrorMessage=Http.getErrorMessage,t.send()}else e.bind(this)()});break;case"load":r.oReq.addEventListener("load",function(){401!==this.status&&e.bind(this)()});break;default:r.oReq.addEventListener(t,function(){e.bind(this)()})}},Http.prototype.setRequestHeader=function(t,e){this.oReq.setRequestHeader(t,e),this._headers[t]=e},Http.prototype.open=function(t,e){this._method=t,this._url=e,this.oReq.open(t,e)},Http.prototype.send=function(){this.oReq.send()},Http.hasHeader=function(t){return this.getAllResponseHeaders().split("\n").some(function(e){return new RegExp("^"+t+":","i").test(e)})},Http.getErrorMessage=function(){return registryUI.url()&&registryUI.url().match("^http://")&&"https:"===window.location.protocol?"Mixed Content: The page at `"+window.location.origin+"` was loaded over HTTPS, but requested an insecure server endpoint `"+registryUI.url()+"`. This request has been blocked; the content must be served over HTTPS.":registryUI.url()?this.withCredentials&&!this.hasHeader("Access-Control-Allow-Credentials")?"The `Access-Control-Allow-Credentials` header in the response is missing and must be set to `true` when the request's credentials mode is on. Origin `"+registryUI.url()+"` is therefore not allowed access.":"An error occured: Check your connection and your registry must have `Access-Control-Allow-Origin` header set to `"+window.location.origin+"`":"Incorrect server endpoint."};var registryUI={url:function(){return"${URL}"},name:function(){return"${REGISTRY_TITLE}"},isImageRemoveActivated:!0,catalog:{},taglist:{}};window.addEventListener("DOMContentLoaded",function(){riot.mount("*")}),riot.tag2("catalog",'<material-card ref="catalog-tag" class="catalog"> <div class="material-card-title-action"> <h2>Repositories of {registryUI.name()}</h2> </div> <div hide="{registryUI.catalog.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <ul class="list highlight" show="{registryUI.catalog.loadend}"> <li each="{item in registryUI.catalog.repositories}" onclick="registryUI.catalog.go(\'{item}\');"> <span> <i class="material-icons">send</i> {item} </span> </li> </ul> </material-card>',"","",function(t){registryUI.catalog.instance=this,registryUI.catalog.display=function(){registryUI.catalog.repositories=[];var t=new Http;t.addEventListener("load",function(){registryUI.catalog.repositories=[],200==this.status?(registryUI.catalog.repositories=JSON.parse(this.responseText).repositories||[],registryUI.catalog.repositories.sort()):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText)}),t.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.catalog.repositories=[]}),t.addEventListener("loadend",function(){registryUI.catalog.loadend=!0,registryUI.catalog.instance.update()}),t.open("GET",registryUI.url()+"/v2/_catalog?n=100000"),t.send()},registryUI.catalog.go=function(t){route("taglist/"+t)},registryUI.catalog.display()}),riot.tag2("app",'<header> <material-navbar> <div class="logo">Docker Registry UI</div> <menu></menu> </material-navbar> </header> <main> <catalog if="{route.routeName == \'home\'}"></catalog> <taglist if="{route.routeName == \'taglist\'}"></taglist> <change></change> <add></add> <remove></remove> <material-snackbar></material-snackbar> </main> <footer> <material-footer> <a class="material-footer-logo" href="https://joxit.github.io/docker-registry-ui/">Docker Registry UI v0.4.0</a> <ul class="material-footer-link-list"> <li> <a href="https://github.com/Joxit/docker-registry-ui">Contribute on GitHub</a> </li> <li> <a href="https://github.com/Joxit/docker-registry-ui/blob/master/LICENSE">Privacy &amp; Terms</a> </li> </ul> </material-footer> </footer>',"","",function(t){registryUI.appTag=this,route.base("#!"),route("",function(){route.routeName="home",registryUI.catalog.display&&(registryUI.catalog.loadend=!1,registryUI.catalog.display()),registryUI.appTag.update()}),route("/taglist/*",function(t){route.routeName="taglist",registryUI.taglist.name=t,registryUI.taglist.display&&(registryUI.taglist.loadend=!1,registryUI.taglist.display()),registryUI.appTag.update()}),registryUI.home=function(){"home"==route.routeName?registryUI.catalog.display():route("")},registryUI.snackbar=function(t,e){registryUI.appTag.tags["material-snackbar"].addToast({message:t,isError:e},15e3)},registryUI.errorSnackbar=function(t){return registryUI.snackbar(t,!0)},registryUI.cleanName=function(){var t=registryUI.url()&&registryUI.url().length>0&&registryUI.url()||window.location.host;return t?t.startsWith("http")?t.replace(/https?:\/\//,""):t:""},route.parser(null,function(t,e){const r=e.replace(/\?/g,"\\?").replace(/\*/g,"([^?#]+?)").replace(/\.\./,".*"),i=new RegExp("^"+r+"$"),s=t.match(i);if(s)return s.slice(1)}),registryUI.isDigit=function(t){return t>="0"&&t<="9"},registryUI.DockerImage=function(t,e){this.name=t,this.tag=e,riot.observable(this),this.on("get-size",function(){return void 0!==this.size?this.trigger("size",this.size):this.fillInfo()}),this.on("get-sha256",function(){return void 0!==this.size?this.trigger("sha256",this.sha256):this.fillInfo()})},registryUI.DockerImage._tagReduce=function(t,e){return t.length>0&&registryUI.isDigit(t[t.length-1].charAt(0))==registryUI.isDigit(e)?t[t.length-1]+=e:t.push(e),t},registryUI.DockerImage.compare=function(t,e){for(var r=t.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]),i=e.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]),s=0;s<r.length&&s<i.length;s++){var a=r[s].localeCompare(i[s]);if(registryUI.isDigit(r[s].charAt(0))&&registryUI.isDigit(i[s].charAt(0))){var o=r[s]-i[s];if(0!=o)return o}else if(0!=a)return a}return t.tag.length-e.tag.length},registryUI.DockerImage.prototype.fillInfo=function(){if(!this._fillInfoWaiting){this._fillInfoWaiting=!0;var t=new Http,e=this;t.addEventListener("loadend",function(){if(200==this.status||202==this.status){var t=JSON.parse(this.responseText);e.size=t.layers.reduce(function(t,e){return t+e.size},0),e.sha256=t.config.digest,e.trigger("size",e.size),e.trigger("sha256",e.sha256)}else 404==this.status?registryUI.errorSnackbar("Manifest for "+e.name+":"+e.tag+" not found"):registryUI.snackbar(this.responseText)}),t.open("GET",registryUI.url()+"/v2/"+e.name+"/manifests/"+e.tag),t.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),t.send()}},route.start(!0)}),riot.tag2("taglist",'<material-card ref="taglist-tag" class="taglist"> <div class="material-card-title-action"> <a href="#!" onclick="registryUI.home();"> <i class="material-icons">arrow_back</i> </a> <h2>Tags of {registryUI.name() + \'/\' + registryUI.taglist.name}</h2> </div> <div hide="{registryUI.taglist.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <table show="{registryUI.taglist.loadend}" style="border: none;"> <thead> <tr> <th class="material-card-th-left">Repository</th> <th></th> <th>Size</th> <th class="{registryUI.taglist.asc ? \'material-card-th-sorted-ascending\' : \'material-card-th-sorted-descending\'}" onclick="registryUI.taglist.reverse();">Tag</th> <th show="{registryUI.isImageRemoveActivated}"></th> </tr> </thead> <tbody> <tr each="{image in registryUI.taglist.tags}"> <td class="material-card-th-left">{image.name}</td> <td class="copy-to-clipboard"> <copy-to-clipboard image="{image}"></copy-to-clipboard> </td> <td><image-size image="{image}"></image-size></td> <td><image-tag image="{image}"></image-tag></td> <td show="{registryUI.isImageRemoveActivated}"> <remove-image image="{image}"></remove-image> </td> </tr> </tbody> </table> </material-card>',"","",function(t){registryUI.taglist.instance=this,registryUI.taglist.display=function(){if(registryUI.taglist.tags=[],"taglist"==route.routeName){var t=new Http;registryUI.taglist.instance.update(),t.addEventListener("load",function(){registryUI.taglist.tags=[],200==this.status?(registryUI.taglist.tags=JSON.parse(this.responseText).tags||[],registryUI.taglist.tags=registryUI.taglist.tags.map(function(t){return new registryUI.DockerImage(registryUI.taglist.name,t)}).sort(registryUI.DockerImage.compare)):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText,!0)}),t.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.taglist.tags=[]}),t.addEventListener("loadend",function(){registryUI.taglist.loadend=!0,registryUI.taglist.instance.update()}),t.open("GET",registryUI.url()+"/v2/"+registryUI.taglist.name+"/tags/list"),t.send(),registryUI.taglist.asc=!0}},registryUI.taglist.display(),registryUI.taglist.instance.update(),registryUI.taglist.reverse=function(){registryUI.taglist.asc?(registryUI.taglist.tags.reverse(),registryUI.taglist.asc=!1):(registryUI.taglist.tags.sort(registryUI.DockerImage.compare),registryUI.taglist.asc=!0),registryUI.taglist.instance.update()},registryUI.taglist.refresh=function(){route(registryUI.taglist.name)}}),riot.tag2("copy-to-clipboard",'<input ref="input" style="display: none; width: 1px; height: 1px;" riot-value="{this.dockerCmd}"> <a onclick="{this.copy}" title="Copy pull command."> <i class="material-icons">content_copy</i> </a>',"","",function(t){this.dockerCmd="docker pull "+registryUI.cleanName()+"/"+t.image.name+":"+t.image.tag,this.copy=function(){var t=this.refs.input;t.style.display="block",t.select(),document.execCommand("copy"),t.style.display="none",registryUI.snackbar("`"+this.dockerCmd+"` has been copied to clipboard.")}}),riot.tag2("remove-image",'<a href="#" title="This will delete the image." onclick="registryUI.removeImage.remove(\'{opts.image.name}\', \'{opts.image.tag}\')"> <i class="material-icons">delete</i> </a>',"","",function(t){registryUI.removeImage=registryUI.removeImage||{},registryUI.removeImage.remove=function(t,e){var r=new Http;r.addEventListener("loadend",function(){if(registryUI.taglist.refresh(),200==this.status){if(!this.hasHeader("Docker-Content-Digest"))return void registryUI.errorSnackbar("You need to add Access-Control-Expose-Headers: ['Docker-Content-Digest'] in your server configuration.");var r=this.getResponseHeader("Docker-Content-Digest"),i=new Http;i.addEventListener("loadend",function(){200==this.status||202==this.status?(registryUI.taglist.refresh(),registryUI.snackbar("Deleting "+t+":"+e+" image. Run `registry garbage-collect config.yml` on your registry")):404==this.status?registryUI.errorSnackbar("Digest not found"):registryUI.snackbar(this.responseText)}),i.open("DELETE",registryUI.url()+"/v2/"+t+"/manifests/"+r),i.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),i.addEventListener("error",function(){registryUI.errorSnackbar("An error occurred when deleting image. Check if your server accept DELETE methods Access-Control-Allow-Methods: ['DELETE'].")}),i.send()}else 404==this.status?registryUI.errorSnackbar("Manifest for "+t+":"+e+" not found"):registryUI.snackbar(this.responseText)}),r.open("HEAD",registryUI.url()+"/v2/"+t+"/manifests/"+e),r.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),r.send()}}),riot.tag2("image-size",'<div title="Compressed size of your image.">{this.bytesToSize(this.size)}</div>',"","",function(t){var e=this;this.bytesToSize=function(t){if(null==t||isNaN(t))return"?";if(0==t)return"0 Byte";var e=parseInt(Math.floor(Math.log(t)/Math.log(1024)));return Math.ceil(t/Math.pow(1024,e))+" "+["Bytes","KB","MB","GB","TB"][e]},t.image.on("size",function(t){e.size=t,e.update()}),t.image.trigger("get-size")}),riot.tag2("image-tag",'<div title="{this.sha256}">{opts.image.tag}</div>',"","",function(t){var e=this;t.image.on("sha256",function(t){e.sha256=t.substring(0,19),e.update()}),t.image.trigger("get-sha256")});