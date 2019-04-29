const marginLineChart = {
    top: 40,
    right: 150,
    bottom: 40,
    left: 60
  },
widthLineChart = 550 - marginLineChart.left - marginLineChart.right,
heightLineChart = 400 - marginLineChart.top - marginLineChart.bottom;
  
let svgLineChart = d3.select("#joiners-leavers-line-chart")   .append("svg")
  .attr("width", widthLineChart + marginLineChart.left + marginLineChart.right)
  .attr("height", heightLineChart + marginLineChart.top + marginLineChart.bottom)
  .append("g")
    .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");

// parse the date / time
let parseTime = d3.timeParse("%Y");
  // set the ranges
let x = d3.scaleTime().range([0, widthLineChart]);
let y = d3.scaleLinear().range([heightLineChart, 0]);

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);
  

svgLineChart.append("g")
  .attr("transform", "translate(0," + heightLineChart + ")")
  .attr("class", "x axis")
svgLineChart.append("g")
  .attr("class", "y axis")

  
// Get the data
d3.csv("data/joiners_vs_leavers.csv", function(error, data){
    
  // format the data
  data.forEach(function(d) {
    d.year = parseTime(d.year);
    d.joiners_UK = +d.joiners_UK;
    d.leavers_UK = +d.leavers_UK;
    d.joiners_EEA = +d.joiners_EEA;
    d.leavers_EEA = +d.leavers_EEA;
    d.joiners_NEEA = +d.joiners_NEEA;
    d.leavers_NEEA = +d.leavers_NEEA;
    
    d.joiners_TOTAL = d.joiners_UK + d.joiners_EEA + d.joiners_NEEA;
    d.leavers_TOTAL = d.leavers_UK + d.leavers_EEA + d.leavers_NEEA;
  });
   
  draw("joiners_TOTAL", "leavers_TOTAL");
    

  function draw(joiners, leavers){

    let t = d3.transition()
      .duration(1000);

    // define the joiners line
    let joinersline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d[joiners]); });

    // define the leavers line
    let leaversline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d[leavers]); });
      
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([d3.min(data, function(d) { 
      return Math.min(d[leavers],d[joiners]);
    }), d3.max(data, function(d) { 
      return Math.max(d[leavers],d[joiners]);
    })]).nice();
    
    // Add the joiners path
    let joinersLines = svgLineChart.selectAll(".joiners.line")
      .data([data]);

    joinersLines
      .enter()
        .append("path")
        .attr("class", "joiners line")
      .merge(joinersLines)
        .transition(t)
        .attr("d", joinersline);

    joinersLines
      .exit()
      .remove();

    // Add the dots and tooltips to joiners path
    let joinersDots = svgLineChart.selectAll(".joiners.dot")
      .data(data);

    joinersDots
        .enter()
        .append("circle")
        .attr("class", "joiners dot")
        .on("mouseover", function(d){
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);

          tooltip.html("<b>Year " + d.year.getFullYear() + "</b>: <br>" + d[joiners])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", mouseOut)

        .merge(joinersDots)
          .transition(t)
          .attr("r", 4)
          .attr("cx", function(d){return x(d.year);})
          .attr("cy", function(d){return y(d[joiners]);})
          .attr("fill", "#66c2a5")

    joinersDots // add tooltip to new dots as well
        .on("mouseover", function(d){
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);

          tooltip.html("<b>Year " + d.year.getFullYear() + "</b>: <br>" + d[joiners])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", mouseOut);
  
    // Add the leavers path
    let leaversLines = svgLineChart.selectAll(".leavers.line")
    .data([data]);
    
    leaversLines
      .enter()
        .append("path")
        .attr("class", "leavers line")
      .merge(leaversLines)
        .transition(t)
        .attr("d", leaversline);

    leaversLines
      .exit()
      .remove();

    // Add the dots and tooltips to leavers path
    let leaversDots = svgLineChart.selectAll(".leavers.dot")
      .data(data);

    leaversDots
      .enter()
      .append("circle")
      .attr("class", "leavers dot")
      .on("mouseover", function(d){
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);

        tooltip.html("<b>Year " + d.year.getFullYear() + "</b>: <br>" + d[leavers])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", mouseOut)
   
      .merge(leaversDots)
        .transition(t)
        .attr("r", 4)
        .attr("cx", function(d){return x(d.year);})
        .attr("cy", function(d){return y(d[leavers]);})
        .attr("fill", "#1f78b4");

    leaversDots // add tooltip to new dots as well
        .on("mouseover", function(d){
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);

          tooltip.html("<b>Year " + d.year.getFullYear() + "</b>: <br>" + d[leavers])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", mouseOut);


    // add y axis
    svgLineChart.select(".x.axis")
      .transition(t)
      .call(xAxis);

    svgLineChart.select(".y.axis")
      .transition(t)
      .call(yAxis);
      
    svgLineChart.selectAll(".label.text")
      .remove()

    svgLineChart.append("text")
      .transition(t)
      .attr("transform", "translate("+(widthLineChart+5)+","+y(data[data.length-1][leavers])+")")
      .attr("class", "label text")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#1f78b4")
      .text("Leavers");
      
    svgLineChart.append("text")
      .transition(t)
      .attr("transform", "translate("+(widthLineChart+5)+","+y(data[data.length-1][joiners])+")")
      .attr("class", "label text")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "#66c2a5")
      .text("First time joiners");

    svgLineChart.append("text")
      .attr("class", "y axisTitle label text")
      .attr("transform", "rotate(-90)")
      .attr("y", -56)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of nurses and midwifes");

    }
    

    function mouseOut(d){
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    };


    const exploreJoinersBtnDiv = document.querySelector(".explore-joiners .step-btns");
    const explanationDiv = document.querySelector(".explore-joiners .explanation");

    // handle buttons to change visualisation and according explanation
    exploreJoinersBtnDiv.addEventListener("click", function(e){
  
      switch (e.target.id ){
        case "joiners-total":
          draw("joiners_TOTAL", "leavers_TOTAL");
          explanationDiv.innerHTML =`<h4> Total number of joiners and leavers.</h4>
          <p>The total number of first joiners continues to fall, with the lowest number since 2014.
          <br>
          For the second succeeding year, the number of leavers is larger than the number of joiners. However, in comparison to 2017, the number of leavers decreased by 5577 in 2018.`;
          break; 
        
        case "joiners-uk":
          draw("joiners_UK", "leavers_UK")
          explanationDiv.innerHTML= `<h4> Joiners and leavers with initial registration in the UK</h4>
          <p>The number of leavers continues to be higher than the first time joiners. However, the number of leavers in 2018 is lower than in 2017.  </p>`;
          break;
    
        case "joiners-neea":
          draw("joiners_NEEA", "leavers_NEEA")
          explanationDiv.innerHTML=`<h4> Joiners and leavers with initial registration outside EEA </h4>
          <p>The group of people with initial registration outside the EEA is the only one where the number of first time joiners is higher than the number of leavers, with the peak in 2018.</p>`;
          break;
    
        case "joiners-eea":
          draw("joiners_EEA", "leavers_EEA")
          explanationDiv.innerHTML=`<h4> Joiners and leavers with initial registration in EEA </h4>
          <p>The number of first time joiners with the initial registration in the EEA decreased dramatically since 2016, from the number of 10178 joiners to only 888 in 2018.<br>
          Also, the number of leavers continues to grow, with the peak of 4068 leavers in 2017.</p>`;
          break;
      }
        
    })
});