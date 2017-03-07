        $(document).ready(function() {
            var Config = {
                APIEndpoint: "https://d197bs3ond.execute-api.eu-west-1.amazonaws.com/dev/"
            }

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
                $(ui.helper).css({ "position": "absolute" });
                $(this).after($(ui.helper).clone().draggable());
                $('.berry-add.ui-draggable').bind('dragstop', function(event, ui) {
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
                        postTopic(obj, "shadow");
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
        });