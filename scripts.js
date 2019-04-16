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
  const svg = d3.select("#vis1")
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
  const colours = ["#ccebc5", "#b3cde3", "#fbb4ae"];
  
  // Create div for tooltip
  let div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// create keys array to store names of the columns
const keys = ["UK", "Outside the EEA", "EEA"]; 



function showSingleBar(keyIndex){
  d3.csv("nurses_total.csv", type, function (error, data) {

    if (error) throw error;
    
    // create transition object
    let t = d3.transition()
        .duration(1500);
    
    // list of years -> x axis
    let years = d3.map(data, function (d) {
      return d.year
    }).keys();


    // Set x, y and colours
    x.domain(years); // padding will change space between columns

    y.domain([0, d3.max(data, function (d) {
         return d[keys[keyIndex]]; })]);

    
    // show the bars
    let bars = svg.selectAll(".bar")
        .data(data)
        .attr("fill", colours[keyIndex])
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseout", mouseOut);

    // exit
      bars
        .enter()
        .remove();
    
      // enter

      let newBars = bars
        .enter()
        .append("rect")
        .attr('class', 'bar')
        .attr("fill", colours[keyIndex])
        .attr('height', 0)
        .attr('y', height)
        .attr('width', x.bandwidth());
        

      // update
      newBars.merge(bars)
        .transition(t)
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[keys[keyIndex]]); })
        .attr("height", function(d) { return height - y(d[keys[keyIndex]])});
      
      
      newBars.on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseout", mouseOut);


    svg.select('.x.axis')
            .transition(t)
            .call(x_axis);

        svg.select('.y.axis')
            .transition(t)
            .call(y_axis);

    })

    function mouseOver(d){
      div.transition()
              .duration(200)
              .style("opacity", .9);
    
               div.html(`${keys[keyIndex]}: <br> ${this.d[keys[keyIndex]]}`)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
    }
    
    function mouseMove(d){
      div.style('top', (d3.event.pageY - 20) + "px")
             .style('left', (d3.event.pageX + 20) + "px");
    }
    
    function mouseOut(d){
      div.transition()
      .duration(500)
      .style("opacity", 0);
    }
  }


function showStackedChartTotal(){
  // Get the data
  d3.csv("nurses_total.csv", type, function (error, data) {

    if (error) throw error;

    // create transition object
    let t = d3.transition()
        .duration(1500);
        
    // list of subgroups (header of csv files)
    let subgroups = data.columns.slice(1);

    // list of years -> x axis
    let years = d3.map(data, function (d) {
      return d.year
    }).keys();


    // Set x, y and colours
    let x = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.01); // padding will change space between columns


    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return d.total;
      })])
      .range([height, 0]);


    let colour = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#ccebc5", "#b3cde3", "#fbb4ae"]); // TODO: change colors
    
    

    // stack the data
    let stackedData = d3.stack()
      .keys(subgroups)
      (data)

    // show the bars
    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function (d) {
        return colour(d.key);
      })

      .selectAll("rect")
      // enter a second time -> loop subgroups to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {return x(d.data.year); })
      .attr("y", function (d) { return y(d[1]);})
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .on("mouseover", function (d) {
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


    // Add the x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add the y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));


    // add legend 
    let legend = d3.select(".legend").append("ul");

    let legendItems = legend.selectAll("li")
      .data(data.columns.slice(1))
      .enter()
      .append("li")
      .attr("data-key", function(d,i) {return d; }) 
      .attr("data-index", function(d,i) {return i; })
      .attr("data-colour", function(d,i) {  return colours[i]; })
      .on('click', handleLegendItemClick);


    legendItems.append("span")
      .attr("class", "rect")
      .style("background-color", function(d,i) {return colours[i]});

    legendItems.append("span")
      .text(function (d) { return d; });


  });


}
  

  function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }

  function handleLegendItemClick(){
    console.log(this);
    showSingleBar(0);
  }


showStackedChartTotal();
// showSingleBar(1);
// setTimeout(function(){
//   showSingleBar(2)
// }, 3000)
//showSingleBar(2);