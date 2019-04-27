// Code loosly inspired by this article https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html by Yan Holtz 
    // assessed @14/04/2019
    // Setup svg using Bostock's marginStackTotal convention
const marginStackTotal = {
      top: 40,
      right: 150,
      bottom: 40,
      left: 60
    },
widthStackTotal = 560 - marginStackTotal.left - marginStackTotal.right,
heightStackTotal = 500 - marginStackTotal.top - marginStackTotal.bottom;

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left marginStackTotal
const svgStackTotal = d3.select("#nurses-total-stack")
  .append("svg")
    .attr("width", widthStackTotal + marginStackTotal.left + marginStackTotal.right)
    .attr("height", heightStackTotal + marginStackTotal.top + marginStackTotal.bottom)
  .append("g")
    .attr("transform", "translate(" + marginStackTotal.left + "," + marginStackTotal.top + ")");

  // Add the x axis
svgStackTotal.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${heightStackTotal})`);
  
// Add the y axis
svgStackTotal.append("g")
    .attr("class", "y axis")
  
 // create colours array
const colours = ["#ccebc5", "#b3cde3", "#fbb4ae"];
  
// Create global div for tooltip
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// create keys array to store names of the columns
const keys = ["UK", "Outside the EEA", "EEA"]; 

// Show bar chart for given category; key index corresponds to category index from "keys" array
function showSingleBar(keyIndex){
  // Set x, y
  let x = d3.scaleBand()
  .range([0, widthStackTotal])
  .padding(0.01);

  let y = d3.scaleLinear()
  .range([heightStackTotal, 0]);

  let x_axis =d3.axisBottom(x).tickSizeOuter(0);
  let y_axis = d3.axisLeft(y);


  d3.csv("data/nurses_total.csv", type, function (error, data) {

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
         return d[keys[keyIndex]]; })]).nice();

    // remove stack bars if present
    svgStackTotal.selectAll("g.stack")
      .remove();
    
    // show the bars
    let bars = svgStackTotal
      .selectAll(".bar")
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
      .attr('y', heightStackTotal)
      .attr('width', x.bandwidth());
        

     // update
    newBars.merge(bars)
      .transition(t)
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[keys[keyIndex]]); })
      .attr("height", function(d) { return heightStackTotal - y(d[keys[keyIndex]])});
      
      
    newBars
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseout", mouseOut);

    svgStackTotal.select('.x.axis')
      .transition(t)
      .call(x_axis);

    svgStackTotal.select('.y.axis')
      .transition(t)
      .call(y_axis);
      
      //addLegend(data);

    })

    function mouseOver(d){
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    
      tooltip.html(`<b>${keys[keyIndex]}</b>: <br> ${d[keys[keyIndex]]}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");
    }
    
    function mouseMove(d){
      tooltip
        .style('top', (d3.event.pageY - 20) + "px")
        .style('left', (d3.event.pageX + 20) + "px");
    }
    
    function mouseOut(d){
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    }
  }

// show total as stack chart
function showStackedChartTotal(){
  // Set x, y
  let x = d3.scaleBand()
      .range([0, widthStackTotal])
      .padding(0.01);

  let y = d3.scaleLinear()
      .range([heightStackTotal, 0]);

  let x_axis =d3.axisBottom(x).tickSizeOuter(0);
  let y_axis = d3.axisLeft(y);
    
  // Get the data
  d3.csv("data/nurses_total.csv", type, function (error, data) {

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
    x.domain(years)
      
    y.domain([0, d3.max(data, function (d) {
        return d.total;
      })]).nice();

    
    let colour = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#ccebc5", "#b3cde3", "#fbb4ae"]); // TODO: change colors
    
    
     // stack the data
     let stackedData = d3.stack()
     .keys(subgroups)
     (data)

    // If barchart present remove it 
    svgStackTotal.selectAll("rect.bar")
       .remove()

       // show the bars
    let bars = svgStackTotal
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
        .attr('y', heightStackTotal)
       .attr("fill", function (d) { return colour(d.key); })
     
     .selectAll("g")
     // enter a second time -> loop subgroups to add all rectangles
     .data(function (d) {
       return d;
     })
     .enter()
     .append("rect")

    newBars.merge(bars)
      .transition(t)
      .attr("x", function (d) {return x(d.data.year); })
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
        tooltip
         .style('top', (d3.event.pageY - 20) + "px")
         .style('left', (d3.event.pageX + 20) + "px");
      })

      .on("mouseout", function (d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

     // Call the  axis
    svgStackTotal.select('.x.axis')
      .transition(t)
      .call(x_axis);

    svgStackTotal.select('.y.axis')
      .transition(t)
      .call(y_axis);

      // remove legend title and append legend
    svgStackTotal.selectAll(".legendText")
      .remove()

    addLegend(data)

  });


}
  function addLegend(data){
    //add title legend
    svgStackTotal.append("text")
      .attr("class", "legendText")
      .attr("x", widthStackTotal + 18)
      .attr("y", -10)
      .attr("text-anchor", "start")
      .text("Initial Registration In:")
        .style("font-weight", "bold");

    // add legend 
    let legend = svgStackTotal.selectAll(".legend")
      .data(data.columns.slice(1))
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      })
    
    legend.append("rect")
    .attr("x", widthStackTotal + 18)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", function(d,i ){
      return colours[i];
    });

    legend.append("text")
    .attr("x", widthStackTotal + 44)
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



// ============= HANDLE VIS STEPS ==========
// get total nurses visulisation
const exploreTotalBtnDiv = document.querySelector(".explore-total .step-btns");
const explanationDiv = document.querySelector(".explore-total .explanation");

const backBtnTotal = document.querySelector(".explore-total .step-back");
const nextBtnTotal = document.querySelector(".explore-total .step-next");

let currentDiv = 0;

exploreTotalBtnDiv.addEventListener("click", function(e){
  
  switch (e.target.id ){
    case "stack-total":
      showNursesTotal(e);
      break; 
    
    case "bar-uk":
      showNursesUK(e);
      break;

    case "bar-neea":
      showNursesNEEA(e)
      break;

    case "bar-eea":
      showNursesEEA(e);
      break;
  }
    
})

backBtnTotal.addEventListener("click", handleBackNextBtn);
nextBtnTotal.addEventListener("click", handleBackNextBtn);

function handleBackNextBtn(e){
  
  if (e.target.matches(".step-back") ){
    if(currentDiv > 0){currentDiv = currentDiv - 1; }
    
  } else // next button
  {
    if(currentDiv < 3){ currentDiv = currentDiv + 1; }
  }

  switch (currentDiv ){
    case 0:
      showNursesTotal(e);
      autoChangeCircleColor(0);
      break; 
    
    case 1:
      showNursesUK(e);
      autoChangeCircleColor(1);
      break;

    case 2:
      showNursesNEEA(e)
      autoChangeCircleColor(2);
      break;

    case 3:
      showNursesEEA(e);
      autoChangeCircleColor(3);
      break;
  }
}

// helpers functions to show correct visualisation
function showNursesTotal(e){
  changeCircleColorOnClick(e);
  showStackedChartTotal();
  explanationDiv.innerHTML = `<h4>Total number of nurses and midwives</h4>
      <p>There is slight increase in a number of nurses and midwives registered to work in the UK, with the total of
      693618 people in 2018 compared with 689738 people in 2017.</p>`;
  currentDiv = 0;
}

function showNursesUK(e){
  changeCircleColorOnClick(e);
  showSingleBar(0);
  explanationDiv.innerHTML = `<h4>Nurses and midwives with initial registration in the UK</h4>
      <p>In 2018 there is an increase of 3457 people compared to 2017. However, the total number is still lower than number of registrants in 2014 and 2015. 
      </p>`
  currentDiv = 1;
}

function showNursesNEEA(e){
  changeCircleColorOnClick(e);
  showSingleBar(1);
  explanationDiv.innerHTML = `<h4>Nurses and midwives with initial registartion outside EEA</h4>
  <p>For the first time since 2013, the number of registrants with initial registration outside EEA, exceeded 70000, with the increase of 2808 compared to the previous year.</p>`;
  currentDiv = 2;
}

function showNursesEEA(e){
  changeCircleColorOnClick(e);
  showSingleBar(2);
  explanationDiv.innerHTML = `<h4>Nurses and midwives with initial registration in EEA</h4>
      <p>The number of nurses and midwives with initial registration in EEA continues to fall, with the total 33874 in 2018 compared to the peak of 38992 in 2016.
      </p>`;
  currentDiv = 3;
}

// handle colour of circles in the step vis when clicked on the circle
function changeCircleColorOnClick(e){
  const circles = document.querySelectorAll(".circle");
  // first change all circles to back to white
  for (let i = 0; i < circles.length; i++){
    circles[i].style.background = "white";
  }
  // change color of clicked circle
  e.target.style.background = "grey";
}

// handle colour of circles in the step vis when moving with back/next buttons
function autoChangeCircleColor(circle_id){
  const circles = document.querySelectorAll(".circle");
 
  for (let i = 0; i < circles.length; i++){
    circles[i].style.background = "white";
  }
  
  circles[circle_id].style.background = "grey";
}


// show stack chart with total number of nurses on the load of the page
showStackedChartTotal();
// change colour of the first circle on page load 
autoChangeCircleColor(0);
