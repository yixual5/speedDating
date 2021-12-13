var rowConverter = function (d) {
  if ((d.wave < 6 || d.wave > 9) && d.attr1_1 != '' && d.attr1_2 != '' && d.attr1_3 != '') {
    return {
      iid: d.iid,
      period1: d.attr1_1,
      period2: d.attr1_2,
      period3: d.attr1_3,
    };
  }
};

  
var bar = document.getElementById("mybar");
var output = document.getElementById("period");
output.innerHTML = bar.value;

bar.oninput = function() {
  output.innerHTML = this.value;
}

// set the dimensions and margins of the graph
var w = 600;
var h = 500;
var margin = {top: 50, right: 30, bottom: 40, left: 70},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;
var innerWidth = w - margin.left - margin.right;
var innerHeight = h - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#mysvg")
  .append("svg")
    .attr("width", w)
    .attr("height", h)

svg.append("rect")
   .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "white");

var x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);
      
var dur = 750

var yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([innerHeight, 0])

var xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

var xAxis = d3.axisBottom()
  .scale(xScale);

var yAxis = d3.axisLeft()
  .scale(yScale);

d3.csv('https://raw.githubusercontent.com/yixual5/speedDating/master/Speed%20Dating%20Data.csv',rowConverter)
  .then(function (data) {
    var d = [];
    data.forEach(function(item){
      var i = d.findIndex(x => x.iid == item.iid);
      if(i <= -1){
      d.push({iid: item.iid, level: 1, attractiveness: item.period1});
      d.push({iid: item.iid, level: 2, attractiveness: item.period2});
      d.push({iid: item.iid, level: 3, attractiveness: item.period3});
      }
    });
    function getBins(data, level, nbin) {
      var temp = d3.histogram()
          .value(function(d) { return d.attractiveness;})
          .domain([0,100])
          .thresholds(x.ticks(nbin));
      var dt = data.filter(val => val.level == level);
      console.log(dt)
      return temp(dt)
    }
    
    var bins = getBins(d, 1, 10);
    var bars = svg.append("g")
        .attr("id", "plot")
        .attr("transform", `translate (${margin.left}, ${margin.top})`)
        .selectAll("rect")
        .data(bins);
    
    bars.enter().append("rect")
        .merge(bars)
        .transition()
        .attr("x", (d,i)=>xScale(i*10))
        .attr("y", d=> yScale(d.length))
        .attr("width", function(d) {
          return x(d.x1) - x(d.x0);
        })
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", "#CBC3E3");
    
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate (${margin.left}, ${h - margin.bottom})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate (${margin.left}, ${margin.top})`)
        .call(yAxis);
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w-220)
        .attr("y", h)
        .text("attractiveness score");
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("x", -200)
        .attr("dy", ".95em")
        .attr("transform", "rotate(-90)")
        .text("frequency");
    
    d3.select("#mybar")
      .on("click", function () {
        var slider = document.getElementById("mybar");
        console.log(slider.value)
        plot(d, slider.value, 10);
    })
    
    
    var plot = function(data, tmplevel, nbin) {
      // And apply this function to data to get the bins
      var bins = getBins(data, tmplevel, nbin)
    
      xScale.domain([0,100]);
    
      yScale.domain([0, 100]);
    
      var bars = svg.select("#plot")
                .selectAll("rect")
                .data(bins);

       bars.enter()
              .append("rect")
              .attr("x", (d,i)=>xScale(i*10))
              .attr("y", d=> yScale(d.length))
              .attr("width", function(d) {
                return x(d.x1) - x(d.x0);
              })
              .attr("height", d => innerHeight - yScale(d.length))
              .attr("fill", "#CBC3E3")
              .merge(bars)
                .transition()
                .duration(dur)
                .ease(d3.easeLinear)
                .attr("x", (d,i)=>xScale(i*10))
                .attr("y", d=> yScale(d.length))
                .attr("width", function(d) {
                  return x(d.x1) - x(d.x0);
                })
                .attr("height", d => innerHeight - yScale(d.length))

      
      //bars.exit().remove();
      // Y axis: scale and draw:
      svg.select(".xAxis")
                .transition()
                .duration(dur)
                .ease(d3.easeLinear)
                .call(xAxis);
     svg.select(".yAxis")
                .transition()
                .duration(dur)
                .ease(d3.easeLinear)
                .call(yAxis);
    }

    
  })
  .catch(function (error) {
       
  });
