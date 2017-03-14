        $(document).ready(function() {
            var Config = {
                APIEndpoint: "https://d197bs3ond.execute-api.eu-west-1.amazonaws.com/dev/"
            }
            $.ajaxSetup({ cache: false });
            var geocoder = new google.maps.Geocoder();
            getBerrys();



            $("#map").googleMap({
                zoom: 10, // Initial zoom level (optional)
                coords: [43.384584368534114, 12.527141341015623], // Map center (optional)
                type: "TERRAIN" // Map type (optional)
            });

            $('.mover-add').on('click', function(e) {
                e.preventDefault();
                var cloned = 0;
                $("#map").addMarker({
                    icon: 'assets/img/mover48.png',
                    draggable: true,
                    success: function(e) {
                        cloned++;
                        if (cloned > 1) {
                            var payload = { activity: "6.7", location: e };
                            codeLatLngEq(e.lat, e.lon);
                            $("body").effect("shake", { times: 12 });
                            console.log(payload);
                        }
                    }
                });
            });

            $('.berry-add').on('click', function(e) {
                e.preventDefault();
                var cloned = 0;

                $("#map").addMarker({
                    icon: 'assets/img/rb24.png',
                    draggable: true,
                    success: function(e) {
                        cloned++;
                        if (cloned > 1) {
                            codeLatLng(e.lat, e.lon);
                            console.log(e.lon);

                        }
                    }
                });
            });



            function postTopic(payload, topic) {
                var method = "publish/" + topic;
                var enpoint = Config.APIEndpoint + method;
                $.ajax({
                    url: enpoint,
                    data: JSON.stringify(payload),
                    dataType: 'json',
                    type: "POST"
                }).done(function(data) {
                    console.log(data)
                });;
            }

            function getBerrys() {
                var enpoint = "https://search-eqsimul-elasti-3oj40uf39t-h6xzwf2obovswx5tvii4hnqqlq.eu-west-1.es.amazonaws.com/shadow_index/_search?pretty=true&q=*:*&t=" + new Date().getTime();
                $.ajax({
                    url: enpoint,
                    dataType: 'json',
                    type: "GET"
                }).done(function(data) {
                    manageBerrys(data.hits.hits);
                });;
            }


            function codeLatLng(lat, lng) {
                var point = {
                    "range": [lat, lng],
                    "country": "",
                    "region": "",
                    "city": "",
                    "ll": [lat, lng],
                    "metro": 0,
                    "state": { "desired": { "active": true }, "reported": { "active": true } },
                    "clientToken": "",
                    "thingArn": "arn:aws:iot:eu-west-1:511386292871:thing/RPi1",
                    "thingIotEndpoint": "https://ak8by74ifg9ks.iot.eu-west-1.amazonaws.com"
                };

                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //formatted address
                            point.city = results[0].formatted_address;
                            //find country name
                            for (var i = 0; i < results[0].address_components.length; i++) {
                                for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                                    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                    if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                        //this is the object you are looking for
                                        city = results[0].address_components[i];
                                    }
                                    if (results[0].address_components[i].types[b] == "country") {
                                        //this is the object you are looking for
                                        country = results[0].address_components[i];
                                        console.log(country);
                                        break;
                                    }

                                }
                            }
                            //city data
                            point.region = city.long_name;
                            point.country = country.long_name;
                            point.clientToken = guid();
                            postTopic(point, "shadow");

                        } else {
                            console.log("No results found");
                        }
                    } else {
                        console.log("Geocoder failed due to: " + status);
                    }
                });
            }

            function codeLatLngEq(lat, lng) {
                var point = {
                    type: 'Feature',
                    properties: {
                        mag: 4.7,
                        place: '',
                        time: new Date().getTime(),
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [lat, lng]
                    },
                    id: guid()
                };

                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //formatted address
                            point.place = results[0].formatted_address;
                            //find country name
                            for (var i = 0; i < results[0].address_components.length; i++) {
                                for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                                    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                    if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                        //this is the object you are looking for
                                        city = results[0].address_components[i];
                                    }
                                    if (results[0].address_components[i].types[b] == "country") {
                                        //this is the object you are looking for
                                        country = results[0].address_components[i];
                                        break;
                                    }

                                }
                            }
                            //city data
                            point.clientToken = guid();
                            postTopic(point, "simulator");

                        } else {
                            console.log("No results found");
                        }
                    } else {
                        console.log("Geocoder failed due to: " + status);
                    }
                });
            }

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };

            function manageBerrys(points) {
                for (i = 0; i < points.length; i++) {
                    var coord = points[i]['_source']['ll'];
                    $("#map").addMarker({
                        coords: [coord[0], coord[1]],
                        icon: 'assets/img/rb24.png',
                        draggable: false,
                        success: function(e) {}
                    });
                }
            }




        });