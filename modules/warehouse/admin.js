module.exports=function(e){var t,a={pcategory:1,pfilename:1,plock:1,ptitle:1},r="pcategory",i=1,s=30,n=e.get("express").Router(),o=require("path"),u=require("mongodb").ObjectID,c=new(require("i18n-2"))({locales:e.get("config").locales.avail,directory:o.join(__dirname,"lang"),extension:".js",devMode:e.get("config").locales.dev_mode}),d=e.get("parser"),l=require("async"),p=require("util"),g=require("crypto"),f=require("fs-extra");e.get("config").graphicsmagick&&(t=require("gm")),n.get_module_name=function(e){return c.setLocale(e.session.current_locale),c.__("module_name")},n.get("/",function(t,a){return c.setLocale(t.session.current_locale),!t.session.auth||t.session.auth.status<2?(t.session.auth_redirect_host=t.get("host"),t.session.auth_redirect="/cp/warehouse",void a.redirect(303,"/auth/cp?rnd="+Math.random().toString().replace(".",""))):void e.get("mongodb").collection("warehouse_conf").find({$or:[{conf:"items"},{conf:"collections"},{conf:"curs"}]}).toArray(function(r,i){var s=[],n=[],u=[];if(!r&&i&&i.length)for(var d=0;d<i.length;d++){if("items"==i[d].conf&&i[d].data)try{s=JSON.parse(i[d].data)}catch(l){}if("collections"==i[d].conf&&i[d].data)try{n=JSON.parse(i[d].data)}catch(l){}if("curs"==i[d].conf&&i[d].data)try{u=JSON.parse(i[d].data)}catch(l){}}e.get("mongodb").collection("warehouse_categories").find({oname:"categories_json"},{limit:1}).toArray(function(r,i){var d;d=i&&i.length&&i[0].ovalue?i[0].ovalue:'[{"id":"j1_1","text":"/","data":null,"parent":"#","type":"root"}]';var l=e.get("renderer").render_file(o.join(__dirname,"views"),"warehouse_control",{lang:c,categories:d,auth:t.session.auth,locales:JSON.stringify(e.get("config").locales.avail),layouts:JSON.stringify(e.get("config").layouts),current_locale:t.session.current_locale,whitems:JSON.stringify(s),whcollections:JSON.stringify(n),whcurs:JSON.stringify(u)},t);e.get("cp").render(t,a,{body:l,css:'<link rel="stylesheet" href="/modules/warehouse/css/main.css"><link rel="stylesheet" href="/js/jstree/theme/style.min.css">'},c,"warehouse",t.session.auth)})})}),n.post("/data/list",function(t,n){c.setLocale(t.session.current_locale);var o={ipp:s},u=t.body.skip,d=t.body.query,l=t.body.sort_mode,p=t.body.sort_cell;if("undefined"!=typeof u&&!u.match(/^[0-9]{1,10}$/))return o.status=0,o.error=c.__("invalid_query"),n.send(JSON.stringify(o));if("undefined"!=typeof d&&!d.match(/^[\w\sА-Яа-я0-9_\-\.]{3,40}$/))return o.status=0,o.error=c.__("invalid_query"),n.send(JSON.stringify(o));if(!t.session.auth||t.session.auth.status<2)return o.status=0,o.error=c.__("unauth"),n.send(JSON.stringify(o));var g={};g[r]=i,a&&a[p]&&(g={},g[p]=1,"undefined"!=typeof l&&-1==l&&(g[p]=-1)),o.items=[];var f={};if(d){f={$or:[{pfilename:new RegExp(d,"i")},{pcategory:new RegExp(d,"i")}]};var _={};_["pdata."+t.session.current_locale+".ptitle"]=new RegExp(d,"i"),f.$or.push(_)}e.get("mongodb").collection("warehouse").find(f).count(function(a,r){!a&&r>0?(o.total=r,e.get("mongodb").collection("warehouse").find(f,{skip:u,limit:s}).sort(g).toArray(function(e,a){if(!e&&a&&a.length)for(var r=0;r<a.length;r++){var i=[];i.push(a[r]._id),"/"!=a[r].pcategory&&(a[r].pfilename="/"+a[r].pfilename,a[r].pfilename=a[r].pfilename.replace(/\/$/,"")),i.push(a[r].pcategory+a[r].pfilename),a[r].pdata&&a[r].pdata[t.session.current_locale]&&i.push(a[r].pdata[t.session.current_locale].ptitle),i.push(a[r].plock),o.items.push(i)}o.status=1,n.send(JSON.stringify(o))})):(o.status=1,o.total="0",n.send(JSON.stringify(o)))})}),n.post("/data/load",function(t,a){c.setLocale(t.session.current_locale);var r={},i=t.body.pid,s=t.body.unlock;if(!i||!i.match(/^[a-f0-9]{24}$/))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=c.__("unauth"),a.send(JSON.stringify(r));var n=[];l.series([function(t){e.get("mongodb").collection("warehouse").find({pfilename:""},{pcategory:1},{limit:1e3}).toArray(function(e,a){if(!e&&"undefined"!=typeof a)for(var r=0;r<a.length;r++)n.push(a[r].pcategory);t()})},function(t){s?e.get("mongodb").collection("warehouse").update({_id:new u(i)},{$set:{plock:""}},function(e){return t()}):t()},function(t){e.get("mongodb").collection("warehouse").find({_id:new u(i)}).toArray(function(e,a){return!e&&a&&a.length?(r.status=1,r.warehouse_data=a[0],r.root_pages=n,t()):(r.status=0,r.error=c.__("no_results_in_table"),t(!0))})},function(a){r.warehouse_data&&!r.warehouse_data.plock?e.get("mongodb").collection("warehouse").update({_id:new u(i)},{$set:{plock:t.session.auth.username}},function(e){return a()}):a()}],function(e){return a.send(JSON.stringify(r))})}),n.post("/data/unlock",function(t,a){c.setLocale(t.session.current_locale);var r={},i=t.body.pid;return i&&i.match(/^[a-f0-9]{24}$/)?!t.session.auth||t.session.auth.status<2?(r.status=0,r.error=c.__("unauth"),a.send(JSON.stringify(r))):void l.series([function(t){e.get("mongodb").collection("warehouse").update({_id:new u(i)},{$set:{plock:void 0}},function(e){return t()})}],function(e){return a.send(JSON.stringify(r))}):(r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r)))}),n.post("/data/save",function(t,a){c.setLocale(t.session.current_locale);var r={err_fields:[],status:1};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=c.__("unauth"),void a.send(JSON.stringify(r));var i=t.body.save_data;if(!i)return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(i._id&&!i._id.match(/^[a-f0-9]{24}$/))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(!i.pcategory_id||!i.pcategory_id.match(/^[A-Za-z0-9_\-\.]{1,20}$/))return r.status=0,r.error=c.__("invalid_folder"),a.send(JSON.stringify(r));if(!i.pfilename||!i.pfilename.match(/^[A-Za-z0-9_\-\.]{0,80}$/))return r.status=0,r.error=c.__("invalid_pfilename"),a.send(JSON.stringify(r));if(i.pimages||(i.pimages=[]),!p.isArray(i.pimages))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));for(var s=0;s<i.pimages.length;s++)if(!i.pimages[s].match(/^[a-f0-9]{32}$/))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(!i.pamount||parseInt(i.pamount)!=i.pamount||i.pamount<0)return r.status=0,r.error=c.__("invalid_amount"),a.send(JSON.stringify(r));if(i.pamount=parseInt(i.pamount),!i.pprice||parseFloat(i.pprice)!=i.pprice||i.pprice<0)return r.status=0,r.error=c.__("invalid_price"),a.send(JSON.stringify(r));if(i.pprice=parseFloat(i.pprice),!i.pweight||parseFloat(i.pweight)!=i.pweight||i.pweight<0)return r.status=0,r.error=c.__("invalid_weight"),a.send(JSON.stringify(r));if(i.pweight=parseFloat(i.pweight),!i.pcurs||!i.pcurs.match(/^[a-z0-9]{1,20}$/i))return r.status=0,r.error=c.__("invalid_price"),a.send(JSON.stringify(r));if("1"==i.pamount_unlimited?i.pamount_unlimited=1:i.pamount_unlimited=0,!i.pdata||"object"!=typeof i.pdata)return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));for(var n in i.pdata){if(i.pdata[n].pchars||(i.pdata[n].pchars=[]),!p.isArray(i.pdata[n].pchars))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));for(var o=0;o<i.pdata[n].pchars.length;o++){if(!i.pdata[n].pchars[o].id||!i.pdata[n].pchars[o].id.match(/^[a-z0-9\-_]{1,50}$/i))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));parseFloat(i.pdata[n].pchars[o].val)==i.pdata[n].pchars[o].val?i.pdata[n].pchars[o].val=parseFloat(i.pdata[n].pchars[o].val):i.pdata[n].pchars[o].val?i.pdata[n].pchars[o].val=i.pdata[n].pchars[o].val.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;"):i.pdata[n].pchars[o].val=""}if(!i.pdata[n].ptitle||i.pdata[n].ptitle.length>100)return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(!i.pdata[n].pshortdesc||i.pdata[n].pshortdesc.length>100)return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));for(var g=e.get("config").locales.avail[0],f=0;f<e.get("config").locales.avail.length;f++)i.pdata[n].plang==e.get("config").locales.avail[f]&&(g=e.get("config").locales.avail[f]);i.pdata[n].plang=g;for(var _=e.get("config").layouts["default"],h=0;h<e.get("config").layouts.avail.length;h++)i.pdata[n].playout==e.get("config").layouts.avail[h]&&(_=e.get("config").layouts.avail[h]);i.pdata[n].playout=_}var y={pfilename:i.pfilename,pcategory:i.pcategory,pcategory_id:i.pcategory_id,pimages:i.pimages,pamount:i.pamount,pamount_unlimited:i.pamount_unlimited,pprice:i.pprice,pweight:i.pweight,pcurs:i.pcurs,pdata:{}};for(var m in e.get("config").locales.avail)if(i.pdata[e.get("config").locales.avail[m]]){var v=e.get("config").locales.avail[m];y.pdata[v]={};try{y.pdata[v].ptitle=i.pdata[v].ptitle,y.pdata[v].pshortdesc=i.pdata[v].pshortdesc,y.pdata[v].pkeywords=i.pdata[v].pkeywords,y.pdata[v].pdesc=i.pdata[v].pdesc,y.pdata[v].pcontent=i.pdata[v].pcontent,y.pdata[v].pchars=i.pdata[v].pchars}catch(w){return r.status=0,r.error=c.__("invalid_query")+" ("+w+")",a.send(JSON.stringify(r))}}l.series([function(a){i._id?e.get("mongodb").collection("warehouse").find({_id:new u(i._id)},{plock:1}).toArray(function(e,i){return i&&i.length&&i[0].plock&&i[0].plock!=t.session.auth.username?(r.status=0,r.error=c.__("locked_by")+": "+i[0].plock,a(!0)):void a()}):a()},function(t){var a={pfilename:i.pfilename};i._id&&(a._id={$ne:new u(i._id)}),e.get("mongodb").collection("warehouse").find(a,{pfilename:1},{limit:1}).toArray(function(e,a){return e||a&&a.length?(r.status=0,r.error=c.__("page_exists"),t(!0)):void t()})},function(t){var a={pfilename:i.pfilename,pcategory:i.pcategory};i._id&&(a={_id:new u(i._id)}),e.get("mongodb").collection("warehouse").update(a,y,{safe:!1,upsert:!0},function(e,a){return e?t(!0):(a&&a._id&&(i._id=a._id),t())})},function(t){var a=[];for(var r in i.pdata)a.push({pr:d.words(d.html2text(i.pdata[r].pcontent),i.pdata[r].ptitle),title:i.pdata[r].ptitle,lang:r,desc:i.pdata[r].pdesc});l.eachSeries(a,function(t,a){var r={swords:t.pr.words,sdesc:t.pr.desc,stitle:t.title,slang:t.lang,item_id:i._id,surl:"/catalog/item"+(i.pcategory+"/"+i.pfilename).replace(/(\/+)/,"/").replace(/\s/g,""),space:"warehouse"};e.get("mongodb").collection("search_index").update({item_id:i._id,slang:t.lang},r,{upsert:!0,safe:!1},function(){a()})},function(e){t()})}],function(e){return a.send(JSON.stringify(r))})}),n.post("/data/delete",function(t,a){c.setLocale(t.session.current_locale);var r={status:1};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=c.__("unauth"),void a.send(JSON.stringify(r));var i=t.body.ids;if("object"!=typeof i||i.length<1)return r.status=0,r.error=c.__("invalid_query"),void a.send(JSON.stringify(r));for(var s=0;s<i.length;s++)i[s].match(/^[a-f0-9]{24}$/)&&(e.get("mongodb").collection("warehouse").remove({_id:new u(i[s])},_),e.get("mongodb").collection("search_index").remove({item_id:i[s]},_));a.send(JSON.stringify(r))}),n.post("/data/upload",function(a,r){c.setLocale(a.session.current_locale);var i={};if(!a.session.auth||a.session.auth.status<2)return i.status=0,i.error=c.__("unauth"),void r.send(JSON.stringify(i));if(!a.files||!a.files.file)return i.status=0,i.error=c.__("no_file_sent"),void r.send(JSON.stringify(i));var s=a.files.file;if(!t||"image/png"!=s.mimetype&&"image/jpeg"!=s.mimetype)return i.status=0,i.error=c.__("not_images"),void r.send(JSON.stringify(i));if(s.size>1048576*e.get("config").max_upload_file_mb)return i.status=0,i.error=c.__("file_too_big"),void r.send(JSON.stringify(i));var n=g.createHash("md5").update(s.originalname+Date.now()+Math.random()).digest("hex"),o=s.extension||"";n&&(n=n.toLowerCase()),o&&(o=o.toLowerCase());var u,d=t(e.get("config").dir.tmp+"/"+s.name);d.autoOrient(),l.series([function(e){d.size(function(t,a){t&&(i.status=0,i.error=c.__("upload_failed"),e(!0)),u=a,e()})},function(t){d.setFormat("jpeg"),u.width>=u.height?d.resize(null,800):d.resize(800,null),d.write(e.get("config").dir.storage+"/warehouse/"+n+".jpg",function(e){e&&(i.status=0,i.error=c.__("upload_failed"),t(!0)),t()})},function(t){u.width>=u.height?(d.resize(null,300),d.crop(300,300,0,0)):(d.resize(300,null),d.crop(300,300,0,0)),d.write(e.get("config").dir.storage+"/warehouse/tn_"+n+".jpg",function(e){e&&(i.status=0,i.error=c.__("upload_failed"),t(!0)),t()})}],function(t){f.unlink(e.get("config").dir.tmp+"/"+s.name,function(){return i.status=1,i.id=n,r.send(JSON.stringify(i))})})}),n.post("/data/upload/delete",function(t,a){c.setLocale(t.session.current_locale);var r={};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=c.__("unauth"),void a.send(JSON.stringify(r));if(pimages=t.body.pimages,pimages&&!p.isArray(pimages))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r));if(pimages){for(var i=0;i<pimages.length;i++)if(!pimages[i].match(/^[a-f0-9]{32}$/))return r.status=0,r.error=c.__("invalid_query"),a.send(JSON.stringify(r))}else pimages=[];l.eachSeries(pimages,function(t,a){f.unlink(e.get("config").dir.storage+"/warehouse/"+t+".jpg",function(){f.unlink(e.get("config").dir.storage+"/warehouse/tn_"+t+".jpg",function(){a()})})},function(e){return r.status=1,a.send(JSON.stringify(r))})});var _=function(){};return n.post("/data/categories/load",function(t,a){c.setLocale(t.session.current_locale);var r={status:1};return!t.session.auth||t.session.auth.status<2?(r.status=0,r.error=c.__("unauth"),void a.send(JSON.stringify(r))):void e.get("mongodb").collection("warehouse_categories").find({oname:"categories_json"},{limit:1}).toArray(function(e,t){return e?(r.status=0,r.error=c.__("cannot_load_db_data"),void a.send(JSON.stringify(r))):t&&t.length&&t[0].ovalue?(r.categories=t[0].ovalue,void a.send(JSON.stringify(r))):(r.categories='[{"id":"j1_1","text":"/","data":null,"parent":"#","type":"root"}]',void a.send(JSON.stringify(r)))})}),n.post("/data/categories/save",function(t,a){c.setLocale(t.session.current_locale);var r={status:1};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=c.__("unauth"),void a.send(JSON.stringify(r));var i=t.body.json;try{JSON.parse(i)}catch(s){return r.status=0,r.error=c.__("cannot_parse_json"),void a.send(JSON.stringify(r))}e.get("mongodb").collection("warehouse_categories").remove(function(t){t||e.get("mongodb").collection("warehouse_categories").insert({oname:"categories_json",ovalue:i},function(e){return e?(r.status=0,r.error=c.__("cannot_save_db_data"),void a.send(JSON.stringify(r))):void a.send(JSON.stringify(r))})})}),n};