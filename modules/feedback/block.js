var _timestamp_settings_query={},feedback_cache={},gaikan=require("gaikan"),crypto=require("crypto"),cache_timeout=6e4;module.exports=function(e){var i=e.get("config").locales.avail,a=require("path"),t=new(require("i18n-2"))({locales:e.get("config").locales.avail,directory:a.join(__dirname,"lang"),extension:".js",devMode:e.get("config").locales.dev_mode}),n=require("fs"),r=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_feedback.html")?a.join(__dirname,"views")+"/custom_feedback.html":a.join(__dirname,"views")+"/feedback.html"),s=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_field_text.html")?a.join(__dirname,"views")+"/custom_field_text.html":a.join(__dirname,"views")+"/field_text.html"),l=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_field_textarea.html")?a.join(__dirname,"views")+"/custom_field_textarea.html":a.join(__dirname,"views")+"/field_textarea.html"),o=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_field_select.html")?a.join(__dirname,"views")+"/custom_field_select.html":a.join(__dirname,"views")+"/field_select.html"),_=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_field_select_option.html")?a.join(__dirname,"views")+"/custom_field_select_option.html":a.join(__dirname,"views")+"/field_select_option.html"),c=gaikan.compileFromFile(n.existsSync(a.join(__dirname,"views")+"/custom_field_asterisk.html")?a.join(__dirname,"views")+"/custom_field_asterisk.html":a.join(__dirname,"views")+"/field_asterisk.html"),m={data_sync:function(a){var n="";a&&(a=a.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\[/g,"{").replace(/\]/g,"}").replace(/#/g,",").replace(/\(\(/g,"[").replace(/\)\)/g,"]"),a="{"+a+"}");try{a=JSON.parse(a)}catch(m){return"Feedback module error: "+m}var d=a.lang||i[0],v=a.data;if(t.setLocale(d),!(v instanceof Array))return"Invalid form data";var f=JSON.stringify(v),g=crypto.createHash("md5").update(e.get("config").salt+f+d).digest("hex");if(_timestamp_settings_query[g]&&Date.now()-_timestamp_settings_query[g]<=cache_timeout&&feedback_cache[g])return feedback_cache[g];for(var u=0;u<v.length;u++)if(v[u].type){var p={};if(v[u].id&&(p.id=v[u].id),v[u]["label_"+d]&&(p.label=v[u]["label_"+d]),v[u]["class"]&&(p["class"]=" "+v[u]["class"]),v[u].mandatory&&(p.asterisk=c(gaikan,void 0,void 0)),("text"==v[u].type||"email"==v[u].type)&&(n+=s(gaikan,p,void 0)),"textarea"==v[u].type&&(n+=l(gaikan,p,void 0)),"select"==v[u].type){var h=v[u].values;if(!(h&&h instanceof Array))return"Invalid values for select: "+v[u].id;p.options="";for(var k=0;k<h.length;k++)p.options+=_(gaikan,{value:h[k]["value_"+d]},void 0);n+=o(gaikan,p,void 0)}}var y="b64";"captcha_gm"==e.get("config").captcha&&(y="png");var w=r(gaikan,{fields:n,form_data:f,current_lang:d,form_checksum:g,captcha:y,lang:t},void 0);return feedback_cache[g]=w,_timestamp_settings_query[g]=Date.now(),w}};return m};