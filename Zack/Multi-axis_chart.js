var svgWidth = 1400;
var svgHeight = 900;

var margin = {
    top: 20,
    right: 40,
    bottom: 150,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

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

var chartGroup = svg.append("text")
    .attr("x", (width/2))
    .attr("y", 0 - (margin.top/2))
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("text-decoration", "underline")
    .text("Happiness Score vs. The Six Explanatory Factors");

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXAxis = "Logged GDP per capita";


function xScale(worldHappinessReport, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(worldHappinessReport, d => d[chosenXAxis]) * 0.9,
            d3.max(worldHappinessReport, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, width]);

    return xLinearScale;

}


function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}


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
            return (`${d["Country name"]}<br>${label} ${d[chosenXAxis]}`);
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

d3.csv("world-happiness-report-2021.csv").then(function(worldHappinessReport, err) {
    if (err) throw err;

    worldHappinessReport.forEach(function(data) {
        data["Ladder score"] = +data["Ladder score"];
        data["Logged GDP per capita"] = +data["Logged GDP per capita"];
        data["Social support"] = +data["Social support"];
        data["Healthy life expectancy"] = +data["Healthy life expectancy"];
        data["Freedom to make life choices"] = +data["Freedom to make life choices"];
        data["Generosity"] = +data["Generosity"];
        data["Perceptions of corruption"] = +data["Perceptions of corruption"];
    });

    var xLinearScale = xScale(worldHappinessReport, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([2,d3.max(worldHappinessReport, d => d["Ladder score"])])
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

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


    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Happiness Score");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function() {

            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                chosenXAxis = value;


            xLinearScale = xScale(worldHappinessReport, chosenXAxis);

            xAxis = renderAxes(xLinearScale, xAxis);

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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