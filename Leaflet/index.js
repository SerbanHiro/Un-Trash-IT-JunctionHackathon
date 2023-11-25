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
        maxClusterRadius: 500,
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

        if (layerName === 'glass') {
            // Use the glassIcon for glass markers
            marker = L.marker([data.lat, data.lng], { icon: glassIcon }).bindPopup(data.popup);
        } else if (layerName === 'household-garbage') {
            // Use the default icon for household-garbage markers
            marker = L.marker([data.lat, data.lng], { icon: householdGarbageIcon }).bindPopup(data.popup);
        } else if (layerName === 'recyclable-garbage') {
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
    { lat: 47.51, lng: 18.95, popup: 'Marker 1 Glass' },
    { lat: 47.53, lng: 19.05, popup: 'Marker 2 Glass' },
    { lat: 47.55, lng: 19.10, popup: 'Marker 3 Glass' }
];

var markersArrayHousehold = [
    { lat: 47.48, lng: 19.08, popup: 'Marker 1 Household' },
    { lat: 47.46, lng: 18.98, popup: 'Marker 2 Household' },
    { lat: 47.44, lng: 19.15, popup: 'Marker 3 Household' }
];

var markersArrayRecyclable = [
    { lat: 47.498, lng: 19.03, popup: 'Recyclable Garbage 1' },
    { lat: 47.496, lng: 19.035, popup: 'Recyclable Garbage 2' },
    { lat: 47.497, lng: 19.028, popup: 'Recyclable Garbage 3' }
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
    { lat: 47.4556777, lng: 19.1781252, popup: 'Csomagolási és egyes veszélyes hulladékok - VIII. Sárkány u. 5.' },
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
createMarkerCluster(markersArrayHousehold, 'household-garbage');
createMarkerCluster(markersArrayRecyclable, 'recyclable-garbage');

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

    // Add the selected layer to the map
    if (layer === 'glass') {
        currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© Mapbox',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
        });
        map.markerClusters['glass'].addTo(map); // Add the glass layer markers
    } else if (layer === 'household-garbage') {
        // TODO: Use a different tile layer for household-garbage view
        currentLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© Mapbox',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            accessToken: 'pk.eyJ1IjoianVzdDFkYW5pIiwiYSI6ImNscGRyMG5sYTE5NjYycWxzNDhvdnoxNnEifQ.HaLpsV6T-CVuiU57jXjRRQ'
        });
        map.markerClusters['household-garbage'].addTo(map); // Add the household-garbage layer markers
    } else if (layer === 'recyclable-garbage') {
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

    L.geoJSON(data, {
        style: function (feature) {
            return {
                fill: false
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
            if (layer.feature && layer.feature.properties.name === districtName) {
                districtLayer = layer;
            }
        });

        // If the district layer is found, fit the map to its bounds
        if (districtLayer) {
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
