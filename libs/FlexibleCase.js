sand.define('flexibleLayout/FlexibleCase',['Case','DOM/handle'], function (r) {
  return r.Case.extend({
    '+init' : function (flexibleCase) {

      var breadth = flexibleCase.influenceArea && flexibleCase.influenceArea.breadth ? flexibleCase.influenceArea.breadth : "15px" 
      
      this.influence = {
        top : false,
        right : false,
        bottom : false,
        left : false
      }

      this.influenceAreas = [
      toDOM({ 
        tag : '.case-top', 
        style : { 
          width : this.div.style.width, 
          height : breadth
        },
        events : {
          mouseover : function () {
            this.influence.top = true;
          }.bind(this),
          mouseout : function () {
            this.influence.top = false;
          }.bind(this)
        }
      }),
      toDOM({ 
        tag : '.case-right', 
        style : { 
          width : breadth, 
          height : this.div.style.height
        },
        events : {
          mouseover : function () {
            this.influence.right = true;
          }.bind(this),
          mouseout : function () {
            this.influence.right = false;
          }.bind(this)
        }
      }),
      toDOM({ 
        tag : '.case-bottom', 
        style : { 
          width : this.div.style.width, 
          height : breadth
        },
        events : {
          mouseover : function () {
            this.influence.bottom = true;
          }.bind(this),
          mouseout : function () {
            this.influence.bottom = false;
          }.bind(this)
        }
      }),
      toDOM({ 
        tag : '.case-left', 
        style : { 
          width : breadth , 
          height : this.div.style.height
        },
        events : {
          mouseover : function () {
            this.influence.left = true;
          }.bind(this),
          mouseout : function () {
            this.influence.left = false;
          }.bind(this)
        }
      })
      ];
      
      this.el = toDOM({
        tag : '.flexibleCase', 
        style : { 
          width : (parseInt(this.div.style.width) + 2*parseInt(breadth) + "px"), 
          height : (parseInt(this.div.style.height) + 2*parseInt(breadth) + "px"),
        },
        children : this.influenceAreas.concat(this.div)
      });

      this.dragging = false;
      
      //this.draggedCase = toDOM({}); 

      this.div.addEventListener("mousedown", function (e) {
        if (e.shiftKey && !this.dragging) {
          this.dragging = true;
          this.draggedCase = this.div.cloneNode(true);
          this.draggedCase.style.pointerEvents = "none";
          document.body.appendChild(this.draggedCase);
        }
      }.bind(this))

      document.body.addEventListener("mousemove", function (e) {
        if(this.dragging){
          this.clicking = false;
          this.draggedCase.style.left = e.clientX - $(document.body).offset().left;
          this.draggedCase.style.top = e.clientY - $(document.body).offset().top;
        }
      }.bind(this))

      document.body.addEventListener("mouseup", function (e) {
        for(var position in this.influence){
          if(this.influence[position]){
            this.fire('FlexibleCase:CaseDropSuccesful',this.img.src,position)
            console.log(this.img.src,position)
            break;
          }
        }
        if(this.dragging) document.body.removeChild(this.draggedCase);
        this.dragging = false;
        }.bind(this))

      // START DOESN'T ACTIVATE UPON CREATION OF DRAGGED DIV 
      /*r.handle(this.draggedCase).drag({
        start : function(e) {
        }.wrap(this),

        drag : function(e) {
          if(this.dragging) {
            console.log(this.draggedCase)
            this.draggedCase.style.left = e.xy[0];
            this.draggedCase.style.top = e.xy[1];
          }
        }.bind(this),

        end : function(e) {
          for(var position in this.influence){
            if(this.influence[position]){
              this.fire('FlexibleCase:CaseDropSuccesful',this.img.src,position)
              console.log(imgDropped,position)
              break;
            }
          }
          this.dragging = false;
          document.body.removeChild(this.draggedCase);
        }.bind(this)
      })*/

this.on('FlexibleCase:CaseDropSuccesful', function (imgDropped,influence) {
  /*this.fire(imgDropped,{type : influence.className, case :  COMMENT AVOIR LA CASE ??? });*/
})
}
})
})