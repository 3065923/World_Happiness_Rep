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
  var svgWidth = window.innerWidth ;
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
    .attr("class", "boxybox");

  // Append group element
  var chartGroup = svg
    .append("g")
    .attr("class", "chartGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("../CSV_files/world-happiness-report-2021.csv").then(function (
    joyData) {
 
    var subgroups = joyData.columns.slice(13, 21);
      
    height2 = height + margin.top

    var groups = d3
      .map(joyData, function (d) {
        return d["Country name"];
      })
      .keys();

    // Add X axis
    var x = d3.scaleBand().domain(groups).range([margin.left, width]).padding([0.2]);
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.6em")
      .attr("transform", "rotate(-90)");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 8]).range([height, 0]);
        svg.append("g")
        .attr("class", "y-axis")
               
    var yAxis = d3.axisLeft(y)
    
    var color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(['#fff700','#ffdd00','#ffc800', '#ffae00', '#ff9500', '#ff7700', '#ff5500'])
    

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack().keys(subgroups)(joyData)

        svg.append("g")
        .attr("class", "Charty McChartface")
        .attr("transform", "translate(0," + margin.top + ")")
        .selectAll("g")
        .data(stackedData)
        .join("g")
          .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
          .attr("x", (d, i) => x(d.data["Country name"]))
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          
    
      chartGroup.append("g")
          .call(x)
          .attr("transform", `translate(0, ${height})`)
   
      chartGroup.append("g")
        .call(yAxis)
    
      svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Country");

          // text label for the y axis
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left/5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Happiness Score");

    })
  
  };


// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
