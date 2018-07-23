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
function Http(){this.oReq=new XMLHttpRequest,this.oReq.hasHeader=Http.hasHeader,this.oReq.getErrorMessage=Http.getErrorMessage,this._events={},this._headers={}}Http.prototype.addEventListener=function(e,t){this._events[e]=t;var r=this;switch(e){case"loadend":r.oReq.addEventListener("loadend",function(){if(401==this.status){var e=new XMLHttpRequest;for(key in e.open(r._method,r._url),r._events)e.addEventListener(key,r._events[key]);for(key in r._headers)e.setRequestHeader(key,r._headers[key]);e.withCredentials=!0,e.hasHeader=Http.hasHeader,e.getErrorMessage=Http.getErrorMessage,e.send()}else t.bind(this)()});break;case"load":r.oReq.addEventListener("load",function(){401!==this.status&&t.bind(this)()});break;default:r.oReq.addEventListener(e,function(){t.bind(this)()})}},Http.prototype.setRequestHeader=function(e,t){this.oReq.setRequestHeader(e,t),this._headers[e]=t},Http.prototype.open=function(e,t){this._method=e,this._url=t,this.oReq.open(e,t)},Http.prototype.send=function(){this.oReq.send()},Http.hasHeader=function(e){return this.getAllResponseHeaders().split("\n").some(function(t){return new RegExp("^"+e+":","i").test(t)})},Http.getErrorMessage=function(){return registryUI.url()&&registryUI.url().match("^http://")&&"https:"===window.location.protocol?"Mixed Content: The page at `"+window.location.origin+"` was loaded over HTTPS, but requested an insecure server endpoint `"+registryUI.url()+"`. This request has been blocked; the content must be served over HTTPS.":registryUI.url()?this.withCredentials&&!this.hasHeader("Access-Control-Allow-Credentials")?"The `Access-Control-Allow-Credentials` header in the response is missing and must be set to `true` when the request's credentials mode is on. Origin `"+registryUI.url()+"` is therefore not allowed access.":"An error occured: Check your connection and your registry must have `Access-Control-Allow-Origin` header set to `"+window.location.origin+"`":"Incorrect server endpoint."};var registryUI={URL_QUERY_PARAM_REGEX:/[&?]url=/,URL_PARAM_REGEX:/^url=/};registryUI.name=registryUI.url=function(e){if(!registryUI._url){var t=registryUI.getUrlQueryParam();if(t)try{return registryUI._url=registryUI.decodeURI(t),registryUI._url}catch(e){console.log(e)}registryUI._url=registryUI.getRegistryServer(0)}return registryUI._url},registryUI.getRegistryServer=function(e){try{var t=JSON.parse(localStorage.getItem("registryServer"));if(t instanceof Array)return isNaN(e)?t.map(function(e){return e.trim().replace(/\/*$/,"")}):t[e]}catch(e){}return isNaN(e)?[]:""},registryUI.addServer=function(e){var t=registryUI.getRegistryServer();e=e.trim().replace(/\/*$/,""),-1==t.indexOf(e)&&(t.push(e),registryUI._url||registryUI.updateHistory(e),localStorage.setItem("registryServer",JSON.stringify(t)))},registryUI.changeServer=function(e){var t=registryUI.getRegistryServer();e=e.trim().replace(/\/*$/,"");var r=t.indexOf(e);-1!=r&&(t.splice(r,1),t=[e].concat(t),registryUI.updateHistory(e),localStorage.setItem("registryServer",JSON.stringify(t)))},registryUI.removeServer=function(e){var t=registryUI.getRegistryServer();e=e.trim().replace(/\/*$/,"");var r=t.indexOf(e);-1!=r&&(t.splice(r,1),localStorage.setItem("registryServer",JSON.stringify(t)),e==registryUI.url()&&(registryUI.updateHistory(registryUI.getRegistryServer(0)),route("")))},registryUI.updateHistory=function(e){history.pushState(null,"",(e?"?url="+registryUI.encodeURI(e):"?")+window.location.hash),registryUI._url=e},registryUI.getUrlQueryParam=function(){var e=window.location.search;if(registryUI.URL_QUERY_PARAM_REGEX.test(e)){var t=e.split(/^\?|&/).find(function(e){return e&&registryUI.URL_PARAM_REGEX.test(e)});return t?t.replace(registryUI.URL_PARAM_REGEX,""):t}},registryUI.encodeURI=function(e){return e.indexOf("&")<0?window.encodeURIComponent(e):btoa(e)},registryUI.decodeURI=function(e){return e.startsWith("http")?window.decodeURIComponent(e):atob(e)},registryUI.isImageRemoveActivated=!0,registryUI.catalog={},registryUI.taglist={},window.addEventListener("DOMContentLoaded",function(){riot.mount("*")}),riot.tag2("add",'<material-popup> <div class="material-popup-title">Add your Server ?</div> <div class="material-popup-content"> <material-input onkeyup="{registryUI.addTag.onkeyup}" placeholder="Server URL"></material-input> <span>Write your URL without /v2</span> </div> <div class="material-popup-action"> <material-button class="dialog-button" waves-color="rgba(158,158,158,.4)" onclick="registryUI.addTag.add();">Add</material-button> <material-button class="dialog-button" waves-color="rgba(158,158,158,.4)" onclick="registryUI.addTag.close();">Cancel</material-button> </div> </material-popup>',"","",function(e){registryUI.addTag=registryUI.addTag||{},this.one("mount",function(){registryUI.addTag.dialog=this.tags["material-popup"],registryUI.addTag.dialog.getAddServer=function(){return this.tags["material-input"]?this.tags["material-input"].value:""}}),registryUI.addTag.onkeyup=function(e){13==e.keyCode&&registryUI.addTag.add()},registryUI.addTag.show=function(){registryUI.addTag.dialog.open()},registryUI.addTag.add=function(){registryUI.addTag.dialog.getAddServer().length>0&&registryUI.addServer(registryUI.addTag.dialog.getAddServer()),registryUI.home(),registryUI.addTag.close()},registryUI.addTag.close=function(){registryUI.addTag.dialog.tags["material-input"].value="",registryUI.addTag.dialog.close()}}),riot.tag2("app",'<header> <material-navbar> <div class="logo">Docker Registry UI</div> <menu></menu> </material-navbar> </header> <main> <catalog if="{route.routeName == \'home\'}"></catalog> <taglist if="{route.routeName == \'taglist\'}"></taglist> <change></change> <add></add> <remove></remove> <material-snackbar></material-snackbar> </main> <footer> <material-footer> <a class="material-footer-logo" href="https://joxit.github.io/docker-registry-ui/">Docker Registry UI v0.4.0</a> <ul class="material-footer-link-list"> <li> <a href="https://github.com/Joxit/docker-registry-ui">Contribute on GitHub</a> </li> <li> <a href="https://github.com/Joxit/docker-registry-ui/blob/master/LICENSE">Privacy &amp; Terms</a> </li> </ul> </material-footer> </footer>',"","",function(e){registryUI.appTag=this,route.base("#!"),route("",function(){route.routeName="home",registryUI.catalog.display&&(registryUI.catalog.loadend=!1,registryUI.catalog.display()),registryUI.appTag.update()}),route("/taglist/*",function(e){route.routeName="taglist",registryUI.taglist.name=e,registryUI.taglist.display&&(registryUI.taglist.loadend=!1,registryUI.taglist.display()),registryUI.appTag.update()}),registryUI.home=function(){"home"==route.routeName?registryUI.catalog.display():route("")},registryUI.snackbar=function(e,t){registryUI.appTag.tags["material-snackbar"].addToast({message:e,isError:t},15e3)},registryUI.errorSnackbar=function(e){return registryUI.snackbar(e,!0)},registryUI.cleanName=function(){var e=registryUI.url()&&registryUI.url().length>0&&registryUI.url()||window.location.host;return e?e.startsWith("http")?e.replace(/https?:\/\//,""):e:""},route.parser(null,function(e,t){const r=t.replace(/\?/g,"\\?").replace(/\*/g,"([^?#]+?)").replace(/\.\./,".*"),i=new RegExp("^"+r+"$"),a=e.match(i);if(a)return a.slice(1)}),registryUI.isDigit=function(e){return e>="0"&&e<="9"},registryUI.DockerImage=function(e,t){this.name=e,this.tag=t,riot.observable(this),this.on("get-size",function(){return void 0!==this.size?this.trigger("size",this.size):this.fillInfo()}),this.on("get-sha256",function(){return void 0!==this.size?this.trigger("sha256",this.sha256):this.fillInfo()})},registryUI.DockerImage._tagReduce=function(e,t){return e.length>0&&registryUI.isDigit(e[e.length-1].charAt(0))==registryUI.isDigit(t)?e[e.length-1]+=t:e.push(t),e},registryUI.DockerImage.compare=function(e,t){for(var r=e.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]),i=t.tag.match(/./g).reduce(registryUI.DockerImage._tagReduce,[]),a=0;a<r.length&&a<i.length;a++){var s=r[a].localeCompare(i[a]);if(registryUI.isDigit(r[a].charAt(0))&&registryUI.isDigit(i[a].charAt(0))){var o=r[a]-i[a];if(0!=o)return o}else if(0!=s)return s}return e.tag.length-t.tag.length},registryUI.DockerImage.prototype.fillInfo=function(){if(!this._fillInfoWaiting){this._fillInfoWaiting=!0;var e=new Http,t=this;e.addEventListener("loadend",function(){if(200==this.status||202==this.status){var e=JSON.parse(this.responseText);t.size=e.layers.reduce(function(e,t){return e+t.size},0),t.sha256=e.config.digest,t.trigger("size",t.size),t.trigger("sha256",t.sha256)}else 404==this.status?registryUI.errorSnackbar("Manifest for "+t.name+":"+t.tag+" not found"):registryUI.snackbar(this.responseText)}),e.open("GET",registryUI.url()+"/v2/"+t.name+"/manifests/"+t.tag),e.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),e.send()}},route.start(!0)}),riot.tag2("catalog",'<material-card ref="catalog-tag" class="catalog"> <div class="material-card-title-action"> <h2>Repositories of {registryUI.name()}</h2> </div> <div hide="{registryUI.catalog.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <ul class="list highlight" show="{registryUI.catalog.loadend}"> <li each="{item in registryUI.catalog.repositories}" onclick="registryUI.catalog.go(\'{item}\');"> <span> <i class="material-icons">send</i> {item} </span> </li> </ul> </material-card>',"","",function(e){registryUI.catalog.instance=this,registryUI.catalog.display=function(){registryUI.catalog.repositories=[];var e=new Http;e.addEventListener("load",function(){registryUI.catalog.repositories=[],200==this.status?(registryUI.catalog.repositories=JSON.parse(this.responseText).repositories||[],registryUI.catalog.repositories.sort()):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText)}),e.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.catalog.repositories=[]}),e.addEventListener("loadend",function(){registryUI.catalog.loadend=!0,registryUI.catalog.instance.update()}),e.open("GET",registryUI.url()+"/v2/_catalog?n=100000"),e.send()},registryUI.catalog.go=function(e){route("taglist/"+e)},registryUI.catalog.display()}),riot.tag2("change",'<material-popup> <div class="material-popup-title">Change your Server ?</div> <div class="material-popup-content"> <div class="select-padding"> <select class="mdl-textfield__input mdl-textfield__select" name="server-list" ref="server-list"> <option each="{url in registryUI.getRegistryServer()}" riot-value="{url}">{url}</option> </select> </div> </div> <div class="material-popup-action"> <material-button class="dialog-button" waves-color="rgba(158,158,158,.4)" onclick="registryUI.changeTag.change();">Change</material-button> <material-button class="dialog-button" waves-color="rgba(158,158,158,.4)" onclick="registryUI.changeTag.close();">Cancel</material-button> </div> </material-popup>',"","",function(e){registryUI.changeTag=registryUI.changeTag||{},this.one("mount",function(){registryUI.changeTag.dialog=this.tags["material-popup"],registryUI.changeTag.dialog.getServerUrl=function(){return this.refs["server-list"]?this.refs["server-list"].value:""},registryUI.changeTag.dialog.on("updated",function(){this.refs["server-list"]&&(this.refs["server-list"].value=registryUI.url())})}),registryUI.changeTag.show=function(){registryUI.changeTag.dialog.open()},registryUI.changeTag.change=function(){registryUI.changeTag.dialog.getServerUrl().length>0&&registryUI.changeServer(registryUI.changeTag.dialog.getServerUrl()),registryUI.home(),registryUI.changeTag.dialog.close()},registryUI.changeTag.close=function(){registryUI.changeTag.dialog.close()}}),riot.tag2("copy-to-clipboard",'<input ref="input" style="display: none; width: 1px; height: 1px;" riot-value="{this.dockerCmd}"> <a onclick="{this.copy}" title="Copy pull command."> <i class="material-icons">content_copy</i> </a>',"","",function(e){this.dockerCmd="docker pull "+registryUI.cleanName()+"/"+e.image.name+":"+e.image.tag,this.copy=function(){var e=this.refs.input;e.style.display="block",e.select(),document.execCommand("copy"),e.style.display="none",registryUI.snackbar("`"+this.dockerCmd+"` has been copied to clipboard.")}}),riot.tag2("image-size",'<div title="Compressed size of your image.">{this.bytesToSize(this.size)}</div>',"","",function(e){var t=this;this.bytesToSize=function(e){if(null==e||isNaN(e))return"?";if(0==e)return"0 Byte";var t=parseInt(Math.floor(Math.log(e)/Math.log(1024)));return Math.ceil(e/Math.pow(1024,t))+" "+["Bytes","KB","MB","GB","TB"][t]},e.image.on("size",function(e){t.size=e,t.update()}),e.image.trigger("get-size")}),riot.tag2("image-tag",'<div title="{this.sha256}">{opts.image.tag}</div>',"","",function(e){var t=this;e.image.on("sha256",function(e){t.sha256=e.substring(0,19),t.update()}),e.image.trigger("get-sha256")}),riot.tag2("menu",'<material-button id="menu-control-button" onclick="registryUI.menuTag.toggle();" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600"> <i class="material-icons">more_vert</i> </material-button> <material-dropdown id="menu-control-dropdown"> <p onclick="registryUI.addTag.show(); registryUI.menuTag.close();">Add URL</p> <p onclick="registryUI.changeTag.show(); registryUI.menuTag.close();">Change URL</p> <p onclick="registryUI.removeTag.show(); registryUI.menuTag.close();">Remove URL</p> </material-dropdown> <div class="overlay" onclick="registryUI.menuTag.close();" show="{registryUI.menuTag.isOpen && registryUI.menuTag.isOpen()}"></div>',"","",function(e){registryUI.menuTag=registryUI.menuTag||{},registryUI.menuTag.update=this.update,this.one("mount",function(e){var t=this;registryUI.menuTag.close=function(){t.tags["material-dropdown"].close(),t.update()},registryUI.menuTag.isOpen=function(){return t.tags["material-dropdown"].opened},registryUI.menuTag.toggle=function(){t.tags["material-dropdown"].opened?t.tags["material-dropdown"].close():t.tags["material-dropdown"].open(),t.update()}})}),riot.tag2("remove-image",'<a href="#" title="This will delete the image." onclick="registryUI.removeImage.remove(\'{opts.image.name}\', \'{opts.image.tag}\')"> <i class="material-icons">delete</i> </a>',"","",function(e){registryUI.removeImage=registryUI.removeImage||{},registryUI.removeImage.remove=function(e,t){var r=new Http;r.addEventListener("loadend",function(){if(registryUI.taglist.refresh(),200==this.status){if(!this.hasHeader("Docker-Content-Digest"))return void registryUI.errorSnackbar("You need to add Access-Control-Expose-Headers: ['Docker-Content-Digest'] in your server configuration.");var r=this.getResponseHeader("Docker-Content-Digest"),i=new Http;i.addEventListener("loadend",function(){200==this.status||202==this.status?(registryUI.taglist.refresh(),registryUI.snackbar("Deleting "+e+":"+t+" image. Run `registry garbage-collect config.yml` on your registry")):404==this.status?registryUI.errorSnackbar("Digest not found"):registryUI.snackbar(this.responseText)}),i.open("DELETE",registryUI.url()+"/v2/"+e+"/manifests/"+r),i.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),i.addEventListener("error",function(){registryUI.errorSnackbar("An error occurred when deleting image. Check if your server accept DELETE methods Access-Control-Allow-Methods: ['DELETE'].")}),i.send()}else 404==this.status?registryUI.errorSnackbar("Manifest for "+e+":"+t+" not found"):registryUI.snackbar(this.responseText)}),r.open("HEAD",registryUI.url()+"/v2/"+e+"/manifests/"+t),r.setRequestHeader("Accept","application/vnd.docker.distribution.manifest.v2+json"),r.send()}}),riot.tag2("remove",'<material-popup> <div class="material-popup-title">Remove your Registry Server ?</div> <div class="material-popup-content"> <ul class="list"> <li each="{url in registryUI.getRegistryServer()}"> <span> <a href="#" onclick="registryUI.removeTag.removeUrl(\'{url}\');"> <i class="material-icons">delete</i> </a> <span class="url">{url}</span> </span> </li> </ul> </div> <div class="material-popup-action"> <material-button class="dialog-button" waves-color="rgba(158,158,158,.4)" onclick="registryUI.removeTag.close();">Close</material-button> </div> </material-popup>',"","",function(e){registryUI.removeTag=registryUI.removeTag||{},registryUI.removeTag.update=this.update,registryUI.removeTag.removeUrl=function(e){registryUI.removeServer(e),registryUI.removeTag.close()},registryUI.removeTag.close=function(){registryUI.removeTag.dialog.close(),registryUI.removeTag.update()},registryUI.removeTag.show=function(){registryUI.removeTag.dialog.open()},this.one("mount",function(){registryUI.removeTag.dialog=this.tags["material-popup"]})}),riot.tag2("taglist",'<material-card ref="taglist-tag" class="taglist"> <div class="material-card-title-action"> <a href="#!" onclick="registryUI.home();"> <i class="material-icons">arrow_back</i> </a> <h2>Tags of {registryUI.name() + \'/\' + registryUI.taglist.name}</h2> </div> <div hide="{registryUI.taglist.loadend}" class="spinner-wrapper"> <material-spinner></material-spinner> </div> <table show="{registryUI.taglist.loadend}" style="border: none;"> <thead> <tr> <th class="material-card-th-left">Repository</th> <th></th> <th>Size</th> <th class="{registryUI.taglist.asc ? \'material-card-th-sorted-ascending\' : \'material-card-th-sorted-descending\'}" onclick="registryUI.taglist.reverse();">Tag</th> <th show="{registryUI.isImageRemoveActivated}"></th> </tr> </thead> <tbody> <tr each="{image in registryUI.taglist.tags}"> <td class="material-card-th-left">{image.name}</td> <td class="copy-to-clipboard"> <copy-to-clipboard image="{image}"></copy-to-clipboard> </td> <td><image-size image="{image}"></image-size></td> <td><image-tag image="{image}"></image-tag></td> <td show="{registryUI.isImageRemoveActivated}"> <remove-image image="{image}"></remove-image> </td> </tr> </tbody> </table> </material-card>',"","",function(e){registryUI.taglist.instance=this,registryUI.taglist.display=function(){if(registryUI.taglist.tags=[],"taglist"==route.routeName){var e=new Http;registryUI.taglist.instance.update(),e.addEventListener("load",function(){registryUI.taglist.tags=[],200==this.status?(registryUI.taglist.tags=JSON.parse(this.responseText).tags||[],registryUI.taglist.tags=registryUI.taglist.tags.map(function(e){return new registryUI.DockerImage(registryUI.taglist.name,e)}).sort(registryUI.DockerImage.compare)):404==this.status?registryUI.snackbar("Server not found",!0):registryUI.snackbar(this.responseText,!0)}),e.addEventListener("error",function(){registryUI.snackbar(this.getErrorMessage(),!0),registryUI.taglist.tags=[]}),e.addEventListener("loadend",function(){registryUI.taglist.loadend=!0,registryUI.taglist.instance.update()}),e.open("GET",registryUI.url()+"/v2/"+registryUI.taglist.name+"/tags/list"),e.send(),registryUI.taglist.asc=!0}},registryUI.taglist.display(),registryUI.taglist.instance.update(),registryUI.taglist.reverse=function(){registryUI.taglist.asc?(registryUI.taglist.tags.reverse(),registryUI.taglist.asc=!1):(registryUI.taglist.tags.sort(registryUI.DockerImage.compare),registryUI.taglist.asc=!0),registryUI.taglist.instance.update()},registryUI.taglist.refresh=function(){route(registryUI.taglist.name)}});