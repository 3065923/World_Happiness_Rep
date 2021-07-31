// Creating map object
var myMap = L.map("map", {
    center: [32.7502, 0],
    zoom: 3
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Load in geojson data
//   var geoData = "static/data/choro_data.geojson";
  var geoData = "static/data/timeline_data.geojson";

  // var example = "CSV_Files\world-happiness-report-2021.csv"
  
  var geojson;
  

function buildMap(sample) {

    // clears fill  from previous map
    var path= d3.select("g");
    path.html("");

  // Grab data with d3
  d3.json(geoData).then((data) => {
    console.log(data);
    // var checkD = data.features.properties.filter(d => d[sample] != null)
    // console.log(data.features.properties)




    var featuresArray = data.features
    console.log(featuresArray)
    console.log(featuresArray[1])

      for (let i = 0; i < featuresArray.length; i++) {
          
      const element = featuresArray[i];
        var propertiesObj = element.properties
        console.log(propertiesObj)

        // for (const [key, value] of Object.entries(propertiesObj)) {
        //     console.log(key, value);

        //     if (value == null) {

        //     }
        //   }


        // function clean(propertiesObj) {
        //     for (var propName in propertiesObj) {
        //       if (propertiesObj[propName] === null) {
        //         delete propertiesObj[propName];
        //       }
        //     }
        //     return propertiesObj
        //   }

        // clean(propertiesObj);
        // console.log(propertiesObj);
          


    //     var featuresArray = data.features
    // console.log(featuresArray)
    // console.log(featuresArray[1])

    //   for (let i = 0; i < data.features.length; i++) {
          
    //     var propertiesObj = data.features[i].properties
    //     console.log(propertiesObj)

    //     // for (const [key, value] of Object.entries(propertiesObj)) {
    //     //     console.log(key, value);

    //     //     if (value == null) {

    //     //     }
    //     //   }

    //     function clean(propertiesObj) {
    //         for (var propName in propertiesObj) {
    //           if (propertiesObj[propName] === null) {
    //             delete propertiesObj[propName];
    //           }
    //         }
    //         return propertiesObj
    //       }

    //     clean(data.features[i].properties);
    //     console.log(propertiesObj);
    
          
    




        // for (let i = 0; i < propertiesObj.length; i++) {
        //     const checkcheck = propertiesObj[i].values;
        //     console.log(checkcheck)
            
        // }

        // var filteredArray= propertiesObj.filter(sampleObj => sampleObj[sample] == sample);


        // //  !!!!!!!
        // // verifying key i get is an actual property of an object an not coming from prototype
        // for (var key in propertiesObj) {
        //     if (propertiesObj.hasOwnProperty(key)) {
        //         console.log(key + '-> ' + propertiesObj[key]);
        //     }
        // }


        // for (var key in propertiesObj) {
        //     const yearSelect = propertiesObj[sample];
        //     console.log(yearSelect)
        // }

        // for (let i = 0; i < propertiesObj.length; i++) {
        //     const yearSelect = propertiesObj[i];
        //     console.log(yearSelect)
        // }

            // if (yearSelect == null) {
            //     continue;
            // }
    //   }
  

        //     // filter through metadata for each sample id
        // var filteredArray= propertiesObj.filter(sampleObj => sampleObj.properties == sample);
        // console.log("##############")
        // console.log(filteredArray);

        }

        
        console.log(data);

        // function getColor(d) {
        //     return d > 8.02 ? '#006837' :
        //            d > 7.393  ? '#1a9850' :
        //            d > 6.766  ? '#66bd63' :
        //            d > 6.139  ? '#a6d96a' :
        //            d > 5.512   ? '#d9ef8b' :
        //            d > 4.885   ? '#ffffbf' :
        //            d > 4.258   ? '#fee08b' :
        //            d > 3.631   ? '#fdae61' :
        //            d > 3.004   ? '#f46d43' :
        //            d > 2.376   ? '#d73027' :
        //                       '#a50026';
        // };



    // Create a new choropleth layer
    geojson = L.choropleth(data, {
        
      // Define what  property in the features to use
      valueProperty: sample,
      // valueProperty: chosenYear,
  
      // Set color scale
    //   scale: ["#F02307", "#BEFF33"],
    colors: [ "#f0f0f0", "#F02307", "#EB390B", "#E64F0F", "#E16514", "#DC7B18", "#D7911D", "#D2A721", "#CDBD25", "#C8D32A", "#C3E92E", "#BEFF33" ],
           //"#ffffff",                   //, "d9d9d9", "bdbdbd"       
  
  
      // Number of breaks in step range
      steps: 12,  //was 10
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.55
        // fillColor: getColor(fe)
      },
      
    //   style: function(feature) {
    //     //   switch (data) {
    //     //     case "Valid":
    //           return {
    //             fillColor: getColor(feature.properties[sample]),
    //             color: '#fff',
    //             weight: 1,
    //             fillOpacity: 0.7
    //           }
        //     default:
        //       return {
        //         fillColor: "blue",
        //         color: '#fff',
        //         weight: 1,
        //         fillOpacity: 0.1
        //       }
        //   }
        // },
      




    //   try{
    //                 // Binding a pop-up to each layer
    //     onEachFeature: function(feature, layer) {
    //         layer.bindPopup("Country: " + feature.properties.country + "<hr>Happiness Score:<br>" +
    //         feature.properties[sample].toFixed(2));
    //     }
    //     catch(error) {
    //         functionToHandleError(error);
    //     }
    //     }

      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Country: " + feature.properties.country + "<hr>Happiness Score:<br>" +
           feature.properties[sample]);
      }
      
      


    }).addTo(myMap);
  

    // var path= d3.select('path')
    //   Object.entries(geojson).forEach(([key, value]) => {
    //     path.append("h5").text(`${key.toUpperCase()}: ${value}`);
    // });

    // Object.values()


    // Set up the legend
    var legendSelect= d3.select('.legend');

    var legend = L.control({ position: "topright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojson.options.limits;
      var colors = geojson.options.colors;
      var labels = [];
  
      // Add min & max
    //   var legendInfo = "<h2>Happiness Score 2021</h2>" +
      var legendInfo = `<h2>Happiness Score ${sample}</h2>` +

        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0].toFixed(2) + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1].toFixed(2) + "</div>" +
        "</div>" +
         '<h4> </h4>' +'<h7 class="disclaimer">         *white = No Value </h7>';
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
    
    // legendSelect.html("");
    legendSelect.remove()

    // Adding legend to the map
    legend.addTo(myMap);
  
  });
};




function optionChanged(nextSample) {
    buildMap(nextSample);

};



const labels = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
// console.log(labels.reverse())
const reverseLabels = labels.reverse();

function init() {


    var pullDownMenu = d3.select("#selDataset");

    d3.json(geoData).then((data) => {
        var names = reverseLabels;
        console.log(names);

        names.forEach((sample) => {
            pullDownMenu
                .append("option")
                .property("value", sample)
                .text(sample);
        });

    });



    buildMap(2021)
};



init();