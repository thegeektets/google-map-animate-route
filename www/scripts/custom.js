  var map;
  var directionsService;
  var stepDisplay;
  var animationmarker = null;
  var polyline = null;
  var poly2 = null;
  var waypoint = 0;
  var routes = [
  "-1.300355, 36.773850",
  "-1.300184, 36.776811",
  "-1.299840, 36.779386",
  "-1.298897, 36.779407",
  "-1.299004, 36.777841",
  "-1.298982, 36.776811",
  "-1.297459, 36.776747",
  "-1.296193, 36.776726",
  "-1.296097, 36.779236",
  "-1.296151, 36.777637",
  "-1.296215, 36.776693",
  "-1.294252, 36.776586",
  "-1.294048, 36.776790",
  "-1.293973, 36.779118",
  "-1.292622, 36.779075",
  "-1.291844, 36.779049",
  "-1.291879, 36.778389"
  ];
  var end_num = 16;
  var start_num = 0;



// initialize google maps in nairobi
function initialize() {
  infowindow = new google.maps.InfoWindow(
    { 
      size: new google.maps.Size(150,50)
    });
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    // Create a map and center it on Nairobi.
    var myOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    address = 'nairobi'
    geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) {
       map.setCenter(results[0].geometry.location);
	});
    
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
  	path: [],
  	strokeColor: '#f57f20',
  	strokeWeight: 3
      });
    poly2 = new google.maps.Polyline({
  	path: [],
  	strokeColor: '#f57f20',
  	strokeWeight: 3
      });

    animationmarker = new google.maps.Marker({
        map: map,
        icon: {
            url: 'images/rider.png',
            scaledSize: new google.maps.Size(25, 25),
            rotation: 45
          },
    });
    // calculate route on load
  	calcRoute();
}

function getLatLngFromString(ll) {
    var latlng = ll.split(/, ?/)
    return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1])); 
}

// attempt to draw route as you animate
function calcRoute(){
    
    setTimeout(function () {
        var path = poly2.getPath();
        path.push(getLatLngFromString(routes[waypoint]));
        // Add a new marker at the new plotted point on the polyline.
        if(waypoint==0 || waypoint == (routes.length-1)){
            var marker = new google.maps.Marker({
              position:getLatLngFromString(routes[waypoint]),
              title: '#' + path.getLength(),
              map: map
            });
  
        }
        
        eol=polyline.Distance();
        var endlocation =  getLatLngFromString(routes[waypoint]);
        map.setCenter(endlocation);
        poly2 = new google.maps.Polyline({path: path, strokeColor:"#f57f20", strokeWeight:4});
        poly2.setMap(map);
        animate(50,endlocation); // Allow time for the initial map display

        waypoint = waypoint + 1;
        if(waypoint < routes.length){
          calcRoute();  
        }
        
    }, 1000);

   	
}
  



function animate(d,endLocation) {
  
  if (d>eol) {
    map.panTo(endLocation);
    animationmarker.setPosition(endLocation);
    animationmarker.zIndex = Math.round(endLocation.lat()*-100000)<<5
    
    return;
  }
  var p = polyline.GetPointAtDistance(d);
  map.panTo(p);
  animationmarker.setPosition(p);
  updatePoly(d);
  timerHandle = setTimeout("animate("+(d+step)+")", tick);
} 

