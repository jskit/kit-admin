(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-81"],{"138c":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"120px"}},[a("el-form-item",[a("p",[t._v("以下功能支持自动生成 "),a("b",[t._v("场景A")]),t._v(" -> "),a("b",[t._v("场景B")]),t._v(" 的跳转链接")])]),a("el-form-item",{attrs:{label:"在哪配置"}},[a("el-radio-group",{model:{value:t.form.source,callback:function(e){t.$set(t.form,"source",e)},expression:"form.source"}},[a("el-radio",{attrs:{label:"life"}},[t._v("生活号/H5页面")]),a("el-radio",{attrs:{label:"couple"}},[t._v("拼团小程序")]),a("el-radio",{attrs:{label:"point"}},[t._v("积分小程序")]),a("el-radio",{attrs:{label:"message"}},[t._v("短信")]),a("el-radio",{attrs:{label:"tplmsg"}},[t._v("模板消息")])],1)],1),a("el-form-item",{attrs:{label:"选择页面"}},[a("el-input",{staticClass:"input-with-select",attrs:{placeholder:"如需要参数，请输入参数 如 id=xxx topic_code=xxx"},model:{value:t.form.params,callback:function(e){t.$set(t.form,"params",e)},expression:"form.params"}},[a("el-select",{attrs:{slot:"prepend",placeholder:"请选择"},slot:"prepend",model:{value:t.form.page,callback:function(e){t.$set(t.form,"page",e)},expression:"form.page"}},[a("el-option",{attrs:{label:"首页 index",value:"index"}}),a("el-option",{attrs:{label:"详情 detail",value:"detail"}}),a("el-option",{attrs:{label:"专题 zt2",value:"zt2"}}),a("el-option",{attrs:{label:"个人中心 profile",value:"profile"}}),a("el-option",{attrs:{label:"订单列表 order-list",value:"order-list"}}),a("el-option",{attrs:{label:"订单详情 order-detail",value:"order-detail"}}),a("el-option",{attrs:{label:"邀请拼团 couple-share",value:"couple-share"}})],1)],1)],1),a("el-form-item",{attrs:{label:"跳转到哪里"}},[a("el-radio-group",{model:{value:t.form.dist,callback:function(e){t.$set(t.form,"dist",e)},expression:"form.dist"}},[a("el-radio",{attrs:{label:"life"}},[t._v("生活号")]),a("el-radio",{attrs:{label:"couple"}},[t._v("拼团小程序")]),a("el-radio",{attrs:{label:"point"}},[t._v("积分小程序")]),a("el-radio",{attrs:{label:"othermini"}},[t._v("其他小程序")])],1),a("div",{directives:[{name:"show",rawName:"v-show",value:"othermini"===t.form.dist,expression:"form.dist === 'othermini'"}]},[a("el-input",{staticClass:"input-with-select",attrs:{placeholder:"其他小程序链接 如 ${page}?appid=${appId}&xx=xxx"},model:{value:t.form.othermini,callback:function(e){t.$set(t.form,"othermini",e)},expression:"form.othermini"}}),a("div",{staticClass:"content-example"},t._l(t.otherMinis,function(e,o){return a("p",{key:o},[t._v("\n            "+t._s(o)+": "+t._s(e)+"\n          ")])}))],1)],1),a("el-form-item",{attrs:{label:"是否需要渠道"}},[a("el-radio-group",{model:{value:t.form.channel,callback:function(e){t.$set(t.form,"channel",e)},expression:"form.channel"}},[a("el-radio",{attrs:{label:""}},[t._v("无渠道")]),a("el-radio",{attrs:{label:"point"}},[t._v("积分小程序")]),a("el-radio",{attrs:{label:"alipay_ant"}},[t._v("蚂蚁会员")]),a("el-radio",{attrs:{label:"huabei"}},[t._v("花呗")])],1)],1),a("el-form-item",{attrs:{label:"生成结果"}},[a("div",{staticClass:"output"},[a("div",{staticClass:"output-item"},[t._v(t._s(t.output))]),a("div",{staticClass:"output-item"},[t._v(t._s(t.tip))])])]),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:t.form.createShortUrl,expression:"form.createShortUrl"}]},[a("a",{attrs:{href:"http://dwz.wailian.work/",target:"_blank"}},[a("el-button",{attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("生成短链接")])],1)]),a("el-form-item",{attrs:{label:""}},[a("div",{staticClass:"output"},[a("div",{staticClass:"output-item"},[t._v(t._s(t.form.shortUrl))])])])],1)],1)},i=[];function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if("string"===typeof t)return t;var e=t,a=[];for(var o in t)e[o]?a.push("".concat(o,"=").concat(e[o])):delete e[o];return a.join("&")}var l=function(t,e){return t?["life","message"].indexOf(e)>-1&&"index"===t?"":"pages/".concat(t,"/").concat(t):""},n={point:0x72b6826893e74,couple:0x72a8d7c3c399a},s=function(t){var e=n[t];return"alipays://platformapi/startApp?appId=".concat(e)},c=function(t){var e=t.page,a=t.appid,o=t.appname,i=a?"appid=".concat(a):"appname=".concat(o);return o&&n[o]&&(i="appname=".concat(o)),"miniapp://pages/".concat(e,"/").concat(e,"?").concat(i)},p=function(t){return"miniapp://".concat(t)},m=function(t){return"https://ds.alipay.com/?from=mobilecodec&scheme=".concat(encodeURIComponent(t))},u={"in最美证件照":"pages/index?appid=2018013102119843&chanel=Haoshiqi","in照片打印定制":"pages/index/index?appid=2017111409929370&_s=haoshiqi"},d={data:function(){return{otherMinis:u,form:{createShortUrl:!1,source:"life",page:"index",params:"",dist:"couple",othermini:u[0],miniapp:!1,channel:"",tip:"",result:"",shortUrl:""}}},computed:{output:function(){return this.computedUrl()}},methods:{computedUrl:function(){this.tip="";var t=this.form,e=t.source,a=void 0===e?"":e,o=t.dist,i=void 0===o?"":o,u=t.params,d=void 0===u?"":u,f=t.page,h=void 0===f?"index":f,v=t.channel,b=void 0===v?"":v,_=t.spm,x=void 0===_?"":_;this.form.createShortUrl="message"===a,d&&(d="?".concat(d));var g=r({spm:x,channel_id:b}),w={query:encodeURIComponent(g),page:"".concat(l(h,a)).concat(encodeURIComponent(d))},k=r(w);switch(a){case"tplmsg":if("life"===i)return this.tip="暂未支持！！！","";if(["couple","point"].indexOf(i)>-1)return this.tip="模板消息，跳转到对应小程序，支持配置渠道",d=d?"".concat(d).concat(g):g?"?".concat(g):"".concat(g),"".concat(l(h)).concat(d);break;case"couple":case"point":if("life"===i)return this.tip="小程序不支持向外跳转！！！","";if(i===a)return this.tip="这是小程序内跳转，直接使用以前的H5链接即可，注意：此时暂不支持渠道",this.form.channel="","";if(this.tip="这是小程序间跳转","point"===i?b=b?"&channel_id=".concat(b):"":(this.tip+="，跳转拼团小程序不支持渠道",b=""),"othermini"===i)return this.tip+="，跳转其他小程序，请设置跳转页面以及appid，请参考示例",b="",k=p(this.form.othermini),k;var C=this.form.params;C&&(C="&".concat(C));var U={page:h,appname:i,appid:n[i]};k="".concat(c(U)).concat(b).concat(C);break;case"message":if(this.tip="短信内限制必须使用http协议","life"===i)return this.tip="这个？O__O … 你自己有的吧","";k&&(k="&".concat(k));var $="".concat(s(i)).concat(k);k="".concat(m($));break;case"life":if("life"===i)return this.tip="你本就可以随意配置","";k&&(k="&".concat(k)),k="".concat(s(i)).concat(k);break;default:}return this.resultUrl=k,k},onSubmit:function(){"message"===this.form.source?console.log(111):this.$message({message:"暂时只支持短信配置生成短链接",type:"warning"})},onCancel:function(){this.$message({message:"reset!",type:"warning"})}}},f=d,h=(a("fa8d"),a("2877")),v=Object(h["a"])(f,o,i,!1,null,null,null);v.options.__file="link.vue";e["default"]=v.exports},"234f":function(t,e,a){},fa8d:function(t,e,a){"use strict";var o=a("234f"),i=a.n(o);i.a}}]);