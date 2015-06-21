module.exports=function(e){var t={order_id:1,item_id:1,order_timestamp:1,order_status:1,sum_total:1},s="order_timestamp",r=-1,o=30,i=e.get("express").Router(),n=require("mongodb").ObjectID,a=require("gaikan"),d=require("path"),_=require("async"),u=e.get("mailer"),l=require("fs"),c=require("merge"),h=new(require("i18n-2"))({locales:e.get("config").locales.avail,directory:d.join(__dirname,"lang"),extension:".js",devMode:e.get("config").locales.dev_mode}),p=["AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","AN","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","GS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"],g=a.compileFromFile(l.existsSync(d.join(__dirname,"views")+"/custom_parts_select_option.html")?d.join(__dirname,"views")+"/custom_parts_select_option.html":d.join(__dirname,"views")+"/parts_select_option.html");i.get_module_name=function(e){return h.setLocale(e.session.current_locale),h.__("module_name")},i.get("/",function(t,s){return h.setLocale(t.session.current_locale),!t.session.auth||t.session.auth.status<2?(t.session.auth_redirect_host=t.get("host"),t.session.auth_redirect="/cp/catalog_orders",void s.redirect(303,"/auth/cp?rnd="+Math.random().toString().replace(".",""))):void e.get("mongodb").collection("warehouse_conf").find({$or:[{conf:"ship"},{conf:"curs"}]}).toArray(function(r,o){var i=[],n=[];if(!r&&o&&o.length)for(var _=0;_<o.length;_++){if("ship"==o[_].conf&&o[_].data)try{i=JSON.parse(o[_].data)}catch(u){}if("curs"==o[_].conf&&o[_].data)try{n=JSON.parse(o[_].data)}catch(u){}}for(var l=[],c=0;c<i.length;c++)l.push({id:i[c].id,val:i[c][t.session.current_locale]});for(var f="",m=0;m<p.length;m++)f+=g(a,{val:p[m],text:h.__("country_list")[m]},void 0);var y=e.get("renderer").render_file(d.join(__dirname,"views"),"catalog_orders_control",{lang:h,locales:JSON.stringify(e.get("config").locales.avail),order_status_list:JSON.stringify(h.__("order_status_list")),shipping_methods:JSON.stringify(l),country_list_html:f,auth_user_id:t.session.auth._id},t);e.get("cp").render(t,s,{body:y,css:'<link rel="stylesheet" href="/modules/catalog_orders/css/main.css">'},h,"catalog_orders",t.session.auth)})}),i.post("/data/list",function(i,n){h.setLocale(i.session.current_locale);var a=require("moment");a.locale(i.session.current_locale);var d={ipp:o},_=i.body.skip,u=i.body.query,l=i.body.sort_mode,c=i.body.sort_cell;if("undefined"!=typeof _&&!_.match(/^[0-9]{1,10}$/))return d.status=0,d.error=h.__("invalid_query"),void n.send(JSON.stringify(d));if("undefined"!=typeof u&&!u.match(/^[\w\sА-Яа-я0-9_\-\.]{3,40}$/))return d.status=0,d.error=h.__("invalid_query"),void n.send(JSON.stringify(d));if(!i.session.auth||i.session.auth.status<2)return d.status=0,d.error=h.__("unauth"),void n.send(JSON.stringify(d));var p={};p[s]=r,"undefined"!=typeof c&&"undefined"!=typeof t[c]&&(p={},p[c]=1,"undefined"!=typeof l&&-1==l&&(p[c]=-1)),d.items=[];var g={};u&&(g={$or:[{order_id:new RegExp(u,"i")},{ship_method:new RegExp(u,"i")}]}),e.get("mongodb").collection("warehouse_orders").find(g).count(function(t,s){!t&&s>0?(d.total=s,e.get("mongodb").collection("warehouse_orders").find(g,{skip:_,limit:o}).sort(p).toArray(function(e,t){if("undefined"!=typeof t&&!e)for(var s=h.__("order_status_list"),r=0;r<t.length;r++){var o=[];o.push(t[r]._id),o.push(t[r].order_id),o.push(a(t[r].order_timestamp).format("L LT")),o.push(s[t[r].order_status]),o.push(t[r].sum_total),d.items.push(o)}d.status=1,n.send(JSON.stringify(d))})):(d.status=1,d.total="0",n.send(JSON.stringify(d)))})}),i.post("/data/load",function(t,s){h.setLocale(t.session.current_locale);var r=require("moment");r.locale(t.session.current_locale);var o={},i=t.body.id;return"undefined"!=typeof i&&i.match(/^[a-f0-9]{24}$/)?!t.session.auth||t.session.auth.status<2?(o.status=0,o.error=h.__("unauth"),void s.send(JSON.stringify(o))):(o.data={},void e.get("mongodb").collection("warehouse_orders").find({_id:new n(i)},{limit:1}).toArray(function(a,d){o.data=[],"undefined"==typeof d||a||d.length>0&&(o.data=d[0]),o.data&&(o.data.order_timestamp=r(o.data.order_timestamp).format("L LT"));var _=[];if(o.data.cart_data)for(var u in o.data.cart_data)_.push({pfilename:u});_.length?e.get("mongodb").collection("warehouse").find({$or:_}).toArray(function(r,a){if(o.data.warehouse_titles={},a)for(var _=0;_<a.length;_++)a[_].pdata[t.session.current_locale]&&(a[_]=c(a[_],a[_].pdata[t.session.current_locale])),o.data.warehouse_titles[a[_].pfilename]=a[_].ptitle;d[0].locked_by&&d[0].locked_by!=t.session.auth._id?e.get("mongodb").collection("users").find({_id:new n(d[0].locked_by)}).toArray(function(e,t){var r=d[0].locked_by;return!e&&t&&t.length&&(r=t[0].username),o.status=0,o.error=h.__("locked"),o.locked_by=r,s.send(JSON.stringify(o))}):e.get("mongodb").collection("warehouse_orders").update({_id:new n(i)},{$set:{locked_by:t.session.auth._id}},function(){o.status=1,s.send(JSON.stringify(o))})}):(o.status=1,s.send(JSON.stringify(o)))})):(o.status=0,o.error=h.__("invalid_query"),void s.send(JSON.stringify(o)))}),i.post("/data/unlock",function(t,s){h.setLocale(t.session.current_locale);var r=t.body.id;return!t.session.auth||t.session.auth.status<2||!r||!r.match(/^[a-f0-9]{24}$/)?s.send(JSON.stringify({status:0})):void e.get("mongodb").collection("warehouse_orders").update({_id:new n(r)},{$set:{locked_by:void 0}},function(){return s.send(JSON.stringify({status:1}))})}),i.post("/data/sku",function(t,s){h.setLocale(t.session.current_locale);var r=t.body.sku;return!t.session.auth||t.session.auth.status<2||!r.match(/^[A-Za-z0-9_\-\.]{1,80}$/)?s.send(JSON.stringify({status:0})):void e.get("mongodb").collection("warehouse").find({pfilename:r}).toArray(function(e,r){var o=h.__("unknown_sku");return!e&&r&&r.length&&(r[0].pdata[t.session.current_locale]&&(r[0]=c(r[0],r[0].pdata[t.session.current_locale])),o=r[0].ptitle),s.send(JSON.stringify({status:1,title:o}))})}),i.post("/data/save",function(t,s){h.setLocale(t.session.current_locale);var r={err_fields:[],status:1};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=h.__("unauth"),void s.send(JSON.stringify(r));var o=t.body.id,i=parseInt(t.body.order_status),a=parseFloat(t.body.sum_subtotal)||0,_=parseFloat(t.body.sum_total)||0,l=t.body.shipping_method,c=t.body.shipping_address||{},p=t.body.ship_comment,g=t.body.ship_track,f=t.body.cart_data||[];return o&&o.match(/^[a-f0-9]{24}$/)?void e.get("mongodb").collection("warehouse_conf").find({$or:[{conf:"ship"},{conf:"curs"}]}).toArray(function(m,y){var v=[];if(!m&&y&&y.length)for(var S=0;S<y.length;S++)if("ship"==y[S].conf&&y[S].data)try{v=JSON.parse(y[S].data)}catch(b){}for(var N=!1,O=0;O<v.length;O++)v[O].id==l&&(N=!0);if(N||(r.status=0,r.err_fields.push("shipping_method")),(!a||0>a)&&(r.status=0,r.err_fields.push("sum_subtotal")),(!_||0>_)&&(r.status=0,r.err_fields.push("sum_total")),(void 0===typeof i||0>i||i>4)&&(r.status=0,r.err_fields.push("order_status")),p&&p.length>1024&&(r.status=0,r.err_fields.push("ship_comment")),0===r.status)return s.send(JSON.stringify(r));var w={ship_name:"",ship_street:"",ship_city:"",ship_region:"",ship_country:"",ship_zip:"",ship_phone:""};c.ship_name&&c.ship_name.length&&c.ship_name.length<81&&(w.ship_name=c.ship_name.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;")),c.ship_street&&c.ship_street.length&&c.ship_street.length<121&&(w.ship_street=c.ship_street.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;")),c.ship_city&&c.ship_city.length&&c.ship_city.length<121&&(w.ship_city=c.ship_city.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;")),c.ship_region&&c.ship_region.length&&c.ship_region.length<121&&(w.ship_region=c.ship_region.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;")),c.ship_country&&c.ship_country.match(/^[A-Z]{2}$/)&&(w.ship_country=c.ship_country),c.ship_zip&&c.ship_zip.match(/^[0-9]{5,6}$/)&&(w.ship_zip=c.ship_zip),c.ship_phone&&c.ship_phone.match(/^[0-9\+]{1,40}$/)&&(w.ship_phone=c.ship_phone),p=p&&p.length<1025?p.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;").replace(/\n/g," "):"",g=g&&g.length<81?g.replace(/</g,"").replace(/>/g,"").replace(/\"/g,"&quot;").replace(/\n/g," "):"";var A={};for(var M in f)M&&(M=M.replace(/\s/g,"")),f[M]&&(f[M]=f[M].replace(/\s/g,"")),M.match(/^[A-Za-z0-9_\-\.]{1,80}$/)&&(A[M]=parseInt(f[M])||1);e.get("mongodb").collection("warehouse_orders").find({_id:new n(o)},{limit:1}).toArray(function(c,f){return!c&&f&&f.length?void(f[0]&&e.get("mongodb").collection("users").find({_id:new n(f[0].user_id)}).toArray(function(c,m){e.get("mongodb").collection("warehouse_orders").update({_id:new n(o)},{$set:{order_status:i,cart_data:A,ship_method:l,sum_subtotal:a,sum_total:_,shipping_address:w,ship_comment:p,ship_track:g,locked_by:void 0}},function(){if(f[0].order_status!=i&&!c&&m&&m.length&&m[0].email){var n={lang:h,order_id:f[0].order_id,order_status_old:h.__("order_status_list")[f[0].order_status],order_status:h.__("order_status_list")[i],ship_track:g||h.__("no_tracking_number_yet"),view_url:e.get("config").protocol+"://"+t.get("host")+"/catalog/orders?mode=view&order_id="+o,subj:h.__("your_order_id")+" "+f[0].order_id};u.send(m[0].email,h.__("your_order_id")+" "+f[0].order_id+" ("+e.get("settings").site_title+")",d.join(__dirname,"views"),"mail_statuschange_html","mail_statuschange_txt",n,t,function(){s.send(JSON.stringify(r))})}else s.send(JSON.stringify(r))})})):(r.status=0,r.error=h.__("invalid_query"),s.send(JSON.stringify(r)))})}):(r.status=0,r.error=h.__("invalid_query"),s.send(JSON.stringify(r)))}),i.post("/data/cancel",function(t,s){if(h.setLocale(t.session.current_locale),!t.session.auth||t.session.auth.status<2)return rep.status=0,rep.error=h.__("unauth"),void s.send(JSON.stringify(rep));var r=t.body.id;return r&&r.match(/^[a-f0-9]{24}$/)?void e.get("mongodb").collection("warehouse_orders").find({_id:new n(r)},{limit:1}).toArray(function(o,i){if(o||!i||!i.length)return s.send({status:0,error:h.__("invalid_query")});var a=i[0].cart_data,l=[];for(var c in a)l.push(c);_.each(l,function(t,s){e.get("mongodb").collection("warehouse").update({pfilename:t,pamount:{$ne:-1}},{$inc:{pamount:a[t]}},function(e){s(e)})},function(o){e.get("mongodb").collection("warehouse_orders").update({_id:new n(r)},{$set:{order_status:4}},function(){e.get("mongodb").collection("users").find({_id:new n(i[0].user_id)}).toArray(function(o,n){if(!o&&n&&n.length&&n[0].email){var a={lang:h,order_id:i[0].order_id,order_status_old:h.__("order_status_list")[i[0].order_status],order_status:h.__("order_status_list")[4],ship_track:i[0].ship_track||h.__("no_tracking_number_yet"),view_url:e.get("config").protocol+"://"+t.get("host")+"/catalog/orders?mode=view&order_id="+r,subj:h.__("your_order_id")+" "+i[0].order_id};return u.send(n[0].email,h.__("your_order_id")+" "+i[0].order_id+" ("+e.get("settings").site_title+")",d.join(__dirname,"views"),"mail_statuschange_html","mail_statuschange_txt",a,t),s.send({status:1})}})})})}):s.send({status:0,error:h.__("invalid_query")})}),i.post("/data/delete",function(t,s){h.setLocale(t.session.current_locale);var r={status:1};if(!t.session.auth||t.session.auth.status<2)return r.status=0,r.error=h.__("unauth"),void s.send(JSON.stringify(r));var o=t.body.ids;if("object"!=typeof o||o.length<1)return r.status=0,r.error=h.__("invalid_query"),void s.send(JSON.stringify(r));for(var i=0;i<o.length;i++)o[i].match(/^[a-f0-9]{24}$/)&&e.get("mongodb").collection("warehouse_orders").remove({_id:new n(o[i])},f);s.send(JSON.stringify(r))});var f=function(){};return i};