sand.define('flexibleLayout/FlexibleCase',['Case','DOM/handle'], function (r) {
  return r.Case.extend({
    '+init' : function (flexibleCase) {

      this.breadth = flexibleCase.influenceArea && flexibleCase.influenceArea.breadth ? flexibleCase.influenceArea.breadth : "15px" 
      
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
          height : this.breadth
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
          width : this.breadth, 
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
          height : this.breadth
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
          width : this.breadth , 
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
          width : (parseInt(this.div.style.width) + 2*parseInt(this.breadth) + "px"), 
          height : (parseInt(this.div.style.height) + 2*parseInt(this.breadth) + "px"),
        },
        children : this.influenceAreas.concat(this.div)
      });
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
    },

    reSizeFlex : function (size) {
      var breadth = parseInt(this.breadth);
      if(size.width && size.height) {
        this.el.style.width = size.width;
        this.el.style.height = size.height;
        this.influenceAreas[0].style.width = this.influenceAreas[2].style.width = size.width - 2*breadth;
        this.influenceAreas[1].style.height = this.influenceAreas[3].style.height = size.height - 2*breadth;
        this.reSize({width : size.width - 2*this.breadth, height : size.height - 2*breadth});
      } else if (size.width){
        this.el.style.width = size.width;
        this.influenceAreas[0].style.width = this.influenceAreas[2].style.width = size.width - 2*breadth;
        this.reSize({width : size.width - 2*breadth});
      } else if (size.height){
        this.el.style.height = size.height;
        this.el.children[1].style.height = size.height - 2*breadth;
        this.el.children[3].style.height = size.height - 2*breadth;
        console.log(this.el.children[1].style.height)
        this.reSize({height : size.height - 2*breadth});
      }
    }
  })
})