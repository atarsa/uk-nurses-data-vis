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
         return d[keys[keyIndex]]; })]).nice();

    // remove stack bars if present
    svg.selectAll("g.stack")
        //.transition(t)
        .remove();
    
        // show the bars
    let bars = svg.selectAll(".bar")
    //svg.selectAll(".bar")
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
      
      addLegend(data);

    })

    function mouseOver(d){
      div.transition()
              .duration(200)
              .style("opacity", .9);
    
               div.html(`${keys[keyIndex]}: <br> ${d[keys[keyIndex]]}`)
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
   svg.selectAll("rect.bar")
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
     .attr("x", function (d) {return x(d.data.year); })
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

    // // add legend 
    // let legend = d3.select(".legend").append("ul");

    // let legendItems = legend.selectAll("li")
    //   .data(data.columns.slice(1))
    //   .enter()
    //   .append("li")
    //   .attr("data-key", function(d,i) {return d; }) 
    //   .attr("data-index", function(d,i) {return i; })
    //   .attr("data-colour", function(d,i) {  return colours[i]; })
    //   .on('click', handleLegendItemClick);


    // legendItems.append("span")
    //   .attr("class", "rect")
    //   .style("background-color", function(d,i) {return colours[i]});

    // legendItems.append("span")
    //   .text(function (d) { return d; });
      addLegend(data)

  });


}
  function addLegend(data){
    // add title legend
    // svg.append("text")
    // .attr("x", width + 18)
    // .attr("y", -10)
    // .attr("text-anchor", "start")
    // .text("Initial Registration:")
    // .style("font", "12px sans-serif")
    // .style("font-weight", "bold");

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
autoChangeCircleColor(0);


// ============= HANDLE VIS STEPS ==========
// get total nurses visulisation
const exploreTotalBtnDiv = document.querySelector(".step-btns");
const explanationDiv = document.querySelector(".explanation");

const backBtn = document.querySelector(".step-back");
const nextBtn = document.querySelector(".step-next");

let currentDiv = 0;

exploreTotalBtnDiv.addEventListener("click", function(e){
  
  switch (e.target.id ){
    case "stack-total":
      showNursesTotal(e);
      // changeCircleColorOnClick(e);
      // showStackedChartTotal();
      // explanationDiv.innerHTML = `<h4> Total number of Nurses And Midwives</h4>
      // <p>some more info here</p>`;
      // currentDiv = 0;
       break; 
    
    case "bar-uk":
      showNursesUK(e);
      // changeCircleColorOnClick(e);
      // showSingleBar(0);
      // explanationDiv.innerHTML = `<h4>  Number of Nurses And Midwives with initial registartion in UK</h4>
      // <p>some more info here</p>`
      // currentDiv = 1;
      break;

    case "bar-neea":
      showNursesNEEA(e)
      // changeCircleColorOnClick(e);
      // showSingleBar(1);
      // explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion outside EEA</h4>
      // <p>some more info here</p>`;
      // currentDiv = 2;
      break;

    case "bar-eea":
      showNursesEEA(e);
      // changeCircleColorOnClick(e);
      // showSingleBar(2);
      // explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion in EEA</h4>
      // <p>some more info here</p>`;
      // currentDiv = 3;
      break;
  }
    
})

backBtn.addEventListener("click", handleBackNextBtn);
nextBtn.addEventListener("click", handleBackNextBtn);

function handleBackNextBtn(e){
  console.log(currentDiv);
  if (e.target.matches(".step-back") ){
    if(currentDiv > 0){
      currentDiv = currentDiv - 1;
      console.log(currentDiv); 
    }
    
  } else // next button
  {
    if(currentDiv < 3){
      currentDiv = currentDiv + 1; 
      console.log(currentDiv);
    }
  }

  switch (currentDiv ){
    case 0:
      showNursesTotal(e);
      autoChangeCircleColor(0);
      // changeCircleColorOnClick(e);
      // showStackedChartTotal();
      // explanationDiv.innerHTML = `<h4> Total number of Nurses And Midwives</h4>
      // <p>some more info here</p>`;
      // currentDiv = 0;
       break; 
    
    case 1:
      showNursesUK(e);
      autoChangeCircleColor(1);
      // changeCircleColorOnClick(e);
      // showSingleBar(0);
      // explanationDiv.innerHTML = `<h4>  Number of Nurses And Midwives with initial registartion in UK</h4>
      // <p>some more info here</p>`
      // currentDiv = 1;
      break;

    case 2:
      showNursesNEEA(e)
      autoChangeCircleColor(2);
      // changeCircleColorOnClick(e);
      // showSingleBar(1);
      // explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion outside EEA</h4>
      // <p>some more info here</p>`;
      // currentDiv = 2;
      break;

    case 3:
      showNursesEEA(e);
      autoChangeCircleColor(3);
      // changeCircleColorOnClick(e);
      // showSingleBar(2);
      // explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion in EEA</h4>
      // <p>some more info here</p>`;
      // currentDiv = 3;
      break;
 

}}
// helpers functions to show correct visualisation
function showNursesTotal(e){
  changeCircleColorOnClick(e);
      showStackedChartTotal();
      explanationDiv.innerHTML = `<h4> Total number of Nurses And Midwives</h4>
      <p>some more info here</p>`;
      currentDiv = 0;
}

function showNursesUK(e){
  changeCircleColorOnClick(e);
      showSingleBar(0);
      explanationDiv.innerHTML = `<h4>  Number of Nurses And Midwives with initial registartion in UK</h4>
      <p>some more info here</p>`
      currentDiv = 1;
}

function showNursesNEEA(e){
  changeCircleColorOnClick(e);
  showSingleBar(1);
  explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion outside EEA</h4>
  <p>some more info here</p>`;
  currentDiv = 2;
}

function showNursesEEA(e){
  changeCircleColorOnClick(e);
      showSingleBar(2);
      explanationDiv.innerHTML = `<h4> Number of Nurses And Midwives with initial registartion in EEA</h4>
      <p>some more info here</p>`;
      currentDiv = 3;
}

function changeCircleColorOnClick(e){
  const circles = document.querySelectorAll(".circle");
 
  for (let i = 0; i < circles.length; i++){
    circles[i].style.background = "white";
  }
  
  e.target.style.background = "grey";

}

function autoChangeCircleColor(circle_id){
  console.log("change color: ", circle_id)
  const circles = document.querySelectorAll(".circle");
 
  for (let i = 0; i < circles.length; i++){
    circles[i].style.background = "white";
  }
  
  circles[circle_id].style.background = "grey";
}
