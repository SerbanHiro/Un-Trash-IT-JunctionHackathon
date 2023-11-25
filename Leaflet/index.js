var map = L.map('map').setView([47.4979, 19.0402], 13); // Budapest coordinates

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© Mapbox',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
}).addTo(map);

// Function to create marker clusters and add markers to the map
function createMarkerCluster(markers, layerName) {
    var markerCluster = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        maxClusterRadius: 100,
        iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();
            var c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }

            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 20)
            });
        }
    });

    markers.forEach(function (data) {
        var marker;

        if (layerName == 'glass') {
            // Use the glassIcon for glass markers
            marker = L.marker([data.lat, data.lng], { icon: glassIcon }).bindPopup(data.popup);
        } else if (layerName == 'household-garbage') {
            // Use the default icon for household-garbage markers
            marker = L.marker([data.lat, data.lng], { icon: householdGarbageIcon }).bindPopup(data.popup);
        } else if (layerName == 'recyclable-garbage') {
            // Use the default icon for household-garbage markers
            marker = L.marker([data.lat, data.lng], { icon: recyclableGarbageIcon }).bindPopup(data.popup);
        } else {
            // Use a different icon for other layers if needed
            marker = L.marker([data.lat, data.lng], { /* other layers can be here */}).bindPopup(data.popup);
        }

        markerCluster.addLayer(marker);
    });

    map.markerClusters[layerName] = markerCluster; // Save the marker cluster in a map object
}


var markersArrayGlass = [
    { lat: 47.4844971, lng: 19.0841891, popup: 'üveggyűjtő sziget - VIII. kerület, Illés utca 32-vel szemben' },
    { lat: 47.4862515, lng: 19.0793579, popup: 'üveggyűjtő sziget - VIII. kerület, Práter utca -Szigony utca sarok SPAR előtt' },
    { lat: 47.4901467, lng: 19.0829748, popup: 'üveggyűjtő sziget - VIII. kerület, Dankó utca 23. - Magdolna utca sarok' },
    { lat: 47.4929454, lng: 19.0764147, popup: 'üveggyűjtő sziget - VIII. kerület, Déry Miksa utca 19 előtt' },

    { lat: 47.494037, lng: 19.0796845, popup: 'üveggyűjtő sziget - VIII. kerület, Vay Ádám utca - Alföldi utca' },
    { lat: 47.4912433, lng: 19.1050119, popup: 'üveggyűjtő sziget - VIII. kerület, Törökbecse utcában, sport utcában' },
    { lat: 47.4767744, lng: 19.0989147, popup: 'üveggyűjtő sziget - VIII. kerület, Győrffy István utca 24-gyel szemben' },
    { lat: 47.4786036, lng: 19.0944534, popup: 'üveggyűjtő sziget - VIII. kerület, Rezső tér 16-tal szemben' },
    
];

var markersArrayHousehold = [
    { lat: 47.489059, lng: 19.1073802, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Lokomotív utca - Tbiliszi (voltVagon) tér (a templom mögött)' },
    { lat: 47.4924047, lng: 19.1085199, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Hungária krt. 12-14. előtt' },
    { lat: 47.4924274, lng: 19.1062718, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Ciprus u. - Törökbecse u. új társasházzal szemben' },
    { lat: 47.495918, lng: 19.107533, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Hős utca 9-11. (Penny Market parkolóval szemben)' },
    { lat: 47.4973672, lng: 19.1045862, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Stróbl Alajos utca 7. - Strázsa utca sarok' },
    { lat: 47.4822384, lng: 19.0915241, popup: 'háztartási hulladékgyűjtő sziget - VIII. kerület, Diószegi Sámuel utca (iskolával szemben)' },
];

function generateRandomCoordinatesInFeature(numCoordinates, feature, arrayToAddTo) {
    const bounds = feature.getBounds();
    var sw=bounds.getSouthWest();
    var ne=bounds.getNorthEast();

    for (var i = 0; i < numCoordinates; i++) {
        var randomLat = Math.random() * (ne.lat - sw.lat) +sw.lat;
        var randomLng = Math.random() * (ne.lng - sw.lng) +sw.lng;
        if (isMarkerInsidePolygon(randomLat,randomLng,feature)) {
          arrayToAddTo.push({
            lat: randomLat,
            lng: randomLng,
            popup: 'Háztartási hulladékgyűjtő sziget - VIII. kerület, household garbage dumpster'
          });
        }
      }
}

function isMarkerInsidePolygon(randomLat,randomLng, poly) {
    var polyPoints = poly.getLatLngs();
    var x = randomLat, y = randomLng;
    // console.log('~~~')
    // console.log(polyPoints.length);
    // console.log('-----');
    // console.log("Lat: "+x);
    // console.log("Lng: "+y);

    // Bi-dimensional Ray Casting Algorithm 
    var inside = false;
    for(var k=0;k<polyPoints.length;++k) {
        for(var i=0,j=polyPoints[k].length -1; i<polyPoints[k].length; j=i++) {
            var xi = polyPoints[k][i].lat, yi = polyPoints[k][i].lng;
            var xj = polyPoints[k][j].lat, yj = polyPoints[k][j].lng;
            // console.log("Xi: "+xi);
            // console.log("Xj: "+xj);
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            //console.log("Intersect: "+intersect);
            if (intersect) inside = !inside;
        }
    }
    // console.log(inside);
    // console.log('~~~');
    return inside;
}

// Load GeoJSON data using Fetch API
fetch('hungary_administrative_boundaries_level9_polygon.geojson')
    .then(response => response.json())
    .then(data => {
        // Find the feature for the 8th district
        //processGeoJSON(data);
        var districtLayer = null;
        map.eachLayer(function (layer) {
            if(layer.feature != undefined) {
                console.log(layer.feature.properties.name);
            }
            if (layer.feature && layer.feature.properties.name == 'VIII. kerület') {
                districtLayer = layer;
            }
        });
        if(districtLayer==null) {
            processGeoJSON(data);
            map.eachLayer(function (layer) {
                if(layer.feature != undefined) {
                    console.log(layer.feature.properties.name);
                }
                if (layer.feature && layer.feature.properties.name == 'VIII. kerület') {
                    districtLayer = layer;
                }
            });
        }
        //console.log(districtLayer);
        if (districtLayer) {
            // Example: Generate 5 random coordinates and add them to the existing array
            generateRandomCoordinatesInFeature(1000, districtLayer, markersArrayHousehold);
            createMarkerCluster(markersArrayHousehold, 'household-garbage');
            generateRandomCoordinatesInFeature(200, districtLayer, markersArrayRecyclable);
            createMarkerCluster(markersArrayRecyclable, 'recyclable-garbage');
        } else {
            console.error('Could not find the 8th district in the GeoJSON file.');
        }
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

var markersArrayRecyclable = [
    { lat: 47.489059, lng: 19.1073802, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Lokomotív utca - Tbiliszi (voltVagon) tér (a templom mögött)' },
    { lat: 47.4924047, lng: 19.1085199, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Hungária krt. 12-14. előtt' },
    { lat: 47.4924274, lng: 19.1062718, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Ciprus u. - Törökbecse u. új társasházzal szemben' },
    { lat: 47.495918, lng: 19.107533, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Hős utca 9-11. (Penny Market parkolóval szemben)' },
    { lat: 47.4973672, lng: 19.1045862, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Stróbl Alajos utca 7. - Strázsa utca sarok' },
    { lat: 47.4822384, lng: 19.0915241, popup: 'újrahasznosítható hulladékgyűjtő sziget - VIII. kerület, Diószegi Sámuel utca (iskolával szemben)' },
];

var recyclingCenters = [
    { lat: 47.5874915, lng: 19.1330443, popup: 'Csomagolási és egyes veszélyes hulladékok - XV., Károlyi Sándor út 166.' },
    { lat: 47.581775, lng: 19.0996315, popup: 'Csomagolási és egyes veszélyes hulladékok - IV., Ugró Gyula sor 1-3.' },
    { lat: 47.5644109, lng: 19.0185153, popup: 'Csomagolási és egyes veszélyes hulladékok - III., Testvérhegyi út 10/a' },
    { lat: 47.5602986, lng: 19.1066354, popup: 'Csomagolási és egyes veszélyes hulladékok -IV. Zichy Mihály u. - Istvántelki út sarok' },
    { lat: 47.538745, lng: 19.1460843, popup: 'Csomagolási és egyes veszélyes hulladékok - XV., Zsókavár u. végénél (a 65. szám után)' },
    { lat: 47.5374944, lng: 19.0924625, popup: 'Csomagolási és egyes veszélyes hulladékok - XIII. Tatai út 96.' },
    { lat: 47.5203917, lng: 19.1484087, popup: 'Csomagolási és egyes veszélyes hulladékok - XVI. Csömöri út 2-4.' },
    { lat: 47.5136105, lng: 19.150555, popup: 'Csomagolási és egyes veszélyes hulladékok - XIV. Füredi út 74.' },
    { lat: 47.4929718, lng: 19.1401832, popup: 'Csomagolási és egyes veszélyes hulladékok - X., Fehér köz 2.' },
    { lat: 47.4762887, lng: 19.2470695, popup: 'Csomagolási és egyes veszélyes hulladékok - XVII. Gyökér köz 4.' },
    { lat: 47.485057, lng: 19.0909733, popup: 'Csomagolási és egyes veszélyes hulladékok - VIII. Sárkány u. 5.' },
    { lat: 47.4691658, lng: 19.0290053, popup: 'Csomagolási és egyes veszélyes hulladékok - XI., Bánk bán u. 8-10.' },
    { lat: 47.4681011, lng: 19.1061347, popup: 'Csomagolási és egyes veszélyes hulladékok - IX. Ecseri út 9.' },
    { lat: 47.4556777, lng: 19.1781252, popup: 'Csomagolási és egyes veszélyes hulladékok - XVIII. Jegenye fasor 15.' },
    { lat: 47.4244524, lng: 19.1757876, popup: 'Csomagolási és egyes veszélyes hulladékok - XVIII. Ipacsfa u. 14' },
    { lat: 47.4272589, lng: 19.164687, popup: 'Csomagolási és egyes veszélyes hulladékok - XVIII. Besence utca 1/a.' },
    { lat: 47.4224701, lng: 19.0611742, popup: 'Csomagolási és egyes veszélyes hulladékok - XXI. Mansfeld Péter u. 86.' },
    { lat: 47.3885806, lng: 18.975447, popup: 'Csomagolási és egyes veszélyes hulladékok - XXII., Nagytétényi út 335.' },
    { lat: 47.3790753, lng: 18.7976967, popup: 'Csomagolási és egyes veszélyes hulladékok - PUSZTAZÁMORI SZELEKTÍV HULLADÉKGYŰJTŐ-UDVAR' },
];

var recyclingIcon = L.icon({
    iconUrl: 'Icons/eco.svg',
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

var glassIcon = L.icon({
    iconUrl: 'Icons/glass-trash-svgrepo-com.svg',
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32] 
});

var householdGarbageIcon = L.icon({
    iconUrl: 'Icons/dumpster-svgrepo-com.svg',
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32] 
});

var recyclableGarbageIcon = L.icon({
    iconUrl: 'Icons/dumpster-recyclable-svgrepo-com.svg',
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32] 
});

// Create recycling markers with custom icon
var recyclingMarkers = recyclingCenters.map(function (data) {
    return L.marker([data.lat, data.lng], { icon: recyclingIcon }).bindPopup(data.popup);
});

var recyclingLayer = L.layerGroup(recyclingMarkers);

recyclingLayer.addTo(map);

// Control to switch between layers
L.control.layers({}, { 'Recycling Centers': recyclingLayer }, { collapsed: false }).addTo(map);

// Create marker clusters and add markers to the map
map.markerClusters = {}; // Object to store marker clusters

createMarkerCluster(markersArrayGlass, 'glass');

var currentLayer;

function changeMapLayer(layer) {
    // Remove the current layer if it exists
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    // Remove previous marker clusters
    if (map.markerClusters['glass']) {
        map.removeLayer(map.markerClusters['glass']);
    }
    if (map.markerClusters['household-garbage']) {
        map.removeLayer(map.markerClusters['household-garbage']);
    }
    if (map.markerClusters['recyclable-garbage']) {
        map.removeLayer(map.markerClusters['recyclable-garbage']);
    }
    reupdateMap(layer);
}

function reupdateMap(layer) {
    // Add the selected layer to the map
    if (layer == 'glass') {
        currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© Mapbox',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
        });
        map.markerClusters['glass'].addTo(map); // Add the glass layer markers
    } else if (layer == 'household-garbage') {
        // TODO: Use a different tile layer for household-garbage view
        currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© Mapbox',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
        });
        map.markerClusters['household-garbage'].addTo(map); // Add the household-garbage layer markers
    } else if (layer == 'recyclable-garbage') {
        currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© Mapbox',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
        });
        map.markerClusters['recyclable-garbage'].addTo(map); // Add the household-garbage layer markers
    }

    currentLayer.addTo(map);
}

function animateLayerContainer() {
    var layerContainer = document.getElementById('layerContainer');
    layerContainer.classList.add('here');
}

// Execute the animation when the page loads
animateLayerContainer();

$.getJSON('hungary_administrative_boundaries_level9_polygon.geojson', function (data) {
    processGeoJSON(data);
});

function processGeoJSON(data) {
    var districtSelector = document.getElementById('districtSelector');
    districtSelector.innerHTML = '';

    L.geoJSON(data, {
        style: function (feature) {
            return {
                fill: true,
                fillOpacity: 0
            };
        },
        onEachFeature: function (feature, layer) {
            // Bind a popup with the district name
            layer.bindPopup('District: ' + feature.properties.name);

            // Add click event to show popup on click
            layer.on('click', function () {
                layer.openPopup();
            });

            // Add the district as an option in the selector
            var option = document.createElement('option');
            option.value = feature.properties.name;
            option.text = feature.properties.name;
            districtSelector.add(option);
        }
    }).addTo(map);

    sortOptions(districtSelector);

    districtSelector.addEventListener('change', function () {
        var selectedDistrict = this.value;
        centerOnDistrict(selectedDistrict);
    });

    function sortOptions(menu) {
        var options = Array.from(menu.options);
        quickSort(options, 0, options.length - 1);
        menu.innerHTML = '';
        options.forEach(option => {
            menu.add(option);
        });
    }

    function quickSort(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    function partition(arr, low, high) {
        const pivot = arr[high].text.split('.')[0];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            const current = arr[j].text.split('.')[0];
            if (!romanSort(current, pivot)) {
                i++;
                swap(arr, i, j);
            }
        }

        swap(arr, i + 1, high);
        return i + 1;
    }

    function swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    function romanToInteger(roman) {
        var romanMap = {
            I: 1,
            IV: 4,
            V: 5,
            IX: 9,
            X: 10,
            XL: 40,
            L: 50,
            XC: 90,
            C: 100,
            CD: 400,
            D: 500,
            CM: 900,
            M: 1000
        };

        var sum = 0;
        for (var i = 0; i < roman.length; ++i) {
            var current = romanMap[roman[i]];
            var next = romanMap[roman[i + 1]];
            if (next > current) {
                sum += next - current;
                ++i;
            } else {
                sum += current;
            }
        }
        return sum;
    }

    function romanSort(a, b) {
        var sumA = romanToInteger(a);
        var sumB = romanToInteger(b);
        return sumA > sumB;
    }

    function centerOnDistrict(districtName) {
        // Find the GeoJSON layer corresponding to the selected district
        var districtLayer = null;
        map.eachLayer(function (layer) {
            if (layer.feature && layer.feature.properties.name == districtName) {
                districtLayer = layer;
            }
        });

        // If the district layer is found, fit the map to its bounds
        if (districtLayer) {
            console.log(districtLayer.feature.properties.population);
            map.fitBounds(districtLayer.getBounds());
        }
    }
}

currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© Mapbox',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
});


currentLayer.addTo(map);

function getColorFromIndex(index, scale) {
    if (index < 0.25) {
        return scale[0]; // Green
    } else if (index < 0.5) {
        return scale[1]; // Yellow
    } else if (index < 0.75) {
        return scale[2]; // Orange
    } else {
        return scale[3]; // Red
    }
}

// Add an event listener for the districtSelector change event
document.getElementById('districtSelector').addEventListener('change', function () {
    const selectedDistrict = this.value;
    centerOnDistrict(selectedDistrict);
});

function centerOnDistrict(districtName) {
    // Find the GeoJSON layer corresponding to the selected district
    let districtLayer = null;
    map.eachLayer(function (layer) {
        if (layer.feature && layer.feature.properties.name == districtName) {
            districtLayer = layer;
        }
    });

    // If the district layer is found, fit the map to its bounds and split into polygons
    if (districtLayer) {
        map.fitBounds(districtLayer.getBounds());
        var bounds = districtLayer.getLatLngs(); // bounds is an array of LatLngs arrays
        
        var geojsonFeature = districtLayer.toGeoJSON();

        // Create square grid subdivisions within the bounding box
        var bbox = turf.bbox(geojsonFeature);
        var subdivisions = turf.squareGrid(bbox, 0.09, { units: 'kilometers' });

        subdivisions.features.forEach(function (feature) {
            // Generate a random color (hex format)
            var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        
            var coordinates = feature.geometry.coordinates;
            var shouldShow = false; 
            coordinates.forEach(function (ring) {
                ring.forEach(function (coord) {
                    var lat = coord[1];
                    var lng = coord[0];
                    if (isMarkerInsidePolygon(lat, lng, districtLayer)) {
                        shouldShow = true;
                    }
                });
            });
        
            if (shouldShow) {
                L.geoJSON(feature, {
                    style: function () {
                        return {
                            fillColor: randomColor,
                            fillOpacity: 1, // Adjust the fill opacity here
                            color: 'black',  // Border color
                            weight: 1        // Border width
                        };
                    }
                }).addTo(map);
            }
        });
        
        

        console.log(subdivisions);
    }
}