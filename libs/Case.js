sand.define('Case',["Geo/*"], function (r) {
	
	var onimagesload = function (imgs,callback) {
		var l = imgs.length;
		var c = 0;
		for (var i = 0; i < l; i++){
			if(imgs[i].loaded) c++;
			else imgs[i].onload = function () {
				c++;
				if (c === l) callback();
			}
		}

		if (c === l) callback();
	}

	return Seed.extend({
		'+options' : {
			type : 'img',
			clicking : false
		},

		'+init' : function (options) {
			
			this.img = new Image();
			if(options.imgSrc) this.img.src = options.imgSrc;
			this.img.style.position = "absolute";
			this.img.style.left = 0 +'px';
			this.img.style.top = 0 + 'px';
			this.type = options.type;
			this.fit = options.fit // Mode libre, pas de restriction sur le mouvement ou sur le zoom de l'image
			this.pos = options.pos;
			this.cursorOver = false;
			this.imgRect;
			this.divRect;
			this.staticPoint;
			
			this.div = toDOM({
				tag : 'div.' + (options.prefix ? (options.prefix + "-") : "") + "case",
				style : {
					/*position : "absolute",*/
					overflow : "hidden",
					width : options.width,
					height : options.height,
					outline : "none",
				}
			})

			if(this.type === 'txt') {
				this.txtBloc = toDOM({
					tag : 'table.' + (options.prefix ? (options.prefix + "-") : "") + "case",
					children : [
					{
						tag : 'tr.' + (options.prefix ? (options.prefix + "-") : "") + "case",
						children : [
						{
							tag : 'td.' + (options.prefix ? (options.prefix + "-") : "") + "case",
							children : [
							{
								tag : 'div.' + (options.prefix ? (options.prefix + "-") : "") + "case",
								events : {
									keyup : function () {
										this.fire('case:titleChanged',this.txtBloc.children[0].children[0].children[0].innerHTML);
									}.bind(this),
								},
								style : {
									color : options.color || "#AAAAAA",
								},
								attr : {
									contenteditable : true,
								}
							},
							]
						}
						]
					}],
				})

				this.div.onmousedown = function (e) {
					e.preventDefault();
					this.txtBloc.children[0].children[0].children[0].focus();
				}.bind(this)

				this.div.appendChild(this.txtBloc);

				this.on('case:setColor', function (color) {
					this.setColor(color);
				}.bind(this));

			}else if (this.type === 'img') {
				
				this.div.appendChild(this.img);
				this.clicking;
				this.cursorOver;
				this.posClick = [this.img.width/2,this.img.height/2];
				this.z = 0;
				this.div.onmousedown = function (e) {
					e.preventDefault()
					this.clicking = true;
				}.bind(this)
				
				addEventListener("mouseup", function (e) {
					this.clicking = false;
				}.bind(this))


				this.div.addEventListener('mousewheel', function (e) {
					if(e.shiftKey){
						e.preventDefault();
						
						var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));// 1 : mousewheelup, 2 : mousewheeldown
						var factor = delta > 0 ? 1.05 : 0.95;
						this.potentialRect = this.imgRect.move({staticPoint : this.staticPoint, scale : factor});// Merci Geo
						this.imgCenter = [parseInt(this.div.style.width)/2,parseInt(this.div.style.height)/2];
						this.staticPoint = new r.Geo.Point([e.clientX - this.div.offsetLeft,e.clientY - this.div.offsetTop]); //origine du referentiel du zoom = curseur
						this.staticPoint = this.staticPoint.inRef(this.imgRect.ref);//on dilate l'image en conservant statique la position du curseur -> on passe au référentiel de l'image
						
						if( (!this.fit && (( this.potentialRect.segX.length() >= this.divRect.segX.length() ) && ( this.potentialRect.segY.length() >= this.divRect.segY.length() ) ) ) ) {
							this.zoom(factor);
							this.fire('case:imageMovedPx',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
							this.fire('case:imageMovedInt',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
						}else if (this.fit) {
							
							if(!(Math.ceil(this.potentialRect.segX.c2) >= this.divRect.segX.c2 && Math.floor(this.potentialRect.segX.c1) <= this.divRect.segX.c1 && Math.floor(this.potentialRect.segY.c1) <= this.divRect.segY.c1 && Math.ceil(this.potentialRect.segY.c2) >= this.divRect.segY.c2 ) ) {
							this.imgRect.setCenter(this.divRect.getCenter())
							this.staticPoint = this.imgCenter
							this.zoom(factor);
							this.fire('case:imageMovedPx',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
							this.fire('case:imageMovedInt',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
							}else {
								this.zoom(factor);
							}

						}
					}
				}.bind(this))

				this.div.onmousemove = function (e) {
					
					if(this.clicking && !this.frozen) {
						this.staticPoint = new r.Geo.Point([e.clientX - this.div.offsetLeft, e.clientY - this.div.offsetTop].add([document.body.scrollLeft, document.body.scrollTop]));
						this.staticPoint = this.staticPoint.inRef(this.imgRect.ref);
						var deltaX = e.clientX - this.img.width/2 - this.posClick[0];
						var deltaY = e.clientY- this.img.height/2 - this.posClick[1];
						var delta = [deltaX,deltaY];
						this.potentialRect = this.imgRect.move({vector : delta});
						
						if ( (Math.ceil(this.potentialRect.segX.c2) >= this.divRect.segX.c2 && Math.floor(this.potentialRect.segX.c1) <= this.divRect.segX.c1 && Math.floor(this.potentialRect.segY.c1) <= this.divRect.segY.c1 && Math.ceil(this.potentialRect.segY.c2) >= this.divRect.segY.c2 ) ) {
							this.img.style.left = (parseInt(this.img.style.left) + deltaX) + 'px';
							this.img.style.top = (parseInt(this.img.style.top) + deltaY) + 'px';
							this.imgRect = this.potentialRect;
						}
						
						this.fire('case:imageMovedPx',this.img.style.left,this.img.style.top,this.img.style.width,this.img.style.height);
						this.fire('case:imageMovedInt',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));
					}
					this.posClick[0] = e.clientX - this.img.width/2;
					this.posClick[1] = e.clientY- this.img.height/2;
				}.bind(this)

				addEventListener("mousemove", this.div.onmousemove )

				this.loadCase(true);
				
			}	
		},

		zoom : function (factor) {// Merci Geo !
			this.imgRect = this.imgRect.move({staticPoint : this.staticPoint, scale : factor});
			this.img.style.width = this.imgRect.segX.getLength() + 'px';
			this.img.style.height = this.imgRect.segY.getLength() + 'px';
			this.img.style.left =  this.imgRect.segX.c1 + 'px';
			this.img.style.top = this.imgRect.segY.c1 + 'px';

			if (!this.fit && !(this.imgRect.segX.c2 >= this.divRect.segX.c2 && this.imgRect.segX.c1 <= this.divRect.segX.c1 && this.imgRect.segY.c1 <= this.divRect.segY.c1 && this.imgRect.segY.c2 >= this.divRect.segY.c2)){
				var fitImg = this.divRect.move({staticPoint : this.staticPoint}).forcedIn(this.imgRect);
				
				 this.imgRect.segX.c1 = this.imgRect.segX.c1 - fitImg.segX.c1;
				 this.img.style.left =  this.imgRect.segX.c1 + 'px'; 
				 this.imgRect.segY.c1 = this.imgRect.segY.c1 - fitImg.segY.c1;
				 this.img.style.top =  this.imgRect.segY.c1 + 'px';
				 this.imgRect.segY.c2 = this.imgRect.segY.c1 + parseInt(this.img.style.height);
				 this.imgRect.segX.c2 = this.imgRect.segX.c1 + parseInt(this.img.style.width);
			}
			

		},

		loadCase : function (firstLoad) {//methode permettant d'initialiser la position de l'image
			var loading = function () {

				if(this.pos) {
					this.ratio = parseInt(this.img.naturalHeight)/parseInt(this.img.naturalWidth);
					this.img.style.width = this.pos[2] + 'px';
					this.img.style.height = this.pos[3] + 'px';
					this.img.style.left = this.pos[0] + 'px';
					this.img.style.top = this.pos[1] + 'px';
				}else {
					this.img.style.height = this.img.naturalHeight + 'px';
					this.img.style.width = this.img.naturalWidth + 'px';
					this.img.style.left = 0 + 'px';
					this.img.style.top = 0 + 'px';
					this.ratio = parseInt(this.img.naturalHeight)/parseInt(this.img.naturalWidth);

					var height = parseInt(this.div.style.height);
					var width = parseInt(this.div.style.width);

					var ratioDiv = height/width;

					if (this.ratio > ratioDiv) {
						this.img.style.width = width  + 'px';
						this.img.style.height = width*this.ratio + 'px';
					}else {
						this.img.style.height = height + 'px';
						this.img.style.width = height/this.ratio + 'px';
					}
				}

				var imgX = parseInt(this.img.style.left);
				var imgY = parseInt(this.img.style.top);

				var segX = new r.Geo.Seg(imgX, imgX + parseInt(this.img.style.width));
				var segY = new r.Geo.Seg(imgY, imgY + parseInt(this.img.style.height));

				var segDivX = new r.Geo.Seg(0, width);
				var segDivY = new r.Geo.Seg(0, height);

				this.divRect = new r.Geo.Rect({ segX : segDivX, segY : segDivY });
				this.imgRect = new r.Geo.Rect({ segX : segX, segY : segY});
				this.fire('case:imageMovedInt',parseInt(this.img.style.left),parseInt(this.img.style.top),parseInt(this.img.style.width),parseInt(this.img.style.height));

			}.bind(this);

			if(!firstLoad) {
				loading();
			}
			else  onimagesload([this.img], loading); 

		},

		freeze : function () {
			this.frozen = true;
		},

		unfreeze : function () {
			this.frozen = false;
		},

		setColor : function(color) {
			this.txtBloc.children[0].children[0].children[0].style.color = color;
		},

		reSize : function(size) {
			this.div.style.width = size.width;
			this.div.style.height = size.height;
			this.loadCase();
		}
	})
})