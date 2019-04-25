
const marginLineChart = {
    top: 40,
    right: 150,
    bottom: 40,
    left: 60
  },
  widthLineChart = 550 - marginLineChart.left - marginLineChart.right,
  heightLineChart = 400 - marginLineChart.top - marginLineChart.bottom;
  
  // parse the date / time
  var parseTime = d3.timeParse("%Y");
  // set the ranges
  var x = d3.scaleTime().range([0, widthLineChart]);
  var y = d3.scaleLinear().range([heightLineChart, 0]);
  
  // let div = d3.select("body").append("div")
  //     .attr("class", "tooltip")
  //     .style("opacity", 0);

  let svgLineChart = d3.select("#joiners-leavers-line-chart")   .append("svg")
      .attr("width", widthLineChart + marginLineChart.left + marginLineChart.right)
       .attr("height", heightLineChart + marginLineChart.top + marginLineChart.bottom)
     .append("g")
      .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");

 
      // define the joiners line
  let joinersline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.joiners); });

      // define the leavers line
  let leaversline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.leavers); });

     
  // Get the data
  d3.csv("joiners_vs_leavers.csv", function(error, data){
    
       // format the data
       data.forEach(function(d) {
        d.year = parseTime(d.year);
        d.joiners_UK = +d.joiners_UK;
        d.leavers_UK = +d.leavers_UK;
        d.joiners_EEA = +d.joiners_EEA;
        d.leavers_EEA = +d.leavers_EEA;
        d.joiners_NEEA = +d.joiners_NEEA;
        d.leavers_NEEA = +d.leavers_NEEA;
    
        d.joiners = d.joiners_UK + d.joiners_EEA + d.joiners_NEEA;
        d.leavers = d.leavers_UK + d.leavers_EEA + d.leavers_NEEA;
      });
      
      
      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.year; }));
      y.domain([d3.min(data, function(d) { 
        return Math.min(d.leavers,d.joiners);
      }), d3.max(data, function(d) { 
        return Math.max(d.leavers,d.joiners);
      })]).nice();
      
    
      // Add the joiners path
      svgLineChart.append("path")
        .data([data])
        .attr("class", "joiners line")
        .attr("d", joinersline);
    
      // Add the leavers path
      svgLineChart.append("path")
        .data([data])
        .attr("class", "leavers line")
        .attr("d", leaversline);
    
    
      // Add the dots and tooltips to joiners path
      svgLineChart.selectAll("dot")
        .data(data)
        .enter().append("circle")
          .attr("r", 4)
          .attr("cx", function(d){return x(d.year);})
          .attr("cy", function(d){return y(d.joiners);})
          .attr("fill", "green")
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html("Year " + d.year.getFullYear() + ": <br>" + d.joiners)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
    
      // Add the dots and tooltips to leavers path
      svgLineChart.selectAll("dot")
        .data(data)
        .enter().append("circle")
          .attr("r", 4)
          .attr("cx", function(d){return x(d.year);})
          .attr("cy", function(d){return y(d.leavers);})
          .attr("fill", "red")
          .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html("Year " + d.year.getFullYear() + ": <br>" + d.leavers)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });
      // add x axis
      svgLineChart.append("g")
        .attr("transform", "translate(0," + heightLineChart + ")")
        .call(d3.axisBottom(x));
    
      // add y axis
      svgLineChart.append("g")
        .call(d3.axisLeft(y))
        .attr("class", "y axis")
        .append("text")
          .attr("class", "y axisTitle")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Number of nurses and midwives");;
    
     
       svgLineChart.append("text")
        .attr("transform", "translate("+(widthLineChart+5)+","+y(data[data.length-1].leavers)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "red")
        .text("Leavers");
    
      svgLineChart.append("text")
        .attr("transform", "translate("+(widthLineChart+5)+","+y(data[data.length-1].joiners)+")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("First time joiners");
      
        
  });

  // TODO: refactor to show diffenrt data as on total stack chart