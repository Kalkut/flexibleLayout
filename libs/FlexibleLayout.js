sand.define('flexibleLayout/FlexibleLayout',['flexibleLayout/*'], function (r) {
	return Seed.extend({
		'+init' : function (flexibleLayout) {
			this.clusters = flexibleLayout.clusters;
			this.clustersHTML = [];

			for(var i = 0, n = this.clusters.length; i < n; i++){
				this.clustersHTML.push(this.clusters[i].el);
			}

			this.el = toDOM({
				tag : '.flexibleLayout',
				children : this.clustersHTML
			});

			this.setDragAndDrop();
		},

		setDragAndDrop : function () {
			this.dragging = false;
			for(var i = 0, n = this.clusters.length; i < n; i++){
				for(var j = 0, m = this.clusters[i].cases.length; j < m; j++){
					(function (i,j) {//Too lazy to code curry -> closure
						this.clusters[i].cases[j].div.addEventListener("mousedown", function (e) {
							if (e.shiftKey && !this.dragging) {
								this.dragging = true;
								this.draggedCase = this.clusters[i].cases[j].div.cloneNode(true);
								this.draggedCase.style.pointerEvents = "none";
								document.body.appendChild(this.draggedCase);
								this.draggedCase.imgWrapped = this.clusters[i].cases[j].img.src;
							}
						}.bind(this))
						this.clusters[i].cases[j].el.addEventListener("mouseup", function (e) {
							if(this.dragging) {
								for(var position in this.clusters[i].cases[j].influence){
									if(this.clusters[i].cases[j].influence[position]){
										this.clusters[i].cases[j].fire('FlexibleCase:CaseDropSuccesful',this.draggedCase.imgWrapped,position,this.clusters[i].cases[j].index);
										console.log(this.draggedCase.imgWrapped,position);
										break;
									}
								}
							}
						}.bind(this))
					}.bind(this))(i,j);
				}
			}

			document.body.addEventListener("mousemove", function (e) {
				if(this.dragging){
					this.clicking = false;
					this.draggedCase.style.left = e.clientX - $(document.body).offset().left;
					this.draggedCase.style.top = e.clientY - $(document.body).offset().top;
				}
			}.bind(this))

			document.body.addEventListener("mouseup", function () {
				if(this.draggedCase) {
					document.body.removeChild(this.draggedCase); 
				}
				this.dragging = false;
			}.bind(this))
		},
	})
})