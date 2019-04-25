 
const marginBarChart = {
  top: 40,
  right: 150,
  bottom: 40,
  left: 100
},
widthBarChart = 660 - marginBarChart.left - marginBarChart.right,
heightBarChart = 700 - marginBarChart.top - marginBarChart.bottom;
// append the svg object to the body of the page

const svgBarChart = d3.select("#OECD-barchart")
.append("svg")
  .attr("width", widthBarChart + marginBarChart.left + marginBarChart.right)
  .attr("height", heightBarChart + marginBarChart.top + marginBarChart.bottom)
.append("g")
  .attr("transform", "translate(" + marginBarChart.left + "," + marginBarChart.top + ")");

// Parse the data

d3.csv("nurses_OECD_2010-2015.csv", function(data){

  // add x axis
  let x = d3.scaleLinear()
    .domain([0, 16])
    .range([0,widthBarChart]);

  svgBarChart.append("g")
    .attr("transform","translate(0," + heightBarChart + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("class", "x axis")
      .style("text-anchor", "end");

  // add y axis
  let y = d3.scaleBand()
    .range([0, heightBarChart])
    .domain(data.map(function(d) {return d.Country; }))
    .padding(1);

  svgBarChart.append("g")
    .call(d3.axisLeft(y))
    .attr("class", " y axis");

  // lines
  svgBarChart.selectAll("myLine")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d){return x(d["2015"])})
      .attr("x2", function(d){
        if(!d["2000"]) {return  x(d["2015"])}
        else{
          return x(d["2000"])}
        })
      .attr("y1", function(d){return y(d.Country)})
      .attr("y2", function(d){return y(d.Country)})
      .attr("stroke", "grey")

  // circles
  svgBarChart.selectAll("circle2000")
    .data(data)
    .enter()
    .append("circle")
      .attr("r", 5)
      .attr("cx", function(d){return x(d["2000"]);})
      .attr("cy", function(d){return y(d.Country);})
      // .style("fill", function(d){
      //   if (d.Country == "United Kingdom"){ return "#cd5c5c"}
      //   else if (d.Country == "OECD35") {return "lightgreen"}
      //   else{ return "lightgrey"}
      // })
      .style("fill", "#cd5c5c")
      .style("opacity", function(d){
        if(!d["2000"]){
          return 0; // don't show null values for 2000 year
        }});
      

  svgBarChart.selectAll("circle2015")
    .data(data)
    .enter()
    .append("circle")
      .attr("r", 5)
      .attr("cx", function(d){return x(d["2015"]);})
      .attr("cy", function(d){return y(d.Country);})
      .style("fill", "#5ccd5c")
      // .style("fill", function(d){
      //   if (d.Country == "United Kingdom"){ return "red"}
      //   else if (d.Country == "OECD35") {return "green"}
      //   else{ return "grey"}
      })
