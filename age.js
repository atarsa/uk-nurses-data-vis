// Code loosly inspired by this article https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html by Yan Holtz 
    // assessed @14/04/2019
    // Setup svg using Bostock's margin convention
const marginAgeStack = {
      top: 40,
      right: 170,
      bottom: 40,
      left: 60
    },
widthAgeStack = 560 - marginAgeStack.left - marginAgeStack.right,
heightAgeStack = 500 - marginAgeStack.top - marginAgeStack.bottom;

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
const svgAgeStack = d3.select("#age-stack-chart")
  .append("svg")
    .attr("width", widthAgeStack + marginAgeStack.left + marginAgeStack.right)
    .attr("height", heightAgeStack + marginAgeStack.top + marginAgeStack.bottom)
  .append("g")
    .attr("transform", "translate(" + marginAgeStack.left + "," + marginAgeStack.top + ")");

  // Add the x axis
svgAgeStack.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${heightAgeStack})`);

// Add the y axis
svgAgeStack.append("g")
  .attr("class", "y axis")
  

// create colours array
const coloursAgeStack = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffffcc'];
  
    
function showAgeStackChart(){

  // Get the data
  d3.csv("data/age_groups.csv", type, function (error, data) {
      
    // Set x, y
    let x = d3.scaleBand()
      .range([0, widthAgeStack])
      .padding(0.01);

    let y = d3.scaleLinear()
      .range([heightAgeStack, 0]);

    let x_axis =d3.axisBottom(x).tickSizeOuter(0);
    let y_axis = d3.axisLeft(y);
     
    // list of subgroups (header of csv files)
    let subgroups = data.columns.slice(1);

    // list of years -> x axis
    let years = d3.map(data, function (d) {
        return d.Year
    }).keys();

    // Set x domain  and colours
    x.domain(years)
        
    let colour = d3.scaleOrdinal()
      .domain(subgroups)
      .range(coloursAgeStack); // TODO: change colors
    
      // create transition object
    let t = d3.transition()
      .duration(1500);

    y.domain([0, d3.max(data, function (d) { return d.total;})]).nice();

    // stack the data
    let stackedData = d3.stack()
     .keys(subgroups)
     (data)

     // If percent percent chart present remove it 
    svgAgeStack.selectAll(".percent")
      .remove()

    // show the bars
    let bars = svgAgeStack
      .selectAll(".stack")
      .data(stackedData)
      .attr("fill", function (d) { return colour(d.key); })
    
    bars.enter()
      .remove()

    // enter new
    let newBars = bars
      .enter()
      .append("g")
      .attr("class", "stack")
        .attr('height', 0)
        .attr('y', heightAgeStack)
      .attr("fill", function (d) {
        return colour(d.key);
      })
     
      .selectAll("g")
      // enter a second time -> loop subgroups to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")

    newBars.merge(bars)
      .transition(t)
      .attr("x", function (d) {return x(d.data.Year); })
      .attr("y", function (d) { return y(d[1]);})
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())

    newBars
      .on("mouseover", function (d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);

        // subgroup Name and Value with reference to https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html 
        let subgroupName = d3.select(this.parentNode).datum().key;
        let subgroupValue = d.data[subgroupName];
        tooltip.html(`<b>${subgroupName}</b>: <br>${subgroupValue}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mousemove", function(d) { 
         tooltip.style('top', (d3.event.pageY - 20) + "px")
         .style('left', (d3.event.pageX + 20) + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });


     // Call the  axis
    svgAgeStack.select('.x.axis')
      .transition(t)
      .call(x_axis);

    svgAgeStack.select('.y.axis')
      .transition(t)
      .call(y_axis);

      addLegendAgeStack(data)
    })
  };

  function showAgePercentStack(){

    // Get the data
    d3.csv("data/age_groups.csv", type, function (error, data) {

      if (error) throw error;
      
        
      // Set x, y
      let x = d3.scaleBand()
        .range([0, widthAgeStack])
        .padding(0.01);

      let y = d3.scaleLinear()
        .range([heightAgeStack, 0]);

      let x_axis =d3.axisBottom(x).tickSizeOuter(0);
      let y_axis = d3.axisLeft(y);
      
      // list of subgroups (header of csv files)
      let subgroups = data.columns.slice(1);

      // list of years -> x axis
      let years = d3.map(data, function (d) { return d.Year; }).keys();

      // Set x domain  and colours
      x.domain(years)
            
      let colour = d3.scaleOrdinal()
        .domain(subgroups)
        .range(coloursAgeStack);

      // create transition object
      let t = d3.transition()
        .duration(1000);

      y.domain([0,100]);

      data.forEach(function(d){
          // compute total
        total = 0;
        for (i in subgroups){
          columnName = subgroups[i];
          total += +d[columnName];
        }
        // compute percent
        for (i in subgroups){
          columnName = subgroups[i];
          d[columnName] = d[columnName] / total * 100;
        }
      });
        
      // stack the data
      let stackedData = d3.stack()
        .keys(subgroups)
        (data)

      // If stack chart present remove it 
      svgAgeStack.selectAll(".stack")
        .remove()

      // show the bars
      let bars = svgAgeStack
        .selectAll(".percent")
        .data(stackedData)
        .attr("fill", function (d) {
          return colour(d.key);
        })
        
      bars.enter()
        .remove()

      // enter new
      let newBars = bars
        .enter()
        .append("g")
        .attr("class", "percent")
          .attr('height', 0)
          .attr('y', heightAgeStack)
          .attr("fill", function (d) {
          return colour(d.key);
        })
        
        .selectAll("g")
        // enter a second time -> loop subgroups to add all rectangles
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")

      newBars.merge(bars)
        .transition(t)
        .attr("x", function (d) {return x(d.data.Year); })
        .attr("y", function (d) { return y(d[1]) ;})
        .attr("height", function (d) { 
          return y(d[0]) - y(d[1]) ; })
        .attr("width", x.bandwidth())

      newBars
        .on("mouseover", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);

            // subgroup Name and Value with reference to https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html 
          let subgroupName = d3.select(this.parentNode).datum().key;
          let subgroupValue = d.data[subgroupName];
          tooltip.html(`<b>${subgroupName}</b>: <br>${subgroupValue.toFixed(1)}%`)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          })

          .on("mousemove", function(d) { 
            tooltip.style('top', (d3.event.pageY - 20) + "px")
            .style('left', (d3.event.pageX + 20) + "px");
          })

          .on("mouseout", function (d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          });

      // Call the  axis
      svgAgeStack.select('.x.axis')
        .transition(t)
        .call(x_axis);

      svgAgeStack.select('.y.axis')
        .transition(t)
        .call(y_axis);
      
      addLegendAgeStack(data)

    })
  }

  function addLegendAgeStack(data){

  // add legend 
  let legend = svgAgeStack.selectAll(".legend")
    .data(data.columns.slice(1))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })
  
    legend.append("rect")
    .attr("x", widthAgeStack + 18)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", function(d,i ){
      return coloursAgeStack[i];
    });

    legend.append("text")
    .attr("x", widthAgeStack + 44)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(function (d) {
      return d;
    });
  }

  
  function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }
  
  // Show age stack chart as deafult 
  showAgeStackChart();
  d3.selectAll("input").on("change", function(){
      
      if (this.value == "stacked"){
        showAgeStackChart();
      } else {
        showAgePercentStack();
      }
  })

 
