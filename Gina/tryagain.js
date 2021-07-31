// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 200,
    right: 50,
    left: 50,
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".stackedBar")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .attr("class", "boxybox")
    .style("background-color", 'black');

  // Append group element
  var chartGroup = svg
    .append("g")
    .attr("class", "chartGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("../CSV_files/world-happiness-report-2021.csv").then(function (
    joyData
  ) {
    var subgroups = joyData.columns.slice(13, 21);

    height2 = height + margin.top;

    var groups = d3
      .map(joyData, function (d) {
        return d["Country name"];
      })
      .keys();

    // Add X axis
    var x = d3
      .scaleBand()
      .domain(groups)
      .range([margin.left, width])
      .padding([0.2]);
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.6em")
      .attr("transform", "rotate(-90)")
      .style("color", "white");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 8]).range([height, 0]);
    svg.append("g")
    .attr("class", "y-axis")
    


    var yAxis = d3.axisLeft(y);

    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#FF00FF",
        "#800080",
        "#0000FF",
        "#00FF00",
        "#FFFF00",
        "#FFA500",
        "#FF0000",
      ]);

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(subgroups)(joyData);

    svg
      .append("g")
      .attr("class", "Chart")
      .attr("transform", "translate(0," + margin.top + ")")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d, i) => x(d.data["Country name"]))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    chartGroup.append("g").call(x).attr("transform", `translate(0, ${height})`);

    chartGroup.append("g").call(yAxis).style("color", "white");

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.bottom) + ")"
      )
      .style("text-anchor", "middle")
      .style("fill", "white")
      .text("Country");

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 5)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .text("Happiness Score");

    var keys = [
      "Explained by: Log GDP per capita",
      "Explained by: Social support",
      "Explained by: Healthy life expectancy",
      "Explained by: Freedom to make life choices",
      "Explained by: Generosity",
      "Explained by: Perceptions of corruption",
      "Dystopia + residual",
    ];
    var size = 20;
    svg
      .selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", width - 300)
      .attr("y", function (d, i) {
        return 100 + i * (size + 5);
      })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) {
        return color(d);
      });

    // Add one dot in the legend for each name.
    svg
      .selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", width - 300 + size * 1.2)
      .attr("y", function (d, i) {
        return 100 + i * (size + 5) + size / 2;
      }) 
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

//       var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d) {
//           return (`<strong>${d["Country name"]}<strong>`)
//         });
        
      
// //         // Step 2: Create the tooltip in chartGroup.
//         svg.call(toolTip);

// //           // Step 3: Create "mouseover" event listener to display tooltip
//           svg.on("mouseover", function(d) {
//             toolTip.show(d, this);
//           })
// //           // Step 4: Create "mouseout" event listener to hide tooltip
//             svg.on("mouseout", function(d) {
//               toolTip.hide(d);

//   })
// begin tooltip section
// Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");
  // end tooltip section
});
}


// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// // to do:  add box behind legend for readability
// //        add region filter
// //        try 100% view
// //        add tooltips