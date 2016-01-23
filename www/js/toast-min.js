/* @author Muhammet Tutcugil | @version 1.00 |@repository https://github.com/tutcugil/ToastJS | @licence https://github.com/tutcugil/ToastJS/blob/master/LICENSE */
var Toast=function(){return{DEFAULT_CLASS:"toast-item",DURATION_LONG:4E3,DURATION_NORMAL:2E3,DURACTION_AVERAGE:3E3,DURATION_SHORT:1E3,POSITION_TOP:"top",POSITION_BOTTOM:"bottom",POSITION_MIDDLE:"middle",ALIGN_CENTER:"center",ALIGN_LEFT:"left",ALIGN_RIGHT:"right",QUEUE:[],TIMEOUT:null,TIMEOUT_HIDE:null,show:function(a){var b={position:Toast.POSITION_BOTTOM,duration:Toast.DURATION_NORMAL,align:Toast.ALIGN_CENTER,"class":Toast.DEFAULT_CLASS,background:"#000000",color:"#ffffff",opacity:"0.6",radius:"16",
fontSize:"14px",appearTime:.3,message:"",top:"40px",left:"40px"};"string"===typeof a?b.message=a:a&&$.extend(b,a);var d=!1;$(Toast.QUEUE).each(function(a,e){if(e.message==b.message)return d=!0,!1});if(d)return!1;Toast.QUEUE.push(b);1<Toast.QUEUE.length||Toast.processQueue(Toast.QUEUE[0])},processQueue:function(a){var b=$("."+Toast.DEFAULT_CLASS);0<b.length&&b.remove();var d=Toast.DEFAULT_CLASS+(""!=a["class"]?" "+a["class"]:""),c;c="position:absolute; display:block; text-align:center; height: auto; overflow: hidden; padding:10px 18px 10px 18px; opacity:0; z-index:100000;"+
("border-radius: "+a.radius+"px; -webkit-border-radius: "+a.radius+"px; -ms-border-radius:                            "+a.radius+"px; -o-border-radius:"+a.radius+"px; -moz-border-radius: "+a.radius+"px;");c+="-webkit-transition: opacity "+a.appearTime+"s; -o-transition: opacity "+a.appearTime+"s; transition: opacity                            "+a.appearTime+"s; -moz-transition: opacity "+a.appearTime+"s; -ms-transition: opacity "+a.appearTime+"s;";c+="background: "+a.background+"; color: "+a.color+
"; font-size:"+a.fontSize+";";$("body").append('<div style="'+c+'" class="'+d+'">'+a.message+"</div>");setTimeout(function(){b=$("."+a["class"]);switch(a.position){case Toast.POSITION_TOP:b.css("top",a.top);break;case Toast.POSITION_MIDDLE:b.css("top",($(window).height()-b.outerHeight(!0))/2);break;default:b.css("bottom",a.top)}switch(a.align){case Toast.ALIGN_LEFT:b.css("left",a.left);break;case Toast.ALIGN_RIGHT:b.css("right",a.left);break;default:b.css("left",($(window).width()-b.outerWidth(!0))/
2)}b.css("opacity",a.opacity)},50);Toast.TIMEOUT=setTimeout(function(){b=$("."+Toast.DEFAULT_CLASS);0>=Toast.QUEUE.length?b.remove():(Toast.QUEUE.splice(0,1),b.css("opacity",0),Toast.TIMEOUT_HIDE=setTimeout(function(){b=$("."+Toast.DEFAULT_CLASS);b.remove();0>=Toast.QUEUE.length?clearTimeout(Toast.TIMEOUT_HIDE):Toast.processQueue(Toast.QUEUE[0])},1E3*a.appearTime))},a.duration)},clear:function(){$("."+Toast.DEFAULT_CLASS).remove();Toast.QUEUE=[];null!=Toast.TIMEOUT&&clearTimeout(Toast.TIMEOUT);null!=
Toast.TIMEOUT_HIDE&&clearTimeout(Toast.TIMEOUT_HIDE)}}}();
