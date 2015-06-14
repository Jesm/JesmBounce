'use strict';

var App={
	html:{},

	randomNumber:function(from, to){
		return Math.random()*(to-from)+from;
	},

	cfg:{
		proportion:1/60,

		init:function(){
			var scrSize=Jesm.Cross.inner();

			this.bounceDiameter=Math.round(Math.min(scrSize[0], scrSize[1])*this.proportion);
			this.cursorDiameter=this.bounceDiameter*2;
			this.targetDiameter=this.cursorDiameter*2;
		}
	},

	ui:{
		_then:function(callback){
			this.callback=callback;
			return this.returnPromisse=App.ui.promisseFactory();
		},
		_onOk:function(callback){
			this.callbackOk=callback;
			return this.returnPromisse=App.ui.promisseFactory();
		},
		_onCancel:function(callback){
			this.callbackCancel=callback;
			return this.returnPromisse=App.ui.promisseFactory();
		},
		_resolve:function(ok){
			if(!this.returnPromisse)
				return;
			var str=ok==null?'':(ok?'Ok':'Cancel'), p=this['callback'+str]();
			if(p&&p.then){
				var THIS=this;
				p.then(function(){
					THIS.returnPromisse.resolve();
				});
			}
		},
		promisseFactory:function(){
			return {
				then:this._then,
				onOk:this._onOk,
				onCancel:this._onCancel,
				resolve:this._resolve
			};
		},

		_displayDialog:function(str, isConfirm){
			var dialog=App.html.dialog;
			Jesm.css(dialog.elemento, 'opacity:0;display:block');
			dialog.elemento.classList[isConfirm?'add':'remove']('show_cancel');
			App.html.dialogText.innerHTML=str;
			Jesm.css(App.html.dialogContainer.elemento, 'opacity:0;left:30px');
			dialog.go(.25, [1]);
			App.html.dialogContainer.go(.4, [1, 0]);
			
			this.currentDialog=isConfirm;
			this.currentPromisse=this.promisseFactory();

			return this.currentPromisse;
		},
		_hideDialog:function(bool){
			var THIS=this;
			App.html.dialog.go(.25, [0], function(){
				Jesm.css(this.elemento, 'display:none');
				THIS.currentPromisse.resolve(bool);
			});
			App.html.dialogContainer.go(.4, [0, -30]);
		},
		_okEvent:function(){
			this._hideDialog(this.currentDialog?true:null);
		},
		_cancelEvent:function(){
			this._hideDialog(false);
		},
		alert:function(str){
			return this._displayDialog(str);
		},
		confirm:function(str){
			return this._displayDialog(str, true);
		},

		displayInfo:function(){
			Jesm.css(App.html.gameInfo.elemento, 'opacity:0');
			if(!localStorage.maiorPontuacao)
				localStorage.maiorPontuacao=0;
			this.updateScore();
			App.html.record.innerHTML=localStorage.maiorPontuacao;
			App.html.gameInfo.go(.4, [1]);
		},
		hideInfo:function(){
			App.html.gameInfo.go(.4, [0]);
		},
		updateScore:function(){
			App.html.score.innerHTML=App.game.pontuacao;
		},

		init:function(){
			var frag=document.createDocumentFragment();

			App.html.dialog=new Jesm.Anima(Jesm.el('div', 'id=dialog_box', frag), 'opacity');
			App.html.dialogContainer=new Jesm.Anima(Jesm.el('div', 'class=container', App.html.dialog.elemento), 'opacity;left');
			App.html.dialogText=Jesm.el('p', null, App.html.dialogContainer.elemento);
			var buttons=Jesm.el('div', 'class=buttons', App.html.dialogContainer.elemento);

			App.html.okButton=Jesm.el('button', 'class=ok', buttons, 'Ok');
			Jesm.addEvento(App.html.okButton, 'click', this._okEvent, this);
			App.html.cancelButton=Jesm.el('button', 'class=cancel', buttons, 'Cancel');
			Jesm.addEvento(App.html.cancelButton, 'click', this._cancelEvent, this);

			App.html.gameInfo=new Jesm.Anima(Jesm.el('div', 'id=game_info', frag), 'opacity');
			Jesm.el('span', 'class=label', App.html.gameInfo.elemento, 'Score:');
			App.html.score=Jesm.el('span', null, App.html.gameInfo.elemento);
			Jesm.el('span', 'class=label', App.html.gameInfo.elemento, '/');
			Jesm.el('span', 'class=label', App.html.gameInfo.elemento, 'Record:');
			App.html.record=Jesm.el('span', null, App.html.gameInfo.elemento);

			App.html.root.appendChild(frag);
		}
	},

	game:{
		bounces:[],
		targets:[],

		invincibility:{
			active:false,
			intervalReference:null
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

		lastFrame:null,
		pontuacao:0,
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
					Jesm.Core.animator.delTarefaByObj(jogo);
				else{
					jogo.lastFrame=+new Date;
					Jesm.Core.animator.addTarefa(function(){
						jogo.draw();
					}, jogo);
				}
			}
		},

		addBounce:function(X, Y){
			var el=document.createElement("div"), novoBounce={
				coord:[X, Y],
				direcao:[App.randomNumber(-1, 1), App.randomNumber(-1, 1)],
				velocidade:1000/1000,
				ativo:false,
				cor:"rgb("+Math.floor(App.randomNumber(96, 255))+', '+Math.floor(App.randomNumber(96, 255))+', '+Math.floor(App.randomNumber(96, 255))+')'
			};
			setTimeout(function(){
				Jesm.css(novoBounce.el, "backgroundColor:"+novoBounce.cor);
				novoBounce.ativo=true;
			}, 1000);
			
			novoBounce.el=Jesm.css(el, "width:"+App.cfg.bounceDiameter+"px;height:"+App.cfg.bounceDiameter+"px;left:"+X+"px;top:"+Y+"px");
			novoBounce.el.className="bounce";
			
			this.bounces.push(novoBounce);
			App.html.root.appendChild(el);
			return novoBounce;
		},

		draw:function(){
			var bSize=App.cfg.bounceDiameter,
			tamanhoMain=Jesm.Cross.client(App.html.root),
			limites=[tamanhoMain[0]-bSize, tamanhoMain[1]-bSize],
			agora=+new Date,
			metB=bSize/2,
			somaMet=App.cfg.cursorDiameter/2+metB,
			somaMet1=App.cfg.cursorDiameter/2+App.cfg.targetDiameter/2,
			freioAtivo=this.freio.ativo,
			THIS=this,
			bodyClass=Jesm.pega(document.body).classList;
					
			for(var len1=this.targets.length;len1--;){
				var target=this.targets[len1], newCoord=target.coord;

				if(!this.isOver(this.mousePos, target.coord, somaMet1))
					continue;

				this.addPoints();
				this.targets.splice(len1, 1);
				target.anima.go(.3, [bSize, bSize], function(){
					THIS.addBounce(newCoord[0], newCoord[1]);
					App.html.root.removeChild(this.elemento);
					delete this.elemento;
					setTimeout(function(){
						if(THIS.ativo&&!THIS.freio.ativo)
							THIS.addTarget();
					}, 2000+App.randomNumber(0, 1)*1000);
				});
				this.invincibility.active=true;
				bodyClass.add('invincible');

				clearTimeout(this.invincibility.intervalReference);
				this.invincibility.intervalReference=setTimeout(function(){
					THIS.invincibility.active=false;
					bodyClass.remove('invincible');
				}, 1000);
			}
			
			for(var len1=this.bounces.length;len1--;){
				var bo=this.bounces[len1],
				distancia=bo.velocidade*(agora-this.lastFrame);
				
				if(freioAtivo){
					var ultFrame=agora-this.freio.time, freioDur=this.freio.dur;
					if(ultFrame>freioDur){
						this.endGame();
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
				
				if(!this.invincibility.active&&bo.ativo&&this.isOver(this.mousePos, [bo.coord[0]+metB, bo.coord[1]+metB], somaMet)){
					this.freio.go(bo);
					Jesm.css(App.html.mostraCursor.elemento, "display:block;left:"+this.mousePos[0]+"px;top:"+this.mousePos[1]+"px");
				}
				Jesm.css(bo.el, "left:"+bo.coord[0]+"px;top:"+bo.coord[1]+"px");
			}
			this.lastFrame=agora;
		},

		isOver:function(p1, p2, disMax){
			return Math.sqrt(Math.pow(Math.abs(p1[0]-p2[0]), 2)+Math.pow(Math.abs(p1[1]-p2[1]), 2))<disMax;
		},

		addTarget:function(){
			var el=document.createElement("div"),
			larg=App.cfg.targetDiameter,
			tamanhoMain=Jesm.Cross.client(App.html.root),
			
			X=Math.round(App.randomNumber(larg/2, tamanhoMain[0]-(larg/2))),
			Y=Math.round(App.randomNumber(larg/2, tamanhoMain[1]-(larg/2))),
			
			novoAlvo={
				el:Jesm.css(el, "left:"+(X-larg/2)+"px;top:"+(Y-larg/2)+"px"),
				coord:[X, Y],
				anima:new Jesm.Anima(el, "width;height", "ease-in")
			};
			
			el.className="alvo";
			App.html.root.appendChild(el);
			novoAlvo.anima.go(.3, [larg, larg], function(){
				novoAlvo.ativo=true;
			});
			
			this.targets.push(novoAlvo);
			return novoAlvo;
		},

		endGame:function(){
			var flag=1;
			this.ativo=this.freio.ativo=false;
			this.freio.time=null;
			Jesm.Core.animator.delTarefaByObj(this);
			(function z(){
				flag=!flag;
				App.html.mostraCursor.go(.25, [flag?1:.3], z);
			})();
			if(parseInt(localStorage.maiorPontuacao)<this.pontuacao)
				localStorage.maiorPontuacao=this.pontuacao;
			App.ui.hideInfo();
			setTimeout(function(){
				App.ui.confirm("Final score: "+App.game.pontuacao+" points! Play again?").onOk(function(){
					App.game.start();
				});
				App.html.root.classList.remove('playing');
			}, 500);
		},

		start:function(){
			this.lastFrame=+new Date;
			this.ativo=true;
			this.pontuacao=0;
			Jesm.cada([this.bounces, this.targets], function(h){
				for(var len=h.length;len--;){
					var bo=h.pop();
					Jesm.pega(bo.el).del();
				}
			});
			App.html.mostraCursor.stop();
			this.addTarget();
			App.ui.displayInfo();
			Jesm.css(App.html.mostraCursor.elemento, "display:none");
			Jesm.Core.animator.addTarefa(function(){
				this.draw();
			}, this);
			App.html.root.classList.add('playing');
		},

		init:function(){
		},

		addPoints:function(b){
			if(b==null)
				b=1;
			this.pontuacao+=b;
			App.ui.updateScore();
		}

	},

	init:function(root){
		Jesm.Core.requestAnimationFrame=false;
		this.html.root=root;

		this.cfg.init();
		this.ui.init();
		this.game.init();

		var size=App.cfg.cursorDiameter-2, frag=document.createDocumentFragment();

		this.html.cursor=Jesm.el('div', 'class=cursor', frag);
		this.html.cursor.setAttribute("unselectable", "on");
		this.html.mostraCursor=new Jesm.Anima(Jesm.el('div', 'class=mostra_cursor', frag), "opacity", "linear");

		Jesm.css(this.html.cursor, "width:"+size+"px;height:"+size+"px;margin:-"+size/2+"px 0 0 -"+size/2+"px;top:-"+size+"px");
		Jesm.css(this.html.mostraCursor.elemento, "display:none;width:"+size+"px;height:"+size+"px;margin:-"+size/2+"px 0 0 -"+size/2+"px");

		Jesm.addEvento(window, "click", function(e){
			Jesm.Cross.preventDefault(e||window.event);
		});
		Jesm.addEvento(window, "mousemove", function(e){
			var arr=Jesm.Cross.getMouse(e||window.event);
			this.game.mousePos=arr;
			Jesm.css(this.html.cursor, "left:"+arr[0]+"px;top:"+arr[1]+"px");
		}, this);
		// Jesm.addEvento(document.body, "keydown", function(e){
		// 	var ev=e||window.event;
		// 	switch(Jesm.Cross.which(ev)){
		// 		case 27: //jogo.pause.go();
		// 		break;
		// 	}
		// });

		this.html.root.appendChild(frag);

		App.ui.alert('Welcome to JesmBounce! Click "Ok" to continue')
		.then(function(){
			return App.ui.alert('Move your mouse over the purple circles to score!');
		})
		.then(function(){
			return App.ui.alert('Avoid the little dots!');
		})
		.then(function(){
			return App.ui.alert('Click "Ok" to start');
		})
		.then(function(){
			App.game.start();
		});
	}

};