 function visNursesPerHabitat(){
    // Setup svg using Bostock's margin convention
    const margin = {
      top: 40,
      right: 150,
      bottom: 40,
      left: 100
    },
    width = 660 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    let svg;

    function animate(selection){
      
      selection.each(function(){
        let dom = d3.select(this);
        svg = dom
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
        
      // Parse the data
      
      d3.csv("nurses_OECD_2010-2015.csv", function(data){
      
        // add x axis
        let x = d3.scaleLinear()
          .domain([0, 16])
          .range([0,width]);
      
        svg.append("g")
          .attr("transform","translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("class", "x axis")
            .style("text-anchor", "end");
      
        // add y axis
        let y = d3.scaleBand()
          .range([0, height])
          .domain(data.map(function(d) {return d.Country; }))
          .padding(1);
      
        svg.append("g")
          .call(d3.axisLeft(y))
          .attr("class", " y axis");
      
        // lines
        svg.selectAll("myLine")
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
        svg.selectAll("circle2000")
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
            
      
        svg.selectAll("circle2015")
          .data(data)
          .enter()
          .append("circle")
            .attr("r", 5)
            .attr("cx", function(d){return x(d["2015"]);})
            .attr("cy", function(d){return y(d.Country);})
            .style("fill", "#5ccd5c");

      });

      });
    }
   return animate;
}

// // append the svg object to the body of the page

// const svg = d3.select("#vis4")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // Parse the data

// d3.csv("nurses_OECD_2010-2015.csv", function(data){

//   // add x axis
//   let x = d3.scaleLinear()
//     .domain([0, 16])
//     .range([0,width]);

//   svg.append("g")
//     .attr("transform","translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//       .attr("class", "x axis")
//       .style("text-anchor", "end");

//   // add y axis
//   let y = d3.scaleBand()
//     .range([0, height])
//     .domain(data.map(function(d) {return d.Country; }))
//     .padding(1);

//   svg.append("g")
//     .call(d3.axisLeft(y))
//     .attr("class", " y axis");

//   // lines
//   svg.selectAll("myLine")
//     .data(data)
//     .enter()
//     .append("line")
//       .attr("x1", function(d){return x(d["2015"])})
//       .attr("x2", function(d){
//         if(!d["2000"]) {return  x(d["2015"])}
//         else{
//           return x(d["2000"])}
//         })
//       .attr("y1", function(d){return y(d.Country)})
//       .attr("y2", function(d){return y(d.Country)})
//       .attr("stroke", "grey")

//   // circles
//   svg.selectAll("circle2000")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("r", 5)
//       .attr("cx", function(d){return x(d["2000"]);})
//       .attr("cy", function(d){return y(d.Country);})
//       // .style("fill", function(d){
//       //   if (d.Country == "United Kingdom"){ return "#cd5c5c"}
//       //   else if (d.Country == "OECD35") {return "lightgreen"}
//       //   else{ return "lightgrey"}
//       // })
//       .style("fill", "#cd5c5c")
//       .style("opacity", function(d){
//         if(!d["2000"]){
//           return 0; // don't show null values for 2000 year
//         }});
      

//   svg.selectAll("circle2015")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("r", 5)
//       .attr("cx", function(d){return x(d["2015"]);})
//       .attr("cy", function(d){return y(d.Country);})
//       .style("fill", "#5ccd5c")
//       // .style("fill", function(d){
//       //   if (d.Country == "United Kingdom"){ return "red"}
//       //   else if (d.Country == "OECD35") {return "green"}
//       //   else{ return "grey"}
      // })
