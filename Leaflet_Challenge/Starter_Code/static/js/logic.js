// Creating the map object
let myMap = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
  
    // Function to determine color based on earthquake depth
    function getValue(x) {
        return x > 90 ? "#644D8E" :
               x > 70 ? "#8E5B91" :
               x > 50 ? "#C76B8F" :
               x > 30 ? "#DC828E" :
               x > 10 ? "#EC988E" :
                   "#FFCC99";
    }
    // "#FFCC99", "#EC988E", "#DC828E", "#C76B8F", "#8E5B91", "#644D8E" starting from -10
      
    // Function to style each earthquake on the map 
      function style(feature) {
        return {
            stroke: true,
            radius: feature.properties.mag*3,
            fillColor: getValue(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 0.8,
            fillOpacity: 0.8
        };
    }
    
    // Creating a GeoJSON layer with styled features
       var dat = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
   
  
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
          feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]);
      }
    }).addTo(myMap);
  
    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10,10,30,50,70,90];
      let colors = ["#FFCC99", "#EC988E", "#DC828E", "#C76B8F", "#8E5B91", "#644D8E"];
      
      // Loop through depth limits and colors to create legend
      for (let i = 0; i < limits.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  
  });
  
  