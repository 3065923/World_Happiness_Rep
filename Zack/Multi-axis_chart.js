// Build function to make chart responsive
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
    var svgWidth = window.innerWidth * 0.8;
    var svgHeight = window.innerHeight * 0.8;

    //Set Margins
    var margin = {
        top: 20,
        right: 40,
        bottom: 150,
        left: 100
    };

    // Set Width and Height variables
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    //Create an SVG wrapper, append an SVG to hold the chart, and shift it to the right spot
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "gray")
        .attr("opacity", "0.3");

    // var chartGroup = svg.append("text")
    //     .attr("x", (width/2))
    //     .attr("y", 0 - (margin.top/2))
    //     .attr("text-anchor", "middle")
    //     .attr("font-size", "16px")
    //     .attr("text-decoration", "underline")
    //     .text("Happiness Score vs. The Six Explanatory Factors");

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Set initital parameters
    var chosenXAxis = "Logged GDP per capita";


    // Build function used for updating x-scale when axis label is selected
    function xScale(worldHappinessReport, chosenXAxis) {

        // Create Scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(worldHappinessReport, d => d[chosenXAxis]) * 0.9,
                d3.max(worldHappinessReport, d => d[chosenXAxis]) * 1.1
            ])
            .range([0, width]);

        return xLinearScale;

    }

    // Function used for updating xAxis when axis label is selected
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }


    // Build function for updating circles group with transition to new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));

        return circlesGroup;
    }

    // Build function for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        var label;

        if (chosenXAxis === "Logged GDP per capita") {
            label = "Logged GDP Per Capita: ";
        }
        else if (chosenXAxis === "Social support") {
            label = "Social Support: ";
        }
        else if (chosenXAxis === "Healthy life expectancy") {
            label = "Healthy Life Expectancy: ";
        }
        else if (chosenXAxis === "Freedom to make life choices") {
            label = "Freedom to Make Life Choices: ";
        }
        else if (chosenXAxis === "Generosity") {
            label = "Generosity: ";
        }
        else {
            label = "Perceptions of Corruption: ";
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d["Country name"]}<br>${"Happiness Score: "} ${d["Ladder score"]}<br>${label} ${d[chosenXAxis]}`);
            });

        circlesGroup.call(toolTip);
        
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })

            .on("mouseout", function(data) {
                toolTip.hide(data);
            });

        return circlesGroup;
    }

    // Retrieve data from the CSV file and execute everything below
    d3.csv("world-happiness-report-2021.csv").then(function(worldHappinessReport, err) {
        if (err) throw err;

        // Parse Data
        worldHappinessReport.forEach(function(data) {
            data["Ladder score"] = +data["Ladder score"];
            data["Logged GDP per capita"] = +data["Logged GDP per capita"];
            data["Social support"] = +data["Social support"];
            data["Healthy life expectancy"] = +data["Healthy life expectancy"];
            data["Freedom to make life choices"] = +data["Freedom to make life choices"];
            data["Generosity"] = +data["Generosity"];
            data["Perceptions of corruption"] = +data["Perceptions of corruption"];
        });

        // Sel xLinearScale based on CSV
        var xLinearScale = xScale(worldHappinessReport, chosenXAxis);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain([2,d3.max(worldHappinessReport, d => d["Ladder score"])])
            .range([height,0]);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append X Axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Append Y Axis
        chartGroup.append("g")
            .call(leftAxis);

        // Append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(worldHappinessReport)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d["Ladder score"]))
            .attr("r", 10)
            .attr("fill", "yellow")
            .attr("opacity", "0.5")
            .attr("stroke","black")
            .attr("stroke-width","2px");

        // Create group for multi-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var GDPLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "Logged GDP per capita") // value to grab for event listener
            .classed("active", true)
            .text("Logged GDP Per Capita");

        var SocialSupportLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "Social support") // value to grab for event listener
            .classed("active", true)
            .text("Social support");

        var HealthLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "Healthy life expectancy") // value to grab for event listener
            .classed("active", true)
            .text("Healthy Life Expectancy");

        var FreedomLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 80)
            .attr("value", "Freedom to make life choices") // value to grab for event listener
            .classed("active", true)
            .text("Freedom to Make Life Choices");

        var Generositylabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 100)
            .attr("value", "Generosity") // value to grab for event listener
            .classed("active", true)
            .text("Generosity");

        var CorruptionLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 120)
            .attr("value", "Perceptions of corruption") // value to grab for event listener
            .classed("active", true)
            .text("Perceptions of Corruption");

        // Append Y Axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Happiness Score");

        // UpdateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // X Axis labels event listener
        labelsGroup.selectAll("text")
            .on("click", function() {

                // Get Value of Selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // Replaces chosenXAxis with value
                    chosenXAxis = value;

                // Functions called here built before CSV import
                // Updates x scale for new data
                xLinearScale = xScale(worldHappinessReport, chosenXAxis);

                // Updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // Updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // Updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // Changes classes to change bold text
                if (chosenXAxis === "Logged GDP per capita") {
                    GDPLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    SocialSupportLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    HealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FreedomLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    Generositylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    CorruptionLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "Social support") {
                    GDPLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    SocialSupportLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    HealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FreedomLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    Generositylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    CorruptionLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "Healthy life expectancy") {
                    GDPLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    SocialSupportLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    HealthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    FreedomLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    Generositylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    CorruptionLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "Freedom to make life choices") {
                    GDPLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    SocialSupportLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    HealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FreedomLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    Generositylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    CorruptionLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "Generosity") {
                    GDPLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    SocialSupportLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    HealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FreedomLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    Generositylabel
                        .classed("active", true)
                        .classed("inactive", false);
                    CorruptionLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    GDPLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    SocialSupportLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    HealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FreedomLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    Generositylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    CorruptionLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                }
            }); 
    }).catch(function(error) {
        console.log(error);
    });
};

// When the browser loads, makeResponsive() is called.
makeResponsive();
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive)
