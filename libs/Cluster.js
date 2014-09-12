sand.define('FlexibleLayout/Cluster',['FlexibleLayout/FlexibleCase'], function (r) {
  return Seed.extend({
    '+init' : function (cluster) {
      this.cases = cluster.cases;
      this.casesHTML = [];

      for(var i = 0, n = this.cases.length; i < n; i++){
        this.casesHTML.push(this.cases[i].el);
      }

      this.el = toDOM({
        tag : '.cluster',
        children : this.casesHTML
      });

    },

    hInsert : function (imgDropped,influence) {
      var test = influence.case;
      var k = 0;
      while(test !== this.cases[k]){
        k++
      }

      var newCase = this.hNewCase(imgDropped);

      this.cases = this.cases.slice(0,k).concat(influence.type === "case-bottom" ? [this.cases[k],newCase] : [newCase,this.cases[k]]).concat(this.cases.slice(k+1))
    },

    vInsert : function (imgDropped,influence) {
      var test = influence.case;
      var k = 0;
      while(test !== this.cases[k]){
        k++
      }

      influence.type === "case-left" ? k:k++;
      
      var newCase = this.vNewCase(imgDropped);

      this.cases = this.cases.slice(0,k).concat(newCase).concat(this.cases.slice(k));
    },

    hNewCase : function (newImage) {
      var height = 0;
      for(var i = 0, n = this.cases.length; i <= n; i++) {
        height += parseInt(this.cases[i].el.style.height);
      }
      
      height/=(this.cases.length+1);
      
      for(var k = 0, l = this.cases.length; k < l; i++) {
        var imageSrc = this.cases[i].imgSrc;
        var width = parseInt(this.cases[i].el.style.width); // DOES NOT NEED TO BE IN THE LOOP SINCE WIDTH IS SUPPOSED TO BE THE SAME IN AN HORIZONTAL LAYERED CLURSTER
        this.cases[i] = new r.FlexibleCase({ width : width, height : height, type : 'img', imgSrc : imgSrc})
      }
    },

    vNewCase : function (newImage) {

    },
  })
})