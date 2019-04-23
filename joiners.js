const margin = {
  top: 40,
  right: 150,
  bottom: 40,
  left: 60
},
width = 550 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");
// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);



// define the joiners line
var joinersline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.joiners); });

// define the leavers line
var leaversline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.leavers); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("#vis2")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Get the data
d3.csv("joiners_vs_leaversEEA.csv", function(error, data){

   // format the data
   data.forEach(function(d) {
    d.year = parseTime(d.year);
    d.joiners = +d.joiners;
    d.leavers = +d.leavers;
  });
  

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) {   return Math.max(d.leavers,d.joiners); })]).nice();
  

  // Add the joiners path
  svg.append("path")
    .data([data])
    .attr("class", "joiners line")
    .attr("d", joinersline);

  // Add the leavers path
  svg.append("path")
    .data([data])
    .attr("class", "leavers line")
    .attr("d", leaversline);


  // add x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add y axis
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y axis")
    .append("text")
      .attr("class", "y axisTitle")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of nurses and midwives");;

  console.log(data)
   svg.append("text")
    .attr("transform", "translate("+(width+5)+","+y(data[data.length-1].leavers)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Leavers");

  svg.append("text")
    .attr("transform", "translate("+(width+5)+","+y(data[data.length-1].joiners)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("First time joiners");

   // add y axis
  // svg.append("g")
  //   .attr("transform", "translate( " + width + ", 0 )")
  //   .call(d3.axisRight(y1));


})






function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}