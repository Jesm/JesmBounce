function jesmRand(de, para){
	return de+(Math.random()*(para-de));
}

jesmCore.animator.enableRAF=false;

var jogo={
	main:pega("#main"),
	alert:function(str, depois){
		var diag=this.dialogos.alert, valorHeightFuturo;
		css(diag.elemento, "display:block;width:500px;height:auto;opacity:.1").pega("p", 0).innerHTML=str;
		
		var sizeMain=obCross.client(this.main), size=obCross.client(diag.elemento);
		cada(sizeMain, function(val, ind){
			css(diag.elemento, (ind?"top":"left")+":"+(val/2-size[ind]/2)+"px");
		});
		
		valorHeightFuturo=obCross.client(diag.elemento)[1];
		css(diag.elemento, "width:0;height:0;opacity:0");
		
		diag.go(.5, [500, valorHeightFuturo, 1]);
		diag.elemento.pega("button", 0).onclick=function(){
			diag.go(.25, [, , 0], function(anim){
				css(anim.elemento, "display:none");
				if(depois)
					depois();
			});
		};
	},
	confirm:function(str, depois1, depois2){
		var diag=this.dialogos.confirm, valorHeightFuturo;
		css(diag.elemento, "display:block;width:500px;height:auto;opacity:.1").pega("p", 0).innerHTML=str;
		
		var sizeMain=obCross.client(this.main), size=obCross.client(diag.elemento);
		cada(sizeMain, function(val, ind){
			css(diag.elemento, (ind?"top":"left")+":"+(val/2-size[ind]/2)+"px");
		});
		
		valorHeightFuturo=obCross.client(diag.elemento)[1];
		css(diag.elemento, "width:0;height:0;opacity:0");
		
		diag.go(.5, [500, valorHeightFuturo, 1]);
		cada(diag.elemento.pega("button"), function(el, ind){
			var func=ind?depois2:depois1;
			el.onclick=function(){
				diag.go(.25, [, , 0], function(anim){
					css(anim.elemento, "display:none");
					if(func)
						func();
				});
			};
		})
	},
	dialogos:{
		alert:new anima(pega("#alert"), "width;height;opacity"),
		confirm:new anima(pega("#confirm"), "width;height;opacity")
	},
	modelos:{
		bounce:10,
		cursor:20,
		alvo:40
	},
	invencivel:{
		ativo:false,
		meteint:null
	},
	bounces:[],
	alvos:[],
	
	addBounce:function(X, Y){
		var el=document.createElement("div"), novoBounce={
			coord:[X, Y],
			direcao:[jesmRand(-1, 1), jesmRand(-1, 1)],
			velocidade:1000/1000,
			ativo:false,
			cor:"rgb("+Math.floor(jesmRand(96, 255))+', '+Math.floor(jesmRand(96, 255))+', '+Math.floor(jesmRand(96, 255))+')'
		};
		setTimeout(function(){
			css(novoBounce.el, "backgroundColor:"+novoBounce.cor);
			novoBounce.ativo=true;
		}, 1000);
		
		novoBounce.el=css(el, "width:"+this.modelos.bounce+"px;height:"+this.modelos.bounce+"px;left:"+X+"px;top:"+Y+"px");
		novoBounce.el.className="bounce";
		
		this.bounces.push(novoBounce);
		this.main.appendChild(el);
		return novoBounce;
	},
	
	desenha:function(){
		var bSize=this.modelos.bounce,
		tamanhoMain=obCross.client(this.main),
		limites=[tamanhoMain[0]-bSize, tamanhoMain[1]-bSize],
		agora=+new Date,
		metB=bSize/2,
		somaMet=this.modelos.cursor/2+metB,
		somaMet1=this.modelos.cursor/2+this.modelos.alvo/2,
		freioAtivo=this.freio.ativo,
		THIS=this;
				
		for(var len1=this.alvos.length;len1--;){
			var alvo=this.alvos[len1], newCoord=alvo.coord;
			if(this.detector(this.mousePos, alvo.coord, somaMet1)){
				this.pontuar();
				this.alvos.splice(len1, 1);
				alvo.anima.go(.3, [bSize, bSize], function(anim){
					THIS.addBounce(newCoord[0], newCoord[1]);
					THIS.main.removeChild(anim.elemento);
					delete anim.elemento;
					setTimeout(function(){
						if(THIS.ativo&&!THIS.freio.ativo)
							THIS.addAlvo();
					}, 2000+jesmRand(0, 1)*1000);
				});
				this.invencivel.ativo=true;
				document.body.className="invencivel";
				clearTimeout(this.invencivel.meteint);
				this.invencivel.meteint=setTimeout(function(){
					THIS.invencivel.ativo=false;
					document.body.className="";
				}, 1000);
			}
		}
		
		for(var len1=this.bounces.length;len1--;){
			var bo=this.bounces[len1],
			distancia=bo.velocidade*(agora-this.lastFrame);
			
			if(freioAtivo){
				var ultFrame=agora-this.freio.time, freioDur=this.freio.dur;
				if(ultFrame>freioDur){
					this.gameOver();
					return;
				}
				else if(this.freio.bo==bo)
					continue;
				distancia*=(freioDur-ultFrame)/freioDur;
			}
			
			for(var len=2;len--;){
				bo.coord[len]+=(bo.direcao[len]*distancia);
				if(bo.coord[len]>limites[len]){
					bo.coord[len]=2*limites[len]-bo.coord[len];
					bo.direcao[len]=-bo.direcao[len];
				}
				else if(bo.coord[len]<0){
					bo.coord[len]*=-1;
					bo.direcao[len]=-bo.direcao[len];
				}
			}
			
			if(!this.invencivel.ativo&&bo.ativo&&this.detector(this.mousePos, [bo.coord[0]+metB, bo.coord[1]+metB], somaMet)){
				this.freio.go(bo);
				css(this.mostraCursor.elemento, "display:block;left:"+this.mousePos[0]+"px;top:"+this.mousePos[1]+"px");
			}
			css(bo.el, "left:"+bo.coord[0]+"px;top:"+bo.coord[1]+"px");
		}
		this.lastFrame=agora;
	},
	
	detector:function(p1, p2, disMax){
		return Math.sqrt(Math.pow(Math.abs(p1[0]-p2[0]), 2)+Math.pow(Math.abs(p1[1]-p2[1]), 2))<disMax;
	},
	
	addAlvo:function(){
		var el=document.createElement("div"),
		larg=this.modelos.alvo,
		tamanhoMain=obCross.client(this.main),
		
		X=Math.round(jesmRand(larg/2, tamanhoMain[0]-(larg/2))),
		Y=Math.round(jesmRand(larg/2, tamanhoMain[1]-(larg/2))),
		
		novoAlvo={
			el:css(el, "left:"+(X-larg/2)+"px;top:"+(Y-larg/2)+"px"),
			coord:[X, Y],
			anima:new anima(el, "width;height", "ease-in")
		};
		
		el.className="alvo";
		this.main.appendChild(el);
		novoAlvo.anima.go(.3, [larg, larg], function(){
			novoAlvo.ativo=true;
		});
		
		this.alvos.push(novoAlvo);
		return novoAlvo;
	},
	
	gameOver:function(){
		var THIS=this, flag=1;
		this.ativo=this.freio.ativo=false;
		this.freio.time=null;
		jesmCore.animator.delTarefaByObj(this);
		(function z(){
			flag=!flag;
			THIS.mostraCursor.go(.25, [flag?1:.3], z);
		})();
		if(parseInt(localStorage.maiorPontuacao)<this.pontuacao)
			localStorage.maiorPontuacao=this.pontuacao;
		this.mostraInfo.tira();
		setTimeout(function(){
			THIS.confirm("Você conseguiu o total de "+THIS.pontuacao+" pontos! Deseja jogar novamente?", function(){
				THIS.iniciar();
			});
		}, 500);
	},
	
	freio:{
		ativo:false,
		time:null,
		go:function(bo){
			this.bo=bo;
			this.ativo=true;
			this.time=+new Date;
		},
		bo:null,
		dur:.5*1000
	},
		
	iniciar:function(){
		if(this.ativo)
			return;
		var THIS=this;
		this.lastFrame=+new Date;
		this.ativo=true;
		this.pontuacao=0;
		cada([this.bounces, this.alvos], function(h){
			for(var len=h.length;len--;){
				var bo=h.pop(), el=bo.el;
				main.removeChild(el);
				delete bo;
				delete el;
			}
		});
		this.mostraCursor.stop();
		this.addAlvo();
		this.mostraInfo.go();
		css(this.mostraCursor.elemento, "display:none");
		jesmCore.animator.addTarefa(function(){
			THIS.desenha();
		}, this);
	},
	
	gerarBounces:function(num){
		if(!this.ativo)
			this.iniciar();
		while(num--)
			this.addBounce(0, 0);
	},
	
	lastFrame:null,
	pontuacao:0,
	pontuar:function(b){
		if(b==null)
			b=1;
		this.mostraInfo.placar.innerHTML=(this.pontuacao+=b);
	},
	vidas:3,
	poderes:[],
	ativo:false,
	mousePos:[0, 0],
	pause:{
		ativo:false,	
		go:function(num){
			if(!jogo.ativo)
				return false;
			this.ativo=!this.ativo;
			if(this.ativo)
				jesmCore.animator.delTarefaByObj(jogo);
			else{
				jogo.lastFrame=+new Date;
				jesmCore.animator.addTarefa(function(){
					jogo.desenha();
				}, jogo);
			}
		}
	},
	mostraInfo:{
		anima:new anima(pega("#info_jogo"), "opacity"),
		go:function(){
			css(this.anima.elemento, "opacity:0");
			this.placar.innerHTML=0;
			if(!localStorage.maiorPontuacao)
				localStorage.maiorPontuacao=0;
			this.recorde.innerHTML=localStorage.maiorPontuacao;
			this.anima.go(.5, [1]);
		},
		tira:function(){
			this.anima.go(.5, [0]);
		},
		placar:pega("#placar"),
		recorde:pega("#recorde")
	}
};

(function(THIS){
	var cursor=document.createElement("div"), mostraCursor=new anima(document.createElement("div"), "opacity", "linear"), size=THIS.modelos.cursor-2;
	cursor.className="cursor";
	mostraCursor.elemento.className="mostra_cursor";
	main.appendChild(css(cursor, "width:"+size+"px;height:"+size+"px;margin:-"+size/2+"px 0 0 -"+size/2+"px;top:-"+size+"px"));
	main.appendChild(css(mostraCursor.elemento, "display:none;width:"+size+"px;height:"+size+"px;margin:-"+size/2+"px 0 0 -"+size/2+"px"));
	THIS.cursor=cursor;
	THIS.mostraCursor=mostraCursor;
	cursor.setAttribute("unselectable", "on");
})(jogo);

addEvento(window, "click", function(e){
	var ev=e||window.event;
	obCross.preventDefault(ev);
});
addEvento(window, "mousemove", function(e){
	var ev=e||window.event;
	jogo.mousePos=[ev.pageX, ev.pageY];
	css(jogo.cursor, "left:"+ev.pageX+"px;top:"+ev.pageY+"px");
});
addEvento(document.body, "keydown", function(e){
	var ev=e||window.event;
	switch(obCross.which(ev)){
		case 27: //jogo.pause.go();
		break;
	}
});

jogo.alert("Bem-vindo ao JesmBounce! Clique em 'Ok' para continuar", function(){
	jogo.alert("Passe o mouse por cima das bolas roxas para fazer pontos!", function(){
		jogo.alert("Desvie o mouse das bolas pequenas para não perder!", function(){
			jogo.alert("Clique em 'Ok' para iniciar ->", function(){
				jogo.iniciar();
			});
		});
	});
});