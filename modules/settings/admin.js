module.exports=function(e){var t={oname:1,ovalue:1,lang:1},n="oname",s=1,o=30,i=e.get("express").Router(),r=require("path"),a=require("mongodb").ObjectID,d=new(require("i18n-2"))({locales:e.get("config").locales.avail,directory:r.join(__dirname,"lang"),extension:".js",devMode:e.get("config").locales.dev_mode});i.get_module_name=function(e){return d.setLocale(e.session.current_locale),d.__("module_name")},i.get("/",function(t,n){if(d.setLocale(t.session.current_locale),!t.session.auth||t.session.auth.status<2)return t.session.auth_redirect_host=t.get("host"),t.session.auth_redirect="/cp/settings",void n.redirect(303,"/auth/cp?rnd="+Math.random().toString().replace(".",""));var s=e.get("renderer").render_file(r.join(__dirname,"views"),"settings_control",{lang:d,locales:JSON.stringify(e.get("config").locales.avail)},t);e.get("cp").render(t,n,{body:s,css:'<link rel="stylesheet" href="/modules/settings/css/main.css">'},d,"settings",t.session.auth)}),i.post("/data/list",function(i,r){d.setLocale(i.session.current_locale);var a={ipp:o},u=i.body.skip,l=i.body.query,f=i.body.sort_mode,g=i.body.sort_cell;if("undefined"!=typeof u&&!u.match(/^[0-9]{1,10}$/))return a.status=0,a.error=d.__("invalid_query"),void r.send(JSON.stringify(a));if("undefined"!=typeof l&&!l.match(/^[\w\sА-Яа-я0-9_\-\.]{3,40}$/))return a.status=0,a.error=d.__("invalid_query"),void r.send(JSON.stringify(a));if(!i.session.auth||i.session.auth.status<2)return a.status=0,a.error=d.__("unauth"),void r.send(JSON.stringify(a));var c={};c[n]=s,"undefined"!=typeof g&&"undefined"!=typeof t[g]&&(c={},c[g]=1,"undefined"!=typeof f&&-1==f&&(c[g]=-1)),a.items=[];var _={};l&&(_={$or:[{oname:new RegExp(l,"i")},{ovalue:new RegExp(l,"i")}]}),e.get("mongodb").collection("settings").find(_).count(function(t,n){!t&&n>0?(a.total=n,e.get("mongodb").collection("settings").find(_,{skip:u,limit:o}).sort(c).toArray(function(e,t){if("undefined"!=typeof t&&!e)for(var n=0;n<t.length;n++){var s=[];s.push(t[n]._id),s.push(t[n].oname),s.push(t[n].ovalue),s.push(t[n].olang),a.items.push(s)}a.status=1,r.send(JSON.stringify(a))})):(a.status=1,a.total="0",r.send(JSON.stringify(a)))})}),i.post("/data/load",function(t,n){d.setLocale(t.session.current_locale);var s={},o=t.body.id;return"undefined"!=typeof o&&o.match(/^[a-f0-9]{24}$/)?!t.session.auth||t.session.auth.status<2?(s.status=0,s.error=d.__("unauth"),void n.send(JSON.stringify(s))):(s.data={},void e.get("mongodb").collection("settings").find({_id:new a(o)},{limit:1}).toArray(function(e,t){"undefined"==typeof t||e||t.length>0&&(s.data=t[0]),s.status=1,n.send(JSON.stringify(s))})):(s.status=0,s.error=d.__("invalid_query"),void n.send(JSON.stringify(s)))}),i.post("/data/save",function(t,n){d.setLocale(t.session.current_locale);var s={err_fields:[],status:1};if(!t.session.auth||t.session.auth.status<2)return s.status=0,s.error=d.__("unauth"),void n.send(JSON.stringify(s));var o=t.body.oname,i=t.body.ovalue,r=t.body.olang,u=t.body.id;if("undefined"!=typeof u&&u&&!u.match(/^[a-f0-9]{24}$/))return s.status=0,s.error=d.__("invalid_query"),void n.send(JSON.stringify(s));o.match(/^[A-Za-z0-9_\-]{3,20}$/)||(s.status=0,s.err_fields.push("oname")),o=o.toLowerCase(),i.match(/^.{1,255}$/)||(s.status=0,s.err_fields.push("ovalue"));for(var l="",f=0;f<e.get("config").locales.avail.length;f++)r==e.get("config").locales.avail[f]&&(l=e.get("config").locales.avail[f]);if(r=l,0===s.status)return void n.send(JSON.stringify(s));if(u)e.get("mongodb").collection("settings").find({oname:o,olang:r,_id:{$ne:new a(u)}},{limit:1}).toArray(function(t,l){return"undefined"!=typeof l&&l.length>0||t?(s.status=0,s.error=d.__("option_exists"),s.err_fields.push("oname"),void n.send(JSON.stringify(s))):void e.get("mongodb").collection("settings").find({_id:new a(u)},{limit:1}).toArray(function(t,l){if("undefined"==typeof l||t)s.status=0,s.error=d.__("id_not_found"),n.send(JSON.stringify(s));else if(l.length>0){var f={oname:o,ovalue:i,olang:r};return void e.get("mongodb").collection("settings").update({_id:new a(u)},f,function(){s.status=1,n.send(JSON.stringify(s))})}})});else{e.get("mongodb").collection("settings").find({oname:o,olang:r},{limit:1}).toArray(function(t,a){return"undefined"!=typeof a&&a.length>0||t?(s.status=0,s.error=d.__("option_exists"),s.err_fields.push("oname"),void n.send(JSON.stringify(s))):void e.get("mongodb").collection("settings").insert({oname:o,ovalue:i,olang:r},function(){s.status=1,n.send(JSON.stringify(s))})})}}),i.post("/data/delete",function(t,n){d.setLocale(t.session.current_locale);var s={status:1};if(!t.session.auth||t.session.auth.status<2)return s.status=0,s.error=d.__("unauth"),void n.send(JSON.stringify(s));var o=t.body.ids;if("object"!=typeof o||o.length<1)return s.status=0,s.error=d.__("invalid_query"),void n.send(JSON.stringify(s));for(var i=0;i<o.length;i++)o[i].match(/^[a-f0-9]{24}$/)&&e.get("mongodb").collection("settings").remove({_id:new a(o[i])},u);n.send(JSON.stringify(s))});var u=function(){};return i};