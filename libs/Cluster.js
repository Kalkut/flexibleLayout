sand.define('flexibleLayout/Cluster',['flexibleLayout/FlexibleCase'], function (r) {
  Function.prototype.curry = function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return function () {
      return self.apply([], args.concat(Array.prototype.slice.call(arguments)));
    };
  }

  return Seed.extend({
    '+init' : function (cluster) {
      this.cases = cluster.cases;
      this.breadth = cluster.breadth || cluster.cases ? cluster.cases[0].breadth : "15px";

      this.setHTML();// put the HTML of all the cases in this.casesHTML, wrap it in this.el

      

      this.on('Cluster:insertion', function () {
        this.setIndexes();
        this.setHTML();
        this.setSubscriptions();
      }.bind(this));
      
      this.on('Cluster:deletion', function () {
        this.setIndexes();
        this.setHTML();
        this.setSubscriptions();
      }.bind(this));

      this.setIndexes();
      this.setSubscriptions();

      
    },

    vInsert : function (imgDropped,influence,k) {
      var newCase = this.vNewCase(imgDropped);

      this.cases = this.cases.slice(0,k).concat(influence === "bottom" ? [this.cases[k],newCase] : [newCase,this.cases[k]]).concat(this.cases.slice(k+1))
      this.fire('Cluster:insertion');
    },

    hInsert : function (imgDropped,position,k) {

      position === "left" ? k:k++;
      
      var newCase = this.hNewCase(imgDropped);

      this.cases = this.cases.slice(0,k).concat(newCase).concat(this.cases.slice(k));
      this.fire('Cluster:insertion');
    },

    hNewCase : function (newImage) {
      var width = 0;
      for(var i = 0, n = this.cases.length; i < n; i++) {
        width += parseInt(this.cases[i].el.style.width);
      }
      
      width/=(this.cases.length+1);
      
      for(var k = 0, l = this.cases.length; k < l; k++) {
        var imgSrc = this.cases[k].img.src;
        var height = parseInt(this.cases[k].el.style.height); // DOES NOT NEED TO BE IN THE LOOP SINCE WIDTH IS SUPPOSED TO BE THE SAME IN AN HORIZONTAL LAYERED CLURSTER
        this.cases[k].reSizeFlex({width : width});// = new r.FlexibleCase({ width : width, height : height, type : 'img', imgSrc : imgSrc})
      }

      return new r.FlexibleCase({ width : width - 2*parseInt(this.breadth), height : height - 2*parseInt(this.breadth), type : 'img', imgSrc : newImage});
    },

    vNewCase : function (newImage) {
      var height = 0;
      for(var i = 0, n = this.cases.length; i < n; i++) {
        height += parseInt(this.cases[i].el.style.height);
      }
      
      height/=(this.cases.length+1);
      
      for(var k = 0, l = this.cases.length; k < l; k++) {
        var imgSrc = this.cases[k].img.src;
        var width = parseInt(this.cases[k].el.style.width); // DOES NOT NEED TO BE IN THE LOOP SINCE WIDTH IS SUPPOSED TO BE THE SAME IN AN HORIZONTAL LAYERED CLURSTER
        this.cases[k].reSizeFlex({height : height});// = new r.FlexibleCase({ width : width, height : height, type : 'img', imgSrc : imgSrc})
        console.log(this.cases)
      }

      return new r.FlexibleCase({ width : width - 2*parseInt(this.breadth), height : height - 2*parseInt(this.breadth), type : 'img', imgSrc : newImage});
    },

    setIndexes : function () {
      for(var k = 0, m = this.cases.length; k < m; k++){
        this.cases[k].index = k;
      }
    },

    setSubscriptions : function () {
      if(!this.subscriptions) this.subscriptions = [];
      else {
        for(var i = 0, n = this.subscriptions.length; i < n; i++) {
          this.subscriptions[i].un();
        }
        this.subscriptions = [];
      }
      for(var k = 0, m = this.cases.length; k < m; k++){
        this.subscriptions.push(this.cases[k].on('FlexibleCase:CaseDropSuccesful', function (k,image,influence) {
          this.handleDrop(image,influence,this.cases[k].index); //this.cases[k].index obviously is k IF the cases indexes have been set before
        }.bind(this).curry(k)))
      }
    },

    handleDrop : function (image,influence,index) {
      if(influence === "top" || influence === "bottom") this.vInsert(image,influence,index);
      else if(influence === "left" || influence === "right") this.hInsert(image,influence,index);
    },

    setHTML : function () {
      if(this.casesHTML && this.el) {
       for(var k = 0, m = this.casesHTML.length; k < m; k++){
        this.el.removeChild(this.casesHTML[k]);
      } 
    } else this.el = toDOM({tag : '.cluster'});

    this.casesHTML = [];
    
    for(var i = 0, n = this.cases.length; i < n; i++){
      this.casesHTML.push(this.cases[i].el);
      this.el.appendChild(this.casesHTML[i]);
    }

    
  },


})
})