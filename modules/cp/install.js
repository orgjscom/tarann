module.exports=function(n,e,i){var t=require("async"),o={name:"cp",version:"0.5.170",collections:function(e){t.series([function(e){n.createCollection("updates",function(n,i){return n?e(n):void e()})}],function(n){return n?e(n):void e()})},indexes:function(n){n()},defaults:function(n){n()},misc:function(n){n()},uninstall:function(n){n()}};return o};