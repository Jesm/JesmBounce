function pega(e,t){var n={lista:[],addItens:function(e){var t=this
cada(e,function(e){t.lista.push(e)})},addItem:function(e){this.lista.push(e)}},a=this!=window?this:document,i=function(e,t,n,a,i){return this.str=e,this.onId=t,this.onClass=n,this.onAttr=a,this.onElse=i,this.ver=function(){var e,t=this.str;(e=/^#(.+)$/i)&&-1!=t.search(e)?this.onId(t.match(e)[1]):(e=/^\.(.+)$/i)&&-1!=t.search(e)?this.onClass(t.match(e)[1]):(e=/^\[(.+)=(.+)\]$/i)&&-1!=t.search(e)?this.onAttr(t.match(e)[1],t.match(e)[2]):this.onElse(t)},this}
return e.nodeType&&1==e.nodeType?n=e:(cada(e.split(","),function(e){new i(e,function(e){n=document.getElementById(e)},function(e){if(a.getElementsByClassName)n.addItens(a.getElementsByClassName(e))
else{var t=RegExp("\\b"+e+"\\b")
n.addItens(filtrar(a.getElementsByTagName("*"),function(n){return-1!=n.className.indexOf(e)&&-1!=n.className.search(t)}))}},function(e,t){a==document&&"name"==e?n.addItens(document.getElementsByName(t)):n.addItens(filtrar(a.getElementsByTagName("*"),function(n){return n[e]==t?!0:void 0}))},function(e){n.addItens(a.getElementsByTagName(e))}).ver()}),null!=t&&(n=n.lista.length?n.lista["last"!=t?t:n.lista.length-1]:null)),n&&isElemento(n)&&(n.pega=pega,n.filhas=function(e){var t=this.childNodes
return cada(e.split(","),function(e){t=filtrar(t,function(t){var n=!1
return new i(e,null,function(e){null!=t.className&&-1!=t.className.indexOf(e)&&-1!=t.className.search(RegExp("\b"+e+"\b"))&&(n=!0)},function(e,a){t[e]==a&&(n=!0)},function(e){t.tagName&&t.tagName.toLowerCase()==e.toLowerCase()&&(n=!0)}).ver(),n})}),t}),n&&n.lista?n.lista:n}function anima(e,t,n){if(!e)return console.error("O elemento não foi indicado"),!1
this.elemento=e,this.propriedade=[],this.sufixo=[],this.prefixo=[]
for(var a=-1,t=t.split(";"),i=t.length;++a<i;)if(""!=t[a]){var r=oldIE()&&"opacity"==t[a]
this.propriedade.push(r?"filter":t[a]),this.prefixo.push(r?"alpha(opacity=":""),this.sufixo.push(r?")":""),r&&""==getStyle(this.elemento,"filter")&&css(this.elemento,"filter:alpha(opacity=100)")}return this.ativo=!1,this.tipo=n||"ease",this.go=function(e,t,n){if(null==e)return console.error("A duração não foi indicada"),!1
this.ativo&&this.stop()
var a=[],i=this,r=this.elemento.style,o=null,s=1e3*e,u=jesmCore.geraEase(this.tipo,s)
cada(t,function(e,t){if(null!=e){var n={to:e,p:i.propriedade[t],pre:i.prefixo[t],suf:i.sufixo[t]},r=getStyle(i.elemento,n.p)
if("auto"==r){var s=obCross.cssSize(i.elemento)
switch(n.p){case"width":r=s[0]+"px"
case"height":r=s[1]+"px"}}if(i.sufixo[t]||i.prefixo[t])n.from=parseFloat(r.replace(n.suf,"").replace(i.prefixo[t],""))
else{for(var u=0,l=["px","mm","pt","cm","%","em"],c=l.length;c>u;u++)-1!=r.indexOf(l[u])&&(n.suf=i.sufixo[t]=l[u])
n.from=parseFloat(r.replace(n.suf,""))}"filter"==n.p?n.to*=100:"auto"==n.to&&(o=o||{lista:[],set:function(){css(i.elemento,this.lista.join(":auto;")+":auto")}},o.lista.push(n.p),n.to=getAuto(i.elemento,n.p)),n.p=jesmCore.cssPropToJs(n.p),n.dif=n.to-n.from,n.mom=n.to>n.from?1:-1,n.toMom=n.to*n.mom,a.push(n)}}),"none"==n&&(n=function(){css(this.elemento,"display:none")})
var l=+new Date,c=a.length
return this.ativo=!0,jesmCore.animator.addTarefa(function(){for(var e=c,t=e,s=+new Date-l;t--;){var f=a[t],d=u(f.dif,s)+f.from
d*f.mom>=f.toMom&&(d=f.to,--e),r[f.p]=f.pre+d.toFixed(3)+f.suf}return e?!1:function(){return i.ativo=!1,o&&o.set(),n&&n.call(i,i),!0}()},this),this},this.stop=function(){return jesmCore.animator.delTarefaByObj(this),this.ativo=!1,this},this}function carregarImg(e,t,n){this.img=new Image,this.img.src=e,this.depois=t
var a=this
this.img.onload=function(){n&&(n.src=this.src),a.depois&&a.depois()}}function ir(e,t,n,a){if(null==e)return console.error("O elemento não foi indicado"),!1
if(null==t)return console.error("A duração não foi indicada"),!1
var i=jesmCore.ir
i.ativo&&jesmCore.animator.delTarefaByObj(i)
var r=obCross.pageOffset(),o=obCross.disEl(e)
o[0]-=i.esquerda,o[1]-=i.topo
var s=[r[0]<o[0]?1:-1,r[1]<o[1]?1:-1],u=[o[0]-r[0],o[1]-r[1]],l=[o[0]*s[0],o[1]*s[1]],a=a||"hv",c=+new Date,f=1e3*t,d=jesmCore.geraEase(i.tipo,f)
i.ativo=!0,jesmCore.animator.addTarefa(function(){var e,t,f=+new Date-c
return scrollTo("v"==a?r[0]:(e=d(u[0],f)+r[0])*s[0]<l[0]?e:o[0],"h"==a?r[1]:(t=d(u[1],f)+r[1])*s[1]<l[1]?t:o[1]),e*s[0]<l[0]||t*s[1]<l[1]?!1:function(){return i.ativo=!1,n&&n(),!0}()},i)}function ajax(e,t,n,a){var i="",r="",o=new XMLHttpRequest,s=(n||"GET").toUpperCase()
return"POST"==s?i=t:r="?"+t,o.open(s,e+r,!0),"POST"==s&&o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),o.send(i),a&&(o.onreadystatechange=function(){4==o.readyState&&a.call(o)}),o}function getAuto(e,t){var n,a=[e.style[t],e.style.display]
switch(css(e,t+":auto;display:"),t){case"width":n=obCross.client(e)[0]
break
case"height":n=obCross.client(e)[1]}return css(e,t+":"+a[0]+";display:"+a[1]),n}function getStyle(e,t){var n=document
return n.defaultView&&n.defaultView.getComputedStyle?n.defaultView.getComputedStyle(e,"").getPropertyValue(t):e.currentStyle?e.currentStyle[jesmCore.cssPropToJs(t)]:!1}function addEvento(e,t,n){return e.addEventListener?e.addEventListener(t,n):e.attachEvent?e.attachEvent("on"+t,n):!1}function delEvento(e,t,n){return e.removeEventListener?e.removeEventListener(t,n):e.detachEvent?e.detachEvent("on"+t,n):!1}function cada(e,t){for(var n=-1,a=e.length;++n<a&&0!=t(e[n],n,e););}function css(e,t){t=t.split(";")
for(var n=t.length;n--;){var a=t[n].split(/:/),i=a[0],r=a[1]
2==a.length&&("opacity"==i&&oldIE()?(i="filter",r="alpha(opacity="+100*parseFloat(r)+")"):"float"==i&&(i="cssFloat"),e.style[jesmCore.cssPropToJs(i)]=r)}return e}function noArray(e,t){if(e.indexOf)return e.indexOf(t)
var n=-1
return cada(e,function(e,a){return e==t?(n=a,!1):void 0}),n}function oldIE(){return null==getStyle(document.body,"opacity")}function filtrar(e,t){var n=[]
return cada(e,function(e){t(e)&&n.push(e)}),n}function valorCss(e,t){return parseFloat(getStyle(e,t))}function jesmValidar(e,t,n,a){e.onsubmit=function(){return n||(n=function(){200!=this.status&&console.error(this.status+" - "+this.statusText)
var e=this.responseText.split(".;,")
t.innerHTML=e[0],css(t,"backgroundColor:"+e[1])}),validarForm(e,t,a)&&(t.innerHTML="Enviando...",css(t,"backgroundColor:#00F;"),ajaxForm(e,n)),!1}}function validarForm(e,t,n){var a=[0,0,0],i=function(e,t){var n=e.style.backgroundColor
css(e,"backgroundColor:"+t),addEvento(e,"focus",function(){css(e,"backgroundColor:"+n)})}
return n=n||"#F00",cada(e.elements,function(e){var t=e.getAttribute("type")||null,r=!(e.getAttribute("required")==e.getAttribute("a"+Math.random()+"b")),o=!0
return t&&(t=t.toLowerCase()),""==e.value.replace(" ","")&&r?a[0]++:/[a-z]/i.test(e.value)&&e.className&&-1!=e.className.toLowerCase().indexOf("nl")?a[1]++:-1!=e.value.indexOf("@")&&-1!=e.value.indexOf(".")||"email"!=t?o=!1:a[2]++,o?(i(e,n),!1):void 0}),t&&(a[0]>0?t.innerHTML=1==a[0]?"Ainda há um campo a ser preenchido.":"Ainda restam "+a[0]+" campos a serem preenchidos.":a[1]>0?t.innerHTML="Os campos em vermelho devem conter apenas números":a[2]>0&&(t.innerHTML="Os campos em vermelho devem conter emails.")),function(e){var n=0
return cada(e,function(e){n+=e}),n&&css(t,"backgroundColor:red"),!n}(a)}function ajaxForm(e,t){var n=[]
return cada(e.elements,function(e){(-1==noArray(["radio","checkbox"],e.getAttribute("type")||null)||e.checked)&&(e.name?n.push(e.name+"="+escape(e.value)):console.error(e+" não possui atributo 'name'"))}),ajax(e.action,n.join("&"),e.method||"POST",t)}function criaElemento(e,t,n,a){var i=document.createElement(e)
return t&&cada(t.split(";"),function(e){e=e.split("="),i[e[0]]=e[1]}),n&&n.appendChild(i),null!=a&&("string"==typeof a?i.innerHTML=a:i.appendChild(a)),pega(i)}function divideAspa(e,t,n){return t=t||",",n=n||"'",e.split(RegExp(t+"(?=(?:[^"+n+"]*"+n+"[^"+n+"]*"+n+")*[^"+n+"]*$)","gi"))}function isElemento(e){return!(!e||!e.nodeType||1!=e.nodeType)}for(var vendors=["moz","webkit"],len=vendors.length;len--&&!window.requestAnimationFrame;)window.requestAnimationFrame=window[vendors[len]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[vendors[len]+"CancelAnimationFrame"]||window[vendors[len]+"CancelRequestAnimationFrame"]
var jesmCore={animator:{ativo:!1,tarefas:[],meteint:null,intervalo:13,guardaObj:[],enableRAF:!0,addTarefa:function(e,t){return this.guardaObj.push(t),this.tarefas.push(e),this.ativo||(this.ativo=!0,requestAnimationFrame&&this.enableRAF?function n(){var e=jesmCore.animator
e.meteint=requestAnimationFrame(n)
for(var t=e.tarefas.length;t--;)e.tarefas[t].call(e.guardaObj[t])&&e.delTarefaByIndice(t)}():this.meteint=setInterval(function(){for(var e=jesmCore.animator,t=e.tarefas.length;t--;)e.tarefas[t].call(e.guardaObj[t])&&e.delTarefaByIndice(t)},this.intervalo)),this.tarefas.length-1},delTarefaByIndice:function(e){this.tarefas.splice(e,1),this.guardaObj.splice(e,1),this.tarefas.length||this.stop()},delTarefaByObj:function(e){for(var t=this.guardaObj,n=t.length;n--;)if(t[n]==e){this.guardaObj.splice(n,1),this.tarefas.splice(n,1)
break}this.tarefas.length||this.stop()},stop:function(){this.ativo=!1,requestAnimationFrame?cancelAnimationFrame(this.meteint):clearInterval(this.meteint)}},ir:{esquerda:0,topo:0,tipo:"ease",ativo:!1},geraEase:function(e,t){switch(e){case"linear":return function(e,n){return n/t*e}
case"ease-in":return function(e,n){var a=Math.pow(n/t,2)
return a*e}
case"ease-out":return function(e,n){var a=1-n/t
return a>=0?e-e*Math.pow(a,2):e}
case"ease-out-teste":return function(e,n){var a=n/t,i=a*e,r=i+(e-i)*a
return a>1?e:r}
case"ease":default:return function(e,n){var a=n/t,i=Math.sin(Math.PI/2*(a>1?1:a))
return i*e}}},criarBanner:function(e,t,n,a){var i=this
switch(this.dur=n||1,this.int=a||6,this.meteint=null,this.div=e,this.tipo=t,this.anima=null,this.sit=0,this.ul=pega(e).pega("ul",0),this.lis=this.ul.pega("li"),this.decSit=function(e){if(isNaN(e))switch(e){case"-":this.sit+=this.lis.length-1
break
default:this.sit++}else this.sit=e
return this.sit%=this.lis.length,this},this.continua=function(){return this.meteint=setTimeout(function(){i.go()},1e3*this.int),this},t){case"move":break
case"moveBaixo":break
case"opaco":break
case"opacoSobre":this.anima=[],cada(this.lis,function(e,t){i.anima.push(new anima(css(e,t?"opacity:0":""),"opacity"))}),this.go=function(e){return clearTimeout(this.meteint),css(this.anima[this.sit].go(this.dur,[0]).elemento,"zIndex:-1"),this.decSit(e),css(this.anima[this.sit].go(this.dur,[1],function(){i.continua()}).elemento,"zIndex:0"),this}}return this.continua()},cssPropToJs:function(e){return e.replace(/\-(\w)/g,function(e,t){return t.toUpperCase()})}},obCross={pageOffset:function(){var e=document.documentElement
return[pageXOffset||e.scrollLeft,pageYOffset||e.scrollTop]},inner:function(){for(var e=[],t=document,n=2,a=["Width","Height"];n--;e[n]=window["inner"+a[n]]||Math.min(t.body["client"+a[n]],t.documentElement["client"+a[n]]));return e},disEl:function(e,t){for(var n=[0,0];e.offsetParent&&e!=t;e=e.offsetParent)n[0]+=e.offsetLeft,n[1]+=e.offsetTop
return n},client:function(e){return[e.clientWidth,e.clientHeight]},offset:function(e){return[e.offsetWidth,e.offsetHeight]},cssSize:function(e){var t=[],n=["left","right","top","bottom"]
return cada(["width","height"],function(a,i){var r=getStyle(e,a)
"auto"==r&&(r=obCross.client(e)[i]-(parseFloat(getStyle(e,"padding-"+n[2*i]))+parseFloat(getStyle(e,"padding-"+n[2*i+1])))),t.push(r)}),t},stopPropagation:function(e){return e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){return e.preventDefault?e.preventDefault():e.returnValue=!1},which:function(e){return e.which||e.keyCode||0},textContent:function(e){return e.textContent||e.innerText||""},data:function(e,t,n){return null==n?e.dataset?e.dataset[t]:e.getAttribute("data-"+t):(e.dataset?e.dataset[t]=n:e.setAttribute("data-"+t,n),void 0)},placeholder:function(){},requestFullScreen:function(e){return e.requestFullScreen?e.requestFullScreen():e.webkitRequestFullScreen?e.webkitRequestFullScreen():e.mozRequestFullScreen?e.mozRequestFullScreen():!1},cancelFullScreen:function(){var e=document
return e.cancelFullScreen?e.cancelFullScreen():e.webkitCancelFullScreen?e.webkitCancelFullScreen():e.mozCancelFullScreen?e.mozCancelFullScreen():!1}}