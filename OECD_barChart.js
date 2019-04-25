 
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
    .domain([0, 20])
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
    .padding(0.2);

  svgBarChart.append("g")
    .call(d3.axisLeft(y))
    .attr("class", " y axis");


  console.log(y);
  // bars
  svgBarChart.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", x(0))
      .attr("y", function(d){return y(d.Country); })
      .attr("width", function(d){return x(d["2015"]); })
      .attr("height",y.bandwidth())
      .style("fill", function(d){
        if (d.Country == "United Kingdom"){ return "red"}
        else if (d.Country == "OECD35") {return "green"}
        else{ return "grey"}})
      
})
