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
	  bottom: 50,
	  right: 50,
	  left: 50
	};
      
      
	var height = svgHeight - margin.top - margin.bottom;
	var width = svgWidth - margin.left - margin.right;
      
	// Append SVG element
	var svg = d3
	  .select(".stackedBar")
	  .attr("class", "box")
	  .append("svg")
	  .attr("height", svgHeight)
	  .attr("width", svgWidth);
      
	// Append group element
	var happiness = svg.append("g")
	      .attr("transform", `translate(${margin.left}, ${margin.top})`)

	var happiness = d3.csv("../CSV_Files/world-happiness-report-2021.csv").then(function(joyData) {

		// parse data
		joyData.forEach(function (data) {
		   data['Explained by: Log GDP per capita'] = +data['Explained by: Log GDP per capita'],
		   data['Explained by: Social support'] = +data['Explained by: Social support']
		   data['Explained by: Healthy life expectancy'] = +data['Explained by: Healthy life expectancy']
		   data['Explained by: Freedom to make life choices'] = +data['Explained by: Freedom to make life choices']
		   data['Explained by: Generosity'] = +data['Explained by: Generosity']
		   data['Explained by: Perceptions of corruption'] = +data['Explained by: Perceptions of corruption']
		});
		console.log(joyData)

	 	// Add X axis
	 	var x = d3.scaleBand()
	  		.domain(joyData)
	 		.range([0, width])	
	 		.padding([0.2])
			svg.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x).tickSizeOuter(0));


		// Add Y axis
		var y = d3.scaleLinear()
			.attr("class", y-axis)
			.domain([0, 60])
			.range([ height, 0 ]);
			svg.append("g")
				.attr("class", "y-axis")
				.call(d3.axisLeft(y));

		//stack the data? --> stack per subgroup
		var stackedData = d3.stack()
		.keys(country)
		(data)

		// Show the bars
		svg.append("g")
		.attr("class", "bars")
		.selectAll("g")
	// Enter in the stack data = loop key per key = group per group
	.data(stackedData)
	.enter().append("g")
	 .attr("fill", function(d) { return color(d.key); })
	 .selectAll("rect")
	 // enter a second time = loop subgroup per subgroup to add all rectangles
	 .data(function(d) { return d; })
	 .enter().append("rect")
	   .attr("x", function(d) { return x(d.data.group); })
	   .attr("y", function(d) { return y(d[1]); })
	   .attr("height", function(d) { return y(d[0]) - y(d[1]); })
	   .attr("width",x.bandwidth())
	});


	};

