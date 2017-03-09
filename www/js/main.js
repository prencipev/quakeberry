        $(document).ready(function() {
            var Config = {
                APIEndpoint: "https://d197bs3ond.execute-api.eu-west-1.amazonaws.com/dev/"
            }

            var geocoder = new google.maps.Geocoder();

            try {
                $('main').ripples({
                    resolution: 512,
                    dropRadius: 20, //px
                    perturbance: 0.04,
                    interactive: false
                });
            } catch (e) {
                $('.error').show().text(e);
            }

            $('.js-ripples-disable').on('click', function() {
                $('body, main').ripples('destroy');
                $(this).hide();
            });

            $('main').on('click', function(e) {
                $(this).ripples('drop', (e.pageX), (e.pageY), 10, 1)
            })

            $('.berry-add').draggable({ helper: "clone" });

            $('.berry-add').bind('dragstop', function(event, ui) {
                $(ui.helper).width("24");
                $(ui.helper).height("24");
                var cloned = 0;
                $("#map").addMarker({
                    coords: [45.4654219, 9.18592430000001],
                    icon: 'img/rb24.png',
                    draggable: true,
                    success: function(e) {
                        cloned++;
                        if (cloned > 1) {
                            codeLatLng(e.lat, e.lon);
                            console.log(e.lon);
                        }
                    }
                });
                var point = { "range": [48539648, 48545791], "country": "IT", "region": "09", "city": "Milan", "ll": [45.4667, 9.2], "metro": 0, "state": { "desired": { "active": true }, "reported": { "active": true } }, "clientToken": "RPi1-0", "thingArn": "arn:aws:iot:eu-west-1:511386292871:thing/RPi1", "thingIotEndpoint": "https://ak8by74ifg9ks.iot.eu-west-1.amazonaws.com" }
                    /*$('.berry-add.ui-draggable').bind('dragstop', function(event, ui) {
                        if (!$(this).attr('id')) {
                            $(this).uniqueId();
                        }

                        var obj = {
                            device_id: $(this).attr('id'),
                            long: ($(this).position().top).toFixed(2),
                            lat: ($(this).position().left).toFixed(2),
                            status: "ACTIVE",
                            ip: ""
                        }

                        if (obj.long != "0.00") {
                            
                        }

                    });*/
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


            function codeLatLng(lat, lng) {
                var point = {
                    "range": [lat, lng],
                    "country": "",
                    "region": "",
                    "city": "",
                    "ll": [lat, lng],
                    "metro": 0,
                    "state": { "desired": { "active": true }, "reported": { "active": true } },
                    "clientToken": "RPi1-0",
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
                            postTopic(point, "shadow");

                        } else {
                            console.log("No results found");
                        }
                    } else {
                        console.log("Geocoder failed due to: " + status);
                    }
                });
            }
        });