// Code loosly inspired by this article https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html by Yan Holtz 
    // assessed @14/04/2019
    // Setup svg using Bostock's margin convention
    const margin = {
      top: 40,
      right: 150,
      bottom: 40,
      left: 60
    },
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3.select("#vis3")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set x, y
  let x = d3.scaleBand()
      .range([0, width])
      .padding(0.01);

  let y = d3.scaleLinear()
      .range([height, 0]);

  // Add the x axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`);

  
// Add the y axis
  svg.append("g")
    .attr("class", "y axis")
  
  let x_axis =d3.axisBottom(x).tickSizeOuter(0);
  let y_axis = d3.axisLeft(y);

  // create colours array
  const colours = ["#ccebc5", "#b3cde3", "#fbb4ae", '#e41a1c','#377eb8','#4daf4a','#C7EFCF','#FE5F55','#EEF5DB', "yellow"];
  
  // Create div for tooltip
  let div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// create keys array to store names of the columns
const keys = ["UK", "Outside the EEA", "EEA"]; 





function showStackedChartTotal(){
  // Get the data
  d3.csv("age_groups.csv", type, function (error, data) {

    if (error) throw error;

    // create transition object
    let t = d3.transition()
        .duration(1500);
        
    // list of subgroups (header of csv files)
    let subgroups = data.columns.slice(1);

    // list of years -> x axis
    let years = d3.map(data, function (d) {
      return d.Year
    }).keys();


    // Set x, y and colours
    x.domain(years)
      
    y.domain([0, d3.max(data, function (d) {
        return d.total;
      })]).nice();

    
    let colour = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#ccebc5", "#b3cde3", "#fbb4ae", '#e41a1c','#377eb8','#4daf4a','#C7EFCF','#FE5F55','#EEF5DB', "yellow"]); // TODO: change colors
    
    
     // stack the data
     let stackedData = d3.stack()
     .keys(subgroups)
     (data)

  // If percent stack chart present remove it 
   svg.selectAll(".percent")
       .remove()

       // show the bars
   let bars = svg
     .selectAll(".stack")
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
      .attr("class", "stack")
        .attr('height', 0)
        .attr('y', height)
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


        
      
      newBars.on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);

        // subgroup Name and Value with reference to https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html 
        let subgroupName = d3.select(this.parentNode).datum().key;
        let subgroupValue = d.data[subgroupName];
        div.html(`${subgroupName}: <br>${subgroupValue}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mousemove", function(d) { 
         div.style('top', (d3.event.pageY - 20) + "px")
         .style('left', (d3.event.pageX + 20) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });



     // Call the  axis
      svg.select('.x.axis')
            .transition(t)
            .call(x_axis);

      svg.select('.y.axis')
            .transition(t)
            .call(y_axis);


      addLegend(data)

  });


}
function percentStack(){


  // Get the data
  d3.csv("age_groups.csv", type, function (error, data) {

    if (error) throw error;

    // create transition object
    let t = d3.transition()
        .duration(1500);
        
    // list of subgroups (header of csv files)
    let subgroups = data.columns.slice(1);

    // list of years -> x axis
    let years = d3.map(data, function (d) {
      return d.Year
    }).keys();


    // Set x, y and colours
    x.domain(years)
      
    y.domain([0,100]);

    
    let colour = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#ccebc5", "#b3cde3", "#fbb4ae", '#e41a1c','#377eb8','#4daf4a','#C7EFCF','#FE5F55','#EEF5DB', "yellow"]); // TODO: change colors
    
    // Convert numbers to % of whole
    dataPercent = [];

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
    console.log(data)
     // stack the data
     let stackedData = d3.stack()
     .keys(subgroups)
     (data)

  // If stack chart present remove it 
   svg.selectAll(".stack")
       .remove()

       // show the bars
   let bars = svg
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
        .attr('y', height)
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


        
      
      newBars.on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);

        // subgroup Name and Value with reference to https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html 
        let subgroupName = d3.select(this.parentNode).datum().key;
        let subgroupValue = d.data[subgroupName];
        div.html(`${subgroupName}: <br>${subgroupValue}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mousemove", function(d) { 
         div.style('top', (d3.event.pageY - 20) + "px")
         .style('left', (d3.event.pageX + 20) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });



     // Call the  axis
      svg.select('.x.axis')
            .transition(t)
            .call(x_axis);

      svg.select('.y.axis')
            .transition(t)
            .call(y_axis);


      addLegend(data)

  });


}
  function addLegend(data){

  // add legend 
  let legend = svg.selectAll(".legend")
    .data(data.columns.slice(1))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })
    .style("font", "12px sans-serif");

    legend.append("rect")
    .attr("x", width + 18)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", function(d,i ){
      return colours[i];
    });

    legend.append("text")
    .attr("x", width + 44)
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

 

showStackedChartTotal();

setTimeout(function(){
  console.log("new one")
  percentStack();
}, 3000);

// percentStack();
// setTimeout(function(){
//   console.log("new one")
//   showStackedChartTotal();
// }, 3000);


