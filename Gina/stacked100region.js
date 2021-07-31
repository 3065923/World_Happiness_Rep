// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive(sample) {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  //clears fill  from previous map
  var path= d3.select("g");
  path.html("");

  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight * .8;

  var margin = {
    top: 50,
    bottom: 200,
    right: 350,
    left: 100,
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
  d3.csv("CSV_files/Explained_Percents.csv").then((joyData) => {
//     var regionSelect = joyData.filter(sampleObject => sampleObject["Regional indicator"] == sample)

 
	if (sample == "All Countries") {
	var regionSelect =  joyData}
	else {
	var regionSelect = joyData.filter(sampleObject => sampleObject["Regional indicator"] == sample)}


	
    var subgroups = joyData.columns.slice(1, 8);

//     console.log(regionSelect)

    height2 = height + margin.top;

    var groups = d3
      .map(regionSelect, function (d) {
        return d["Country name"];
      })
      .keys();

//       console.log(groups)
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
    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
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
    var stackedData = d3.stack().keys(subgroups)(regionSelect);


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
    var size = 15;
    svg
      .selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", width + 10)
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
      .attr("x", width + 30 + size * 1.2)
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

      
});
}

function optionChanged (nextSample) {
	makeResponsive(nextSample);
};

region_list= ['All Countries','Western Europe', 'North America and ANZ', 'Middle East and North Africa', 
'Latin America and Caribbean', 'Central and Eastern Europe', 'East Asia', 'Southeast Asia', 
'Commonwealth of Independent States', 'Sub-Saharan Africa', 'South Asia']
testdata= 'CSV_Files/Explained_Percents.csv'
function init() {
  var pullDownMenu = d3.select("#selDataset");
  d3.csv(testdata).then((data) => {
    // console.log(data)
      var regionNames = region_list;
//       console.log(regionNames);
      regionNames.forEach((sample) => {
          pullDownMenu
              .append("option")
              .property("value", sample)
              .text(sample);
      });
  });
  makeResponsive("All Countries")
};
init();

// // When the browser loads, makeResponsive() is called.
// makeResponsive("All Countries");

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);


// // to do:  y
// //        add region filter
// //        add tooltips
