(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-specific-shophome-shophome"],{"02b6":function(t,e,i){var n=i("5860");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var r=i("4f06").default;r("648faab6",n,!0,{sourceMap:!1,shadowMode:!1})},"0e8e":function(t,e,i){"use strict";var n=i("288e");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=n(i("1373")),a=n(i("2077")),s={components:{bwSwiper:r.default,cgSwiper:a.default},data:function(){return{swipertitle:[],swiperList:[{img:"https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1211338343,1056512950&fm=26&gp=0.jpg"},{img:"https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1558124756,1684547130&fm=26&gp=0.jpg"},{img:"https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2605935299,2493192961&fm=26&gp=0.jpg"}]}},methods:{getmenu:function(){var t=this,e=this.getServiceUrl("shop","srvshop_goods_category_select","select"),i={serviceName:"srvshop_goods_category_select",colNames:["*"],condition:[{colName:"parent_no",ruleType:"isnull"}],order:[]};this.$http.post(e,i).then(function(e){t.swipertitle=e.data.data})}},onLoad:function(){this.getmenu()}};e.default=s},1373:function(t,e,i){"use strict";i.r(e);var n=i("930b"),r=i("75bc");for(var a in r)"default"!==a&&function(t){i.d(e,t,function(){return r[t]})}(a);i("b1df");var s,o=i("f0c5"),c=Object(o["a"])(r["default"],n["b"],n["c"],!1,null,"4753686c",null,!1,n["a"],s);e["default"]=c.exports},2077:function(t,e,i){"use strict";i.r(e);var n=i("a0d2"),r=i("8588");for(var a in r)"default"!==a&&function(t){i.d(e,t,function(){return r[t]})}(a);i("27f9");var s,o=i("f0c5"),c=Object(o["a"])(r["default"],n["b"],n["c"],!1,null,"351966fd",null,!1,n["a"],s);e["default"]=c.exports},"27f9":function(t,e,i){"use strict";var n=i("92d9"),r=i.n(n);r.a},"45a8":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("c5f6");var n={name:"bw-swiper",created:function(){this.fullScreen&&uni.getSystemInfo({success:function(t){}})},mounted:function(){if(!this.fullScreen){var t=uni.createSelectorQuery().in(this);t.select(".swiper-item").boundingClientRect(function(t){}).exec()}},props:{fullScreen:{type:Boolean,default:!1},swiperList:{type:Array,default:function(){return[]}},swiperType:{type:Boolean,default:!0},videoAutoplay:{type:Boolean,default:!1},videoKey:{type:String,default:"src"},imageKey:{type:String,default:"img"},textKey:{type:String,default:"text"},textTip:{type:Boolean,default:!1},textStyleSize:{type:Number,default:24},textStyleBottom:{type:Number,default:5},textStyleRight:{type:Number,default:5},textStyleColor:{type:String,default:"#ffffff"},textStyleBgcolor:{type:String,default:"transparent"},w_h:{type:Number,default:2},skipHiddenItemLayout:{type:Boolean,default:!1},displayMultipleItems:{type:Number,default:1},nextMargin:{type:String,default:"0px"},previousMargin:{type:String,default:"0px"},vertical:{type:Boolean,default:!1},circular:{type:Boolean,default:!0},duration:{type:Number,default:400},interval:{type:Number,default:2500},current:{type:Number,default:0},autoplay:{type:Boolean,default:!0},indicatorColor:{type:String,default:"#CCCCCC"},indicatorActiveColor:{type:String,default:"#ffffff"},indicatorDots:{type:Boolean,default:!0}},data:function(){return{flag:!0,cardCur:0,swiperHeight:128}},computed:{},methods:{play:function(){this.flag=!1},pause:function(){this.flag=!0},clickItem:function(t){this.swiperList.length>0&&this.$emit("clickItem",this.swiperList[t])},change:function(t){this.$emit("change",t)},animationfinish:function(t){this.cardCur=t.detail.current,this.$emit("animationfinish",t)}}};e.default=n},"4f0b":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("c5f6");var n={name:"cg-swiper",props:{swiperColor:{type:String,default:"#999999"},swiperActiveColor:{type:String,default:"#FFCC00"},autoplay:{type:Boolean,default:!1},interval:{type:Number,default:5e3},duration:{type:Number,default:500},swiperList:{type:Array,default:function(){return[]}},customize:{type:Boolean,default:!1}},data:function(){return{swiperCurrent:0,bgcolor:["linear-gradient(0deg,rgba(9,216,162,1),rgba(90,242,217,1))","linear-gradient(0deg,rgba(251,184,35,1),rgba(255,228,40,1))","linear-gradient(0deg,rgba(255,126,34,1),rgba(240,184,27,1))","linear-gradient(0deg,rgba(9,177,252,1),rgba(24,200,255,1))","linear-gradient(0deg,rgb(237, 160, 239), rgb(183, 76, 160))"],swperheight:"380upx",swiperDots:!1}},methods:{swiperChange:function(t){this.swiperCurrent=t.detail.current},clickItem:function(t){console.log(t.name)}},created:function(){this.swiperList.length>10?this.swiperDots=!0:this.swiperList.length<=5&&(this.swperheight="180upx")}};e.default=n},5860:function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,".cardSwiper .swiper-item[data-v-4753686c]{width:86%!important;overflow:initial}.cardSwiper .swiper-item uni-view[data-v-4753686c]{width:100%;display:block;height:128px!important;border-radius:%?10?%;-webkit-transform:scale(.93,.8);transform:scale(.93,.8);opacity:.7;-webkit-transition:all .1s ease-in 0s;transition:all .1s ease-in 0s;overflow:hidden;box-sizing:border-box;margin-left:8.1%}.cardSwiper .cur uni-view[data-v-4753686c]{-webkit-transform:initial;transform:none;opacity:1;-webkit-transition:all .1s ease-in 0s;transition:all .1s ease-in 0s}.swiper-item uni-view[data-v-4753686c]{height:100%;width:100%;position:relative}.swiperText[data-v-4753686c]{position:absolute;color:#fff;z-index:2;border-radius:%?4?%;padding:0 %?4?%}.screen-swiper uni-image[data-v-4753686c]{width:100%}.screen-swiper uni-video[data-v-4753686c],.swiper-item uni-video[data-v-4753686c]{width:100%;display:block;height:100%}.swiperContent[data-v-4753686c]{width:100%;height:50px!important}",""])},7470:function(t,e,i){"use strict";i.r(e);var n=i("0e8e"),r=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,function(){return n[t]})}(a);e["default"]=r.a},"75bc":function(t,e,i){"use strict";i.r(e);var n=i("45a8"),r=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,function(){return n[t]})}(a);e["default"]=r.a},"80f2":function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,".header_content[data-v-2a3247e3]{height:%?260?%;overflow:hidden}",""])},8588:function(t,e,i){"use strict";i.r(e);var n=i("4f0b"),r=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,function(){return n[t]})}(a);e["default"]=r.a},"92d9":function(t,e,i){var n=i("b1f6");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var r=i("4f06").default;r("2e212fe4",n,!0,{sourceMap:!1,shadowMode:!1})},"930b":function(t,e,i){"use strict";var n,r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"swiperContent"},[i("v-uni-swiper",{staticClass:"screen-swiper",class:!t.swiperType||1!=t.displayMultipleItems||t.vertical||t.fullScreen?"":"cardSwiper",style:{height:t.swiperHeight+"px"},attrs:{"indicator-active-color":t.indicatorActiveColor,"indicator-color":t.indicatorColor,autoplay:t.autoplay&&t.flag,current:t.current,interval:t.interval,duration:t.duration,circular:t.circular,vertical:t.vertical,"previous-margin":t.previousMargin,"next-margin":t.nextMargin,"display-multiple-items":t.displayMultipleItems,"skip-hidden-item-layout":t.skipHiddenItemLayout},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.change.apply(void 0,arguments)},animationfinish:function(e){arguments[0]=e=t.$handleEvent(e),t.animationfinish.apply(void 0,arguments)}}},t._l(t.swiperList,function(e,n){return i("v-uni-swiper-item",{key:n,staticClass:"swiper-item",class:t.cardCur!=n||1!=t.displayMultipleItems||t.vertical||t.fullScreen?"":"cur",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.clickItem(n)}}},[e[t.imageKey]&&!e[t.videoKey]?i("v-uni-view",[i("v-uni-image",{style:{height:t.swiperHeight+"px"},attrs:{src:e[t.imageKey]}})],1):t._e()],1)}),1)],1)},a=[];i.d(e,"b",function(){return r}),i.d(e,"c",function(){return a}),i.d(e,"a",function(){return n})},a0d2:function(t,e,i){"use strict";var n,r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticStyle:{position:"relative"}},[i("v-uni-swiper",{staticClass:"swiper",style:{height:t.swperheight},attrs:{"indicator-dots":t.swiperDots,autoplay:t.autoplay,"indicator-color":t.swiperColor,interval:t.interval,duration:t.duration,"indicator-active-color":t.swiperActiveColor}},[i("v-uni-swiper-item",{staticStyle:{width:"100%"}},[i("v-uni-view",{staticClass:"swiper-item"},t._l(t.swiperList,function(e,n){return n<10?i("v-uni-view",{key:n,staticClass:"swiper-item-view",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickItem(e)}}},[i("v-uni-view",{staticClass:"crip",style:{background:t.bgcolor[n]}},[t._v(t._s(e.name[0]))]),i("v-uni-text",[t._v(t._s(e.name))])],1):t._e()}),1)],1),t.swiperList.length>10?[i("v-uni-swiper-item",{staticStyle:{width:"100%"}},[i("v-uni-view",{staticClass:"swiper-item"},t._l(t.swiperList,function(e,n){return n>9&&n<20?i("v-uni-view",{key:n,staticClass:"swiper-item-view",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickItem(e)}}},[i("v-uni-view",{staticClass:"crip",style:{background:t.bgcolor[n]}},[t._v(t._s(e.name[0]))]),i("v-uni-text",[t._v(t._s(e.name))])],1):t._e()}),1)],1)]:t._e()],2),1==t.customize&&0==t.swiperDots?i("v-uni-view",{staticClass:"dots"},[t._l(t.swiperList,function(e,n){return n<2&&t.swiperList.length>10?[i("v-uni-view",{key:n+"_0",staticClass:"dot",class:[n==t.swiperCurrent?"active":""],style:[n==t.swiperCurrent?{background:t.swiperActiveColor}:{background:t.swiperColor}]})]:t._e()})],2):t._e()],1)},a=[];i.d(e,"b",function(){return r}),i.d(e,"c",function(){return a}),i.d(e,"a",function(){return n})},ac10:function(t,e,i){"use strict";i.r(e);var n=i("b13e"),r=i("7470");for(var a in r)"default"!==a&&function(t){i.d(e,t,function(){return r[t]})}(a);i("fe32");var s,o=i("f0c5"),c=Object(o["a"])(r["default"],n["b"],n["c"],!1,null,"2a3247e3",null,!1,n["a"],s);e["default"]=c.exports},b13e:function(t,e,i){"use strict";var n={"bw-swiper":i("1373").default,"cg-swiper":i("2077").default},r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{},[i("v-uni-view",{staticStyle:{height:"10px"}}),i("v-uni-view",{staticClass:"header_content"},[i("bw-swiper",{staticStyle:{width:"100%"},attrs:{swiperList:t.swiperList}})],1),i("cg-swiper",{attrs:{swiperList:t.swipertitle}})],1)},a=[];i.d(e,"b",function(){return r}),i.d(e,"c",function(){return a}),i.d(e,"a",function(){return n})},b1df:function(t,e,i){"use strict";var n=i("02b6"),r=i.n(n);r.a},b1f6:function(t,e,i){e=t.exports=i("2350")(!1),e.push([t.i,".swiper[data-v-351966fd]{width:100%;padding-top:%?20?%;overflow:hidden}.swiper-item[data-v-351966fd]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap}.swiper-item-view[data-v-351966fd]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:20%;height:%?170?%}.swiper-img[data-v-351966fd]{width:%?100?%;height:%?100?%}.crip[data-v-351966fd]{width:%?90?%;height:%?90?%;border-radius:50%;background:#007aff;margin:0 auto;line-height:%?90?%;text-align:center;color:#fff;font-size:18px;font-weight:600;margin-bottom:5px}\r\n/* 轮播圆点样式修改 */.dots[data-v-351966fd]{position:absolute;left:0;right:0;bottom:%?20?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.dots .dot[data-v-351966fd]{margin:0 %?5?%;width:%?40?%;height:%?6?%;border-radius:20%;-webkit-transition:all .6s;transition:all .6s}.dots .dot.active[data-v-351966fd]{width:%?40?%}",""])},b318:function(t,e,i){var n=i("80f2");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var r=i("4f06").default;r("25c06486",n,!0,{sourceMap:!1,shadowMode:!1})},fe32:function(t,e,i){"use strict";var n=i("b318"),r=i.n(n);r.a}}]);