sand.define('FlexibleLayout/Cluster',['FlexibleLayout/FlexibleCase'], function (r) {
  return Seed.extend({
    '+init' : function (cluster) {
      this.cases = cluster.cases;
    },

    hInsert : function (imgDropped,influence) {
      var test = influence.case;
      var k = 0;
      while(test !== this.cases[k]){
        k++
      }

      var newCase = this.hNewCase(imgDropped);

      return [this.case.slice(0,k), influence.type === "case-bottom" ? [this.case[k],newCase] : [newCase,this.case[k]], this.case.slice(k+1)]
    },

    vInsert : function (imgDropped,influence) {
      var test = influence.case;
      var k = 0;
      while(test !== this.cases[k]){
        k++
      }

      influence.type === "case-left" ? k:k++;
      
      var newCase = this.vNewCase(imgDropped);

      return  this.case.slice(0,k).concat(newCase).concat(this.case.slice(k));
    }
  })
})