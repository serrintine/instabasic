(function() {

    var BasicMap = BasicMap || {};
    var _logLimit = 100;
    var tags = [];
    var links = []
    var total_posts = 0;
    var post_intervals = [];
    var post_times = [];
    /*var lineChartData = [{
        label: "Number of Posts",
        values: []
    }];*/
    var _initialBubbleSize = 5;
    var _startTime = new Date().getTime();
    var dataKeyVal = [{"tag": "selfie", "counts": 0},
                        {"tag": "nofilter", "counts": 0},
                        {"tag": "brunch", "counts": 0},
                        {"tag": "starbucks", "counts": 0}];

    var basicLevelScalingFactor = 1000000;
    var topFive = '';

    var update_post = function(rc_str, limit) {
        $('#post-list').prepend('<li>' + rc_str + '</li>');
        if($('#post-list li').length > limit) {
            $('#post-list li').slice(limit, limit + 1).remove();
        }
    };

    BasicMap.addBubble = function(to_add) {
        var val = null;
        var newRadius = _initialBubbleSize;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].longitude === to_add.longitude && tags[i].latitude === to_add.latitude) {
                val = i;
                break;
            }
        }

        if (val != null) {
            newRadius += Math.sqrt(tags[val].radius);
            tags.splice(val, 1);
        }
        
        tags.push({
            name: to_add.name + ': ' + basicArr[to_add.state][to_add.name],
            radius: newRadius,
            fillKey: to_add.name,
            latitude: to_add.latitude,
            longitude: to_add.longitude
        });
        
        basic.bubbles(tags, 
        {    popupTemplate: function (geo, data) { 
                 return ['<div class="hoverinfo">' +  data.name, '</div>'].join('');
             },
             borderWidth: 1,
             highlightOnHover: false/*,
             highlightFillColor: '#fdec4e',
             highlightBorderWidth: 1*/
        });
    };

    BasicMap.checkDistance = function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { 
            dist = dist * 1.609344 
        }
        if (unit=="N") { 
            dist = dist * 0.8684 
        }
        return dist;
    };

    var basic = new Datamap({
        scope: 'usa',
        element: document.getElementById('basic-map'),
        geographyConfig: {
            highlightBorderColor: '#ffffff',
            popupTemplate: function(geography, data) {
                var basicLevel = Math.ceil((data.basiclvl * basicLevelScalingFactor) / data.pop);
                if (basicLevel > 100) {
                    basicLevel = 'Over 9000'
                }
                return '<div class="hoverinfo">' + geography.properties.name + ' has ' +  data.basiclvl + ' basic tags. <br> Basic Level = ' + basicLevel
            },
            highlightBorderWidth: 1,
            highlightOnHover: false/*,
            highlightFillColor: '#89cfff'*/
        },
        fills: {
            "Birmingham":"#f96161","Montgomery":"#fdec4e","Mobile":"#f029e5",
            "Anchorage":"#68d603","Juneau":"#d911f0","Fairbanks":"#fac061",
            "Phoenix":"#ef908c","Tucson":"#a0c9ee","Mesa":"#c9e544",
            "Little Rock":"#98df12","Fort Smith":"#90f821","Fayetteville":"#e64be6",
            "Los Angeles":"#a573ce","San Diego":"#5df666","San Jose":"#3a29ad",
            "Denver":"#b902d4","Colorado Springs":"#d3e294","Aurora":"#5eebf4",
            "Bridgeport":"#cf0213","New Haven":"#18f7fb","Hartford":"#e8d467",
            "Wilmington":"#4237e3","Dover":"#28e95f","Newark":"#88220c",
            "Jacksonville":"#f31908","Miami":"#44ad01","Tallahassee":"#caf8d6",
            "Atlanta":"#4c96fe","Augusta":"#890a70","Columbus":"#1fc4f4",
            "Honolulu":"#576867","Hilo":"#00189f","Kailua":"#841d95",
            "Boise":"#04eda9","Nampa":"#1d80f1","Idaho Falls":"#e7192d",
            "Chicago":"#06569b","Aurora":"#c7269b","Rockford":"#63d710",
            "Indianapolis":"#c43c85","Fort Wayne":"#1024d2","Evansville":"#27d46d",
            "Des Moines":"#a2f5fb","Cedar Rapids":"#b41230","Davenport":"#2c007e",
            "Wichita":"#c1d61e","Overland Park":"#00a893","Kansas City":"#3da6ec",
            "Louisville":"#ecae08","Lexington":"#7c04e6","Owensboro":"#2c9a1e",
            "New Orleans":"#201aa0","Shreveport":"#5b59c1","Baton Rouge":"#e6eda4",
            "Portland":"#cdf674","Lewiston":"#ed2d22","Bangor":"#5647c4",
            "Baltimore":"#4b5ac4","Frederick":"#09e140","Gaithersburg":"#ad185f",
            "Boston":"#bf2b65","Worcester":"#60d873","Springfield":"#338fd6",
            "Detroit":"#e400ca","Grand Rapids":"#841a12","Warren":"#d7f44c",
            "Minneapolis":"#e202c8","Saint Paul":"#5f59cd","Rochester":"#7e1ae5",
            "Jackson":"#f42fd8","Gulfport":"#26c6fa","Biloxi":"#8f5eae",
            "Kansas City":"#47fe10","Saint Louis":"#42e5e6","Springfield":"#fa0c8a",
            "Billings":"#6c69e2","Missoula":"#458c9e","Great Falls":"#c5ff1d",
            "Omaha":"#91eb3c","Lincoln":"#ffec92","Bellevue":"#81444e",
            "Las Vegas":"#a0c8b3","Reno":"#64f318","Henderson":"#9c0e4a",
            "Manchester":"#f3fb77","Nashua":"#24852b","Concord":"#7837f1",
            "Newark":"#f303b2","Jersey City":"#f193f2","Paterson":"#e38c0b",
            "Albuquerque":"#498adf","Las Cruces":"#999bb3","Rio Rancho":"#2645ce",
            "New York City":"#fd7254","Buffalo":"#019e88","Rochester":"#95f87a",
            "Charlotte":"#9acce6","Raleigh":"#35f19b","Greensboro":"#6b0c02",
            "Fargo":"#c8d0ec","Bismarck":"#8006b0","Grand Forks":"#a07ee3",
            "Columbus":"#3127ac","Cleveland":"#890324","Cincinnati":"#6f15a2",
            "Oklahoma City":"#2552b1","Tulsa":"#75c335","Norman":"#93a6a7",
            "Portland":"#75c335","Salem":"#89ea00","Eugene":"#d63745",
            "Philadelphia":"#acd3fa","Pittsburgh":"#7f3a70","Allentown":"#eded3a",
            "Providence":"#89db83","Warwick":"#6da9c8","Cranston":"#b109e1",
            "Columbia":"#5454ba","Charleston":"#93c0c1","North Charleston":"#6eb648",
            "Sioux Falls":"#68d05e","Rapid City":"#081f63","Aberdeen":"#5feb59",
            "Memphis":"#70cddb","Nashville":"#3abcad","Knoxville":"#efd518",
            "Houston":"#3e1e53","San Antonio":"#46992c","Dallas":"#ae73fe",
            "Salt Lake City":"#2e9e81","West Valley City":"#c6ee5d","Provo":"#eb886c",
            "Burlington":"#041e8b","South Burlington":"#b98ab2","Rutland":"#6feec1",
            "Virginia Beach":"#40f794","Norfolk":"#81bbfc","Chesapeake":"#0e860f",
            "Seattle":"#08d949","Spokane":"#314a4d","Tacoma":"#3fb6db",
            "Charleston":"#83043b","Huntington":"#6f2aff","Parkersburg":"#79e2c4",
            "Milwaukee":"#c5bd35","Madison":"#c54964","GreenBay":"#b03afd",
            "Cheyenne":"#1f25ee","Casper":"#cc7ad7","Laramie":"#263b55",
            defaultFill: '#d3d3d3'
        },
        data:{
            "AL":{basiclvl:0,pop:212113+201332+194899},
            "AK":{basiclvl:0,pop:300950+32167+32070},
            "AZ":{basiclvl:0,pop:1567924+526116+457587},
            "AR":{basiclvl:0,pop:197357+87650+78960},
            "CA":{basiclvl:0,pop:3884307+1355896+998537},
            "CO":{basiclvl:0,pop:566974+439886+345803},
            "CT":{basiclvl:0,pop:147216+130660+125017},
            "DE":{basiclvl:0,pop:71292+36047+278427},
            "FL":{basiclvl:0,pop:70145+419777+186411},
            "GA":{basiclvl:0,pop:447841+197872+202824},
            "HI":{basiclvl:0,pop:390738+43263+11975},
            "ID":{basiclvl:0,pop:214237+85930+58292},
            "IL":{basiclvl:0,pop:2718782+199963+150251},
            "IN":{basiclvl:0,pop:843393+253691+120310},
            "IA":{basiclvl:0,pop:207510+128119+102157},
            "KA":{basiclvl:0,pop:386552+181260+148483},
            "KY":{basiclvl:0,pop:609893+308428+58083},
            "LA":{basiclvl:0,pop:378715+200327+229426},
            "ME":{basiclvl:0,pop:609456+41592+32817},
            "MD":{basiclvl:0,pop:622104+67435+65690},
            "MA":{basiclvl:0,pop:645966+182544+153060},
            "MI":{basiclvl:0,pop:681090+192294+134141},
            "MN":{basiclvl:0,pop:400070+294873+110742},
            "MS":{basiclvl:0, pop:172638+71012+44578},
            "MO":{basiclvl:0, pop:467007+318416+164122},
            "MT":{basiclvl:0,pop:104170+69122+58505},
            "NE":{basiclvl:0, pop:434353+268738+53663},
            "NV":{basiclvl:0, pop:583736+225221+270811},
            "NH":{basiclvl:0, pop:110378+87137+42419},
            "NJ":{basiclvl:0, pop:278427+257342+145948},
            "NM":{basiclvl:0, pop:558000+101324+90818},
            "NY":{basiclvl:0, pop:8405837+258959+210358},
            "NC":{basiclvl:0, pop:792862+431746+279639},
            "ND":{basiclvl:0, pop:113658+67034+54932},
            "OH":{basiclvl:0, pop:822553+390113+297517},
            "OK":{basiclvl:0, pop:610613+398121+118197},
            "OR":{basiclvl:0, pop:609456+160614+159190},
            "PA":{basiclvl:0, pop:1553165+305841+118577},
            "RI":{basiclvl:0, pop:177994+82672+80387},
            "SC":{basiclvl:0, pop:133358+127999+104054},
            "SD":{basiclvl:0, pop:153888+67956+27333},
            "TN":{basiclvl:0, pop:653450+626681+183270},
            "TX":{basiclvl:0, pop:2195914+1409019+1257676},
            "UT":{basiclvl:0, pop:191180+132434+115919},
            "VT":{basiclvl:0, pop:42284+17904+16495},
            "VA":{basiclvl:0, pop:448479+246392+232977},
            "WA":{basiclvl:0, pop:652405+210721+203446},
            "WV":{basiclvl:0, pop:50821+49177+31186},
            "WI":{basiclvl:0, pop:599164+243344+104779},
            "WY":{basiclvl:0, pop:61537+57813+31681}
            }
    });
    basic.labels();
    
    BasicMap.basicRankings = function() {
        console.log('hello');
        var tuples = [];
        var data = basic.options.data;
        topFive = '<h3>Top 5 Basic States</h3><br/>';
        for (var state in data) {
            var basicLevel = Math.ceil((data[state].basiclvl * basicLevelScalingFactor) / data[state].pop);
            tuples.push([state, basicLevel]);
        };

        tuples.sort(function(a, b) {
            a = a[1];
            b = b[1];

            return a > b ? -1 : (a < b ? 1 : 0);
        });

        for (var i = 0; i < tuples.length; i++) {
            var key = tuples[i][0];
            var value = tuples[i][1];
            var rank = i + 1;
            topFive += (rank + '. ' + key + ' has a basic level of ' + value + '<br/>');
            if ( i >= 4) {
                break;
            }
        }

        $('.basic-rankings').html(topFive);
    };

    var Bar = Bar || {};

    Bar.makeChart = function(url) {
        if (d3.selectAll('rect') != null) {
            d3.selectAll('rect').data(dataKeyVal).exit().transition().duration(10).remove();
            d3.selectAll('g').data(dataKeyVal).exit().transition().duration(10).remove();
        }

        var margin = {top: 10, right: 20, bottom: 20, left: 75},
            width = 550 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        var x = d3.scale.ordinal()
            .domain(dataKeyVal.map(function(d) { return d.tag; } ))
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .domain([0, d3.max(dataKeyVal, function(d) { return d.counts })])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var chart = d3.select(".vertical-bar-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        if (total_posts === 0) {
            d3.select(".vertical-bar-chart").append("text")
                .style("text-anchor", "end")
                .attr("transform", "translate(30," + height / 2 + "), rotate(-90)")
                .text("Count");
        };

        var bar = chart.selectAll(".bar")
            .data(dataKeyVal)
          .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.tag) + ",0)"; })

        bar.append("rect")
            .attr("class", "bar")
            .attr("y", function(d) { return y(d.counts); })
            .attr("height", function(d) { return height - y(d.counts); })
            .attr("width", x.rangeBand())

        bar.append("text")
            .attr("x", x.rangeBand() / 2)
            .attr("y", function(d) { return y(d.counts) + 3; })
            .attr("dy", ".75em")
            .text(function(d) { return d.counts; })

        };


    var socket = io.connect('http://instabasic.herokuapp.com');
    var Insta = Insta || {};

    Insta.App = {

        init: function() {
            var url = "";
            d3.json(url, Bar.makeChart);
            BasicMap.basicRankings();
            this.mostRecent();
            this.getData();
        },

        getData: function() {
            var self = this;
            socket.on('show', function(data) {
                var url = data.show;
                $.ajax({
                    url: url,
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'jsonp'	
                }).done(function (data) {
                    self.renderBubbles(data.data);
                }); 
            });
        },

        renderBubbles: function(data) { 
            //console.log(data);
                       
            for (i = 0; i < data.length; i++) {
                var post = data[i];
            
                if (post.location != null) {
                    var lat = post.location.latitude;
                    var long = post.location.longitude;
                    
                    //console.log("latitude is: " + lat + " and the longitude is: " + long);

                    for (count = 0; count < minCityArr.cities.length; count++) {
                        var city = minCityArr.cities[count];
                        var lat2 = city.latitude;
                        var long2 = city.longitude;
                        var radius = city.size;
                        
                        if (BasicMap.checkDistance(lat, long, lat2, long2, "K") <= Math.sqrt(radius)) {
                            //console.log(city.name);
                            
                            var link = post.link;
                            if (links.indexOf(link) < 0) {
                                if (links.length === _logLimit) {
                                    links.shift();
                                }
                                links.push(link);
                            } else {
                                break;
                            }
                            console.log(city.state + ", " + city.name);
                            basicArr[city.state][city.name] += 1;
                            var state_cities = basicArr[city.state];
                            var basic_count = 0;
                            for (key in state_cities) {
                                basic_count += state_cities[key];
                            }
                            var new_data = {};
                            var shade = d3.rgb('#89cfff');
                            if (basic_count > 1) {
                                shade = shade.darker(Math.log(basic_count)/5.0);
                            }
                            new_data[city.state] = {basiclvl:basic_count,fillKey:'defaultFill'};
                            basic.updateChoropleth(new_data);
                            new_data[city.state] = shade.toString();
                            basic.updateChoropleth(new_data);
                            
                            BasicMap.addBubble({
                                name: city.name,
                                state: city.state,
                                latitude:lat2,
                                longitude:long2
                            });
                            
                            var post_tags = post.tags;
                            var is_selfie = false;
                            var is_nofilter = false;
                            var is_brunch = false;
                            var is_starbucks = false;

                            if (post_tags.indexOf("selfie") >= 0) {
                                is_selfie = true;
                                dataKeyVal[0].counts += 1;
                            }
                            if (post_tags.indexOf("nofilter") >= 0) {
                                is_nofilter = true;
                                dataKeyVal[1].counts += 1;
                            }
                            if (post_tags.indexOf("brunch") >= 0) {
                                is_brunch = true;
                                dataKeyVal[2].counts += 1;
                            }
                            if (post_tags.indexOf("starbucks") >= 0) {
                                is_starbucks = true;
                                dataKeyVal[3].counts += 1;
                            }
                            
                            var show_tags = "";
                            if (is_selfie) {
                                show_tags += "#selfie, ";
                            }
                            if (is_nofilter) {
                                show_tags += "#nofilter, ";
                            }
                            if (is_brunch) {
                                show_tags += "#brunch, ";
                            }
                            if (is_starbucks) {
                                show_tags += "#starbucks, ";
                            }
                            if (show_tags.length > 0) {
                                show_tags = show_tags.slice(0, -2);
                            }
                            
                            var post_out = 'Someone in <span class="loc">' + city.name + ', ' + city.state + '</span> posted <a href="' + post.link + '" target="_blank">' + link + '</a> <span class="hashtag">(' + show_tags + ')</span>';
                            update_post(post_out, _logLimit);
                            

                            total_posts += 1;
                            var new_time = new Date().getTime();
                            /*var new_entry = {};
                            new_entry['time'] = new_time;
                            new_entry['y'] = total_posts;
                            lineChartData[0].values.push(new_entry);
                            $('#lineChart').epoch({
                                type: 'time.bar',
                                data: lineChartData
                            });*/
                            
                            post_times.push(new_time);
                            if (total_posts > 2) {
                                var cur = post_times[post_times.length - 1];
                                var prev = post_times[post_times.length - 2];
                                post_intervals.push(cur - prev);
                            }
                            var s = 0;
                            for (var i = 0; i < post_intervals.length; i ++) {
                                s += post_intervals[i];
                            }

                            var rate_avg = Math.ceil(((s / post_intervals.length) / 1000) * 10);
                            post_times = post_times.slice(0, 500);
                            post_intervals = post_intervals.slice(0, 500);
                            var elapsedTime = (new Date().getTime() - _startTime) / 60000;
                            
                            BasicMap.basicRankings();

                            if (total_posts == 1) {
                                $('#post-count').html('You have seen <span>' + total_posts + ' post</span>.');
                            } else if (total_posts == 2) {
                                $('#post-count').html('You have seen a total of <span>' + total_posts + ' posts</span>.');
                            } else{
                                var selfieRate = Math.ceil(dataKeyVal[0].counts/elapsedTime);
                                var nofilterRate = Math.ceil(dataKeyVal[1].counts/elapsedTime);
                                var brunchRate = Math.ceil(dataKeyVal[2].counts/elapsedTime);
                                var starbucksRate = Math.ceil(dataKeyVal[3].counts/elapsedTime);
                                var text = 'You have seen a total of <span>' + total_posts + ' posts</span> at an average interval of <span>' + rate_avg + ' seconds</span>.<br>#selfie is tagged in the United States ' + selfieRate + ' times per minute.<br>#nofilter is tagged in the United States ' + nofilterRate + ' times per minute.<br>#brunch is tagged in the United States ' + brunchRate + ' times per minute.<br>#starbucks is tagged in the United States ' + starbucksRate + ' times per minute.'
                                $('#post-count').html(text);
                            }

                            var url = "";
                            d3.json(url, Bar.makeChart);
                            break;
                        }
                    }
                }
            }
        },

        mostRecent: function() {
            var self = this;
            socket.on('firstShow', function (data) {
                self.renderBubbles(data);
            });
        }
    };
    
    var basicArr =
    {
        "AL":{"Birmingham":0,"Montgomery":0,"Mobile":0},
        "AK":{"Anchorage":0,"Juneau":0,"Fairbanks":0},
        "AZ":{"Phoenix":0,"Tucson":0,"Mesa":0},
        "AR":{"Little Rock":0,"Fort Smith":0,"Fayetteville":0},
        "CA":{"Los Angeles":0,"San Diego":0,"San Jose":0},
        "CO":{"Denver":0,"Colorado Springs":0,"Aurora":0},
        "CT":{"Bridgeport":0,"New Haven":0,"Hartford":0},
        "DE":{"Wilmington":0,"Dover":0,"Newark":0},
        "FL":{"Jacksonville":0,"Miami":0,"Tallahassee":0},
        "GA":{"Atlanta":0,"Augusta":0,"Columbus":0},
        "HI":{"Honolulu":0,"Hilo":0,"Kailua":0},
        "ID":{"Boise":0,"Nampa":0,"Idaho Falls":0},
        "IL":{"Chicago":0,"Aurora":0,"Rockford":0},
        "IN":{"Indianapolis":0,"Fort Wayne":0,"Evansville":0},
        "IA":{"Des Moines":0,"Cedar Rapids":0,"Davenport":0},
        "KA":{"Wichita":0,"Overland Park":0,"Kansas City":0},
        "KY":{"Louisville":0,"Lexington":0,"Owensboro":0},
        "LA":{"New Orleans":0,"Shreveport":0,"Baton Rouge":0},
        "ME":{"Portland":0,"Lewiston":0,"Bangor":0},
        "MD":{"Baltimore":0,"Frederick":0,"Gaithersburg":0},
        "MA":{"Boston":0,"Worcester":0,"Springfield":0},
        "MI":{"Detroit":0,"Grand Rapids":0,"Warren":0},
        "MN":{"Minneapolis":0,"Saint Paul":0,"Rochester":0},
        "MS":{"Jackson":0,"Gulfport":0,"Biloxi":0},
        "MO":{"Kansas City":0,"Saint Louis":0,"Springfield":0},
        "MT":{"Billings":0,"Missoula":0,"Great Falls":0},
        "NE":{"Omaha":0,"Lincoln":0,"Bellevue":0},
        "NV":{"Las Vegas":0,"Reno":0,"Henderson":0},
        "NH":{"Manchester":0,"Nashua":0,"Concord":0},
        "NJ":{"Newark":0,"Jersey City":0,"Paterson":0},
        "NM":{"Albuquerque":0,"Las Cruces":0,"Rio Rancho":0},
        "NY":{"New York City":0,"Buffalo":0,"Rochester":0},
        "NC":{"Charlotte":0,"Raleigh":0,"Greensboro":0},
        "ND":{"Fargo":0,"Bismarck":0,"Grand Forks":0},
        "OH":{"Columbus":0,"Cleveland":0,"Cincinnati":0},
        "OK":{"Oklahoma City":0,"Tulsa":0,"Norman":0},
        "OR":{"Portland":0,"Salem":0,"Eugene":0},
        "PA":{"Philadelphia":0,"Pittsburgh":0,"Allentown":0},
        "RI":{"Providence":0,"Warwick":0,"Cranston":0},
        "SC":{"Columbia":0,"Charleston":0,"North Charleston":0},
        "SD":{"Sioux Falls":0,"Rapid City":0,"Aberdeen":0},
        "TN":{"Memphis":0,"Nashville":0,"Knoxville":0},
        "TX":{"Houston":0,"San Antonio":0,"Dallas":0},
        "UT":{"Salt Lake City":0,"West Valley City":0,"Provo":0},
        "VT":{"Burlington":0,"South Burlington":0,"Rutland":0},
        "VA":{"Virginia Beach":0,"Norfolk":0,"Chesapeake":0},
        "WA":{"Seattle":0,"Spokane":0,"Tacoma":0},
        "WV":{"Charleston":0,"Huntington":0,"Parkersburg":0},
        "WI":{"Milwaukee":0,"Madison":0,"Green Bay":0},
        "WY":{"Cheyenne":0,"Casper":0,"Laramie":0}
    }

    var cityPops = {
        "AL": 212113+201332+194899,
        "AK": 300950+32167+32070,
        "AZ": 1567924+526116+457587,
        "AR": 197357+87650+78960,
        "CA": 3884307+1355896+998537,
        "CO": 566974+439886+345803,
        "CT": 147216+130660+125017,
        "DE": 71292+36047+278427,
        "FL": 70145+419777+186411,
        "GA": 447841+197872+202824,
        "HI": 390738+43263+11975,
        "ID": 214237+85930+58292,
        "IL": 2718782+199963+150251,
        "IN": 843393+253691+120310,
        "IA": 207510+128119+102157,
        "KA": 386552+181260+148483,
        "KY": 609893+308428+58083,
        "LA": 378715+200327+229426,
        "ME": 609456+41592+32817,
        "MD": 622104+67435+65690,
        "MA": 645966+182544+153060,
        "MI": 681090+192294+134141,
        "MN": 400070+294873+110742,
        "MS":172638+71012+44578,
        "MO":467007+318416+164122,
        "MT": 104170+69122+58505,
        "NE":434353+268738+53663,
        "NV":583736+225221+270811,
        "NH":110378+87137+42419,
        "NJ":278427+257342+145948,
        "NM":558000+101324+90818,
        "NY":8405837+258959+210358,
        "NC":792862+431746+279639,
        "ND":113658+67034+54932,
        "OH":822553+390113+297517,
        "OK":610613+398121+118197,
        "OR":609456+160614+159190,
        "PA":1553165+305841+118577,
        "RI":177994+82672+80387,
        "SC":133358+127999+104054,
        "SD":153888+67956+27333,
        "TN":653450+626681+183270,
        "TX":2195914+1409019+1257676,
        "UT":191180+132434+115919,
        "VT":42284+17904+16495,
        "VA":448479+246392+232977,
        "WA":652405+210721+203446,
        "WV":50821+49177+31186,
        "WI":599164+243344+104779,
        "WY":61537+57813+31681
        };

    var minCityArr =
    {"cities":[
        {"name":"Birmingham","latitude":33.5274,"longitude":-86.7990,"size":378,"population":212113,"state":"AL"},
        {"name":"Montgomery","latitude":32.3463,"longitude":-86.2686,"size":413,"population":201332,"state":"AL"},
        {"name":"Mobile","latitude":30.6684,"longitude":-88.1002,"size":360,"population":194899,"state":"AL"},
        {"name":"Anchorage","latitude":61.2176,"longitude":-149.8953,"size":4415,"population":300950,"state":"AK"},
        {"name":"Juneau","latitude":58.3,"longitude":-134.4167,"size":7036,"population":32167,"state":"AK"},
        {"name":"Fairbanks","latitude":64.8436,"longitude":-147.7231,"size":82,"population":32070,"state":"AK"},
        {"name":"Phoenix","latitude":33.4500,"longitude":-112.0667,"size":1334,"population":1567924,"state":"AZ"},
        {"name":"Tucson","latitude":32.2217,"longitude":-110.9264,"size":588,"population":526116,"state":"AZ"},
        {"name":"Mesa","latitude":33.4150,"longitude":-111.8314,"size":324,"population":457587,"state":"AZ"},
        {"name":"Little Rock","latitude":34.7254,"longitude":-92.3586,"size":309,"population":197357,"state":"AR"},
        {"name":"Fort Smith","latitude":35.3686,"longitude":-94.3986,"size":161,"population":87650,"state":"AR"},
        {"name":"Fayetteville","latitude":36.0764,"longitude":-94.1608,"size":139,"population":78960,"state":"AR"},
        {"name":"Los Angeles","latitude":34.0194,"longitude":-118.4108,"size":1214,"population":3884307,"state":"CA"},
        {"name":"San Diego","latitude":32.8153,"longitude":-117.1350,"size":842,"population":1355896,"state":"CA"},
        {"name":"San Jose","latitude":37.2969,"longitude":-121.8193,"size":457,"population":998537,"state":"CA"},
        {"name":"Denver","latitude":39.7392,"longitude":-104.9847,"size":401,"population":566974,"state":"CO"},
        {"name":"Colorado Springs","latitude":38.8633,"longitude":-104.7919,"size":482,"population":439886,"state":"CO"},
        {"name":"Aurora","latitude":39.6958,"longitude":-104.8081,"size":399,"population":345803,"state":"CO"},
        {"name":"Bridgeport","latitude":41.1874,"longitude":-73.1957,"size":41,"population":147216,"state":"CT"},
        {"name":"New Haven","latitude":41.3108,"longitude":-72.9250,"size":48,"population":130660,"state":"CT"},
        {"name":"Hartford","latitude":41.7660,"longitude":-72.6833,"size":45,"population":125017,"state":"CT"}, 
        {"name":"Wilmington","latitude":39.7458,"longitude":-75.5467,"size":28,"population":71292,"state":"DE"},
        {"name":"Dover","latitude":39.1619,"longitude":-75.5267,"size":58,"population":36047,"state":"DE"},
        {"name":"Newark","latitude":39.6792,"longitude":-75.7581,"size":63,"population":278427,"state":"DE"},
        {"name":"Jacksonville","latitude":30.3369,"longitude":-81.6614,"size":115,"population":70145,"state":"FL"},
        {"name":"Miami","latitude":25.7877,"longitude":-80.2241,"size":92,"population":419777,"state":"FL"},
        {"name":"Tallahassee","latitude":30.4550,"longitude":-84.2533,"size":260,"population":186411,"state":"FL"},
        {"name":"Atlanta","latitude":33.7550,"longitude":-84.3900,"size":341,"population":447841,"state":"GA"},
        {"name":"Augusta","latitude":33.4667,"longitude":-81.9667,"size":782,"population":197872,"state":"GA"},
        {"name":"Columbus","latitude":32.4922,"longitude":-84.9403,"size":560,"population":202824,"state":"GA"},
        {"name":"Honolulu","latitude":21.3000,"longitude":-157.8167,"size":157,"population":390738,"state":"HI"},
        {"name":"Hilo","latitude":19.7056,"longitude":-155.0858,"size":141,"population":43263,"state":"HI"},
        {"name":"Kailua","latitude":19.6500,"longitude":-155.9942,"size":103,"population":11975,"state":"HI"},
        {"name":"Boise","latitude":43.6167,"longitude":-116.2000,"size":206,"population":214237,"state":"ID"},
        {"name":"Nampa","latitude":43.5747,"longitude":-116.5636,"size":81,"population":85930,"state":"ID"},
        {"name":"Idaho Falls","latitude":43.5000,"longitude":-112.0333,"size":58,"population":58292,"state":"ID"},
        {"name":"Chicago","latitude":41.8369,"longitude":-87.6847,"size":588,"population":2718782,"state":"IL"},
        {"name":"Aurora","latitude":41.7639,"longitude":-88.2900,"size":116,"population":199963,"state":"IL"},
        {"name":"Rockford","latitude":42.2594,"longitude":-89.0644,"size":158,"population":150251,"state":"IL"},
        {"name":"Indianapolis","latitude":39.7910,"longitude":-86.1480,"size":946,"population":843393,"state":"IN"},
        {"name":"Fort Wayne","latitude":41.0804,"longitude":-85.1392,"size":287,"population":253691,"state":"IN"},
        {"name":"Evansville","latitude":37.9772,"longitude":-87.5506,"size":114,"population":120310,"state":"IN"},
        {"name":"Des Moines","latitude":41.5908,"longitude":-93.6208,"size":81,"population":207510,"state":"IA"},
        {"name":"Cedar Rapids","latitude":41.9831,"longitude":-91.6686,"size":183,"population":128119,"state":"IA"},
        {"name":"Davenport","latitude":41.5431,"longitude":-90.5908,"size":163,"population":102157,"state":"IA"},
        {"name":"Wichita","latitude":37.6889,"longitude":-97.3361,"size":413,"population":386552,"state":"KS"},
        {"name":"Overland Park","latitude":38.9822,"longitude":-94.6708,"size":194,"population":181260,"state":"KS"},
        {"name":"Kansas City","latitude":39.1067,"longitude":-94.6764,"size":323,"population":148483,"state":"KS"},
        {"name":"Louisville","latitude":38.2500,"longitude":-85.7667,"size":997,"population":609893,"state":"KY"},
        {"name":"Lexington","latitude":38.0297,"longitude":-84.4947,"size":737,"population":308428,"state":"KY"},
        {"name":"Owensboro","latitude":37.7577,"longitude":-87.1184,"size":45,"population":58083,"state":"KY"},
        {"name":"New Orleans","latitude":29.9667,"longitude":-90.0500,"size":440,"population":378715,"state":"LA"},
        {"name":"Shreveport","latitude":32.5147,"longitude":-93.7472,"size":273,"population":200327,"state":"LA"},
        {"name":"Baton Rouge","latitude":30.4500,"longitude":-91.1400,"size":199,"population":229426,"state":"LA"},
        {"name":"Portland","latitude":43.6667,"longitude":-70.2667,"size":346,"population":609456,"state":"ME"},
        {"name":"Lewiston","latitude":44.0975,"longitude":-70.1925,"size":34,"population":41592,"state":"ME"},
        {"name":"Bangor","latitude":44.8036,"longitude":-68.7703,"size":89,"population":32817,"state":"ME"},
        {"name":"Baltimore","latitude":39.2833,"longitude":-76.6167,"size":210,"population":622104,"state":"MD"},
        {"name":"Frederick","latitude":39.4139,"longitude":-77.4111,"size":59,"population":67435,"state":"MD"},
        {"name":"Gaithersburg","latitude":39.1319,"longitude":-77.2264,"size":26,"population":65690,"state":"MD"},
        {"name":"Boston","latitude":42.3581,"longitude":-71.0636,"size":125,"population":645966,"state":"MA"},
        {"name":"Worcester","latitude":42.2667,"longitude":-71.8000,"size":97,"population":182544,"state":"MA"},
        {"name":"Springfield","latitude":42.1124,"longitude":-72.5475,"size":83,"population":153060,"state":"MA"},
        {"name":"Detroit","latitude":42.3314,"longitude":-83.0458,"size":359,"population":681090,"state":"MI"},
        {"name":"Grand Rapids","latitude":42.9612,"longitude":-85.6557,"size":115,"population":192294,"state":"MI"},
        {"name":"Warren","latitude":42.4919,"longitude":-83.0239,"size":89,"population":134141,"state":"MI"},
        {"name":"Minneapolis","latitude":44.9833,"longitude":-93.2667,"size":142,"population":400070,"state":"MN"},
        {"name":"Saint Paul","latitude":44.9442,"longitude":-93.0936,"size":135,"population":294873,"state":"MN"},
        {"name":"Rochester","latitude":44.0234,"longitude":-92.4630,"size":110742,"population":110742,"state":"MN"},
        {"name":"Jackson","latitude":32.2989,"longitude":-90.1847,"size":272,"population":172638,"state":"MS"},
        {"name":"Gulfport","latitude":30.4017,"longitude":-89.0761,"size":147,"population":71012,"state":"MS"},
        {"name":"Biloxi","latitude":30.4119,"longitude":-88.9278,"size":99,"population":44578,"state":"MS"},
        {"name":"Kansas City","latitude":39.0997,"longitude":-94.5783,"size":816,"population":467007,"state":"MO"},
        {"name":"Saint Louis","latitude":38.6272,"longitude":-90.1978,"size":160,"population":318416,"state":"MO"},
        {"name":"Springfield","latitude":37.1950,"longitude":-93.2861,"size":212,"population":164122,"state":"MO"},
        {"name":"Billings","latitude":45.7867,"longitude":-108.5372,"size":112,"population":104170,"state":"MT"},
        {"name":"Missoula","latitude":46.8625,"longitude":-114.0117,"size":71,"population":69122,"state":"MT"},
        {"name":"Great Falls","latitude":47.5036,"longitude":-111.2864,"size":56,"population":58505,"state":"MT"},
        {"name":"Omaha","latitude":41.2500,"longitude":-96.0000,"size":329,"population":434353,"state":"NE"},
        {"name":"Lincoln","latitude":40.8106,"longitude":-96.6803,"size":234,"population":268738,"state":"NE"},
        {"name":"Bellevue","latitude":41.1586,"longitude":-95.9342,"size":41,"population":53663,"state":"NE"},
        {"name":"Las Vegas","latitude":36.1215,"longitude":-115.1739,"size":352,"population":583736,"state":"NV"},
        {"name":"Reno","latitude":39.5272,"longitude":-119.8219,"size":267,"population":225221,"state":"NV"},
        {"name":"Henderson","latitude":36.0292,"longitude":-115.0253,"size":279,"population":270811,"state":"NV"},
        {"name":"Manchester","latitude":42.9908,"longitude":-71.4636,"size":86,"population":110378,"state":"NH"},
        {"name":"Nashua","latitude":42.7575,"longitude":-71.4644,"size":80,"population":87137,"state":"NH"},
        {"name":"Concord","latitude":43.2067,"longitude":-71.5381,"size":166,"population":42419,"state":"NH"},
        {"name":"Newark","latitude":40.7242,"longitude":-74.1726,"size":63,"population":278427,"state":"NJ"},
        {"name":"Jersey City","latitude":40.7140,"longitude":-74.0710,"size":38,"population":257342,"state":"NJ"},
        {"name":"Paterson","latitude":40.9147,"longitude":-74.1628,"size":22,"population":145948,"state":"NJ"},
        {"name":"Albuquerque","latitude":35.1107,"longitude":-106.6100,"size":486,"population":558000,"state":"NM"},
        {"name":"Las Cruces","latitude":32.3144,"longitude":-106.7789,"size":123,"population":101324,"state":"NM"},
        {"name":"Rio Rancho","latitude":35.2861,"longitude":-106.6706,"size":268,"population":90818,"state":"NM"},
        {"name":"New York City","latitude":40.7127,"longitude":-74.0059,"size":1214,"population":8405837,"state":"NY"},
        {"name":"Buffalo","latitude":42.9047,"longitude":-78.8494,"size":136,"population":258959,"state":"NY"},
        {"name":"Rochester","latitude":43.1656,"longitude":-77.6114,"size":96,"population":210358,"state":"NY"},
        {"name":"Charlotte","latitude":35.2269,"longitude":-80.8433,"size":771,"population":792862,"state":"NC"},
        {"name":"Raleigh","latitude":35.7806,"longitude":-78.6389,"size":369,"population":431746,"state":"NC"},
        {"name":"Greensboro","latitude":36.0800,"longitude":-79.8194,"size":271,"population":279639,"state":"NC"},
        {"name":"Fargo","latitude":46.8772,"longitude":-96.7894,"size":126,"population":113658,"state":"ND"},
        {"name":"Bismarck","latitude":46.8133,"longitude":-100.7790,"size":31,"population":67034,"state":"ND"},
        {"name":"Grand Forks","latitude":47.9253,"longitude":-97.0325,"size":52,"population":54932,"state":"ND"},
        {"name":"Columbus","latitude":39.9833,"longitude":-82.9833,"size":562,"population":822553,"state":"OH"},
        {"name":"Cleveland","latitude":41.4822,"longitude":-81.6697,"size":201,"population":390113,"state":"OH"},
        {"name":"Cincinnati","latitude":39.1000,"longitude":-84.5167,"size":202,"population":297517,"state":"OH"},
        {"name":"Oklahoma City","latitude":35.4822,"longitude":-97.5350,"size":1572,"population":610613,"state":"OK"},
        {"name":"Tulsa","latitude":36.1314,"longitude":-95.9372,"size":483,"population":398121,"state":"OK"},
        {"name":"Norman","latitude":35.2200,"longitude":-97.4400,"size":463,"population":118197,"state":"OK"},
        {"name":"Portland","latitude":45.5200,"longitude":-122.6819,"size":346,"population":609456,"state":"OR"},
        {"name":"Salem","latitude":44.9308,"longitude":-123.0289,"size":124,"population":160614,"state":"OR"},
        {"name":"Eugene","latitude":44.0519,"longitude":-123.0867,"size":113,"population":159190,"state":"OR"},
        {"name":"Philadelphia","latitude":39.9500,"longitude":-75.1667,"size":347,"population":1553165,"state":"PA"},
        {"name":"Pittsburgh","latitude":40.4417,"longitude":-80.0000,"size":144,"population":305841,"state":"PA"},
        {"name":"Allentown","latitude":40.6017,"longitude":-75.4772,"size":46,"population":118577,"state":"PA"},
        {"name":"Providence","latitude":41.8236,"longitude":-71.4222,"size":48,"population":177994,"state":"RI"},
        {"name":"Warwick","latitude":41.7167,"longitude":-71.4167,"size":92,"population":82672,"state":"RI"},
        {"name":"Cranston","latitude":41.7667,"longitude":-71.4500,"size":74,"population":80387,"state":"RI"},
        {"name":"Columbia","latitude":34.0008,"longitude":-81.0353,"size":342,"population":133358,"state":"SC"},
        {"name":"Charleston","latitude":32.7833,"longitude":-79.9333,"size":282,"population":127999,"state":"SC"},
        {"name":"North Charleston","latitude":32.8853,"longitude":-80.0169,"size":190,"population":104054,"state":"SC"},
        {"name":"Sioux Falls","latitude":43.5364,"longitude":-96.7317,"size":189,"population":153888,"state":"SD"},
        {"name":"Rapid City","latitude":44.0760,"longitude":-103.2280,"size":144,"population":67956,"state":"SD"},
        {"name":"Aberdeen","latitude":45.4647,"longitude":-98.4864,"size":40,"population":27333,"state":"SD"},
        {"name":"Memphis","latitude":35.1174,"longitude":-89.9711,"size":816,"population":653450,"state":"TN"},
        {"name":"Nashville","latitude":36.1667,"longitude":-86.7833,"size":1305,"population":626681,"state":"TN"},
        {"name":"Knoxville","latitude":35.9728,"longitude":-83.9422,"size":255,"population":183270,"state":"TN"},
        {"name":"Houston","latitude":29.7628,"longitude":-95.3831,"size":1553,"population":2195914,"state":"TX"},
        {"name":"San Antonio","latitude":29.4167,"longitude":-98.5000,"size":1194,"population":1409019,"state":"TX"},
        {"name":"Dallas","latitude":32.7758,"longitude":-96.7967,"size":882,"population":1257676,"state":"TX"},
        {"name":"Salt Lake City","latitude":40.7500,"longitude":-111.8833,"size":283,"population":191180,"state":"UT"},
        {"name":"West Valley City","latitude":40.6892,"longitude":-111.9939,"size":92,"population":132434,"state":"UT"},
        {"name":"Provo","latitude":40.2444,"longitude":-111.6608,"size":108,"population":115919,"state":"UT"},
        {"name":"Burlington","latitude":44.4758,"longitude":-73.2119,"size":27,"population":42284,"state":"VT"},
        {"name":"South Burlington","latitude":44.4519,"longitude":-73.1817,"size":43,"population":17904,"state":"VT"},
        {"name":"Rutland","latitude":43.6089,"longitude":-72.9797,"size":20,"population":16495,"state":"VT"},
        {"name":"Virginia Beach","latitude":36.8506,"longitude":-75.9779,"size":640,"population":448479,"state":"VA"},
        {"name":"Norfolk","latitude":36.9167,"longitude":-76.2000,"size":140,"population":246392,"state":"VA"},
        {"name":"Chesapeake","latitude":36.7674,"longitude":-76.2874,"size":880,"population":232977,"state":"VA"},
        {"name":"Seattle","latitude":47.6097,"longitude":-122.3331,"size":217,"population":652405,"state":"WA"},
        {"name":"Spokane","latitude":47.6589,"longitude":-117.4250,"size":153,"population":210721,"state":"WA"},
        {"name":"Tacoma","latitude":47.2414,"longitude":-122.4594,"size":129,"population":203446,"state":"WA"},
        {"name":"Charleston","latitude":38.3472,"longitude":-81.6333,"size":82,"population":50821,"state":"WV"},
        {"name":"Huntington","latitude":38.4208,"longitude":-82.4236,"size":42,"population":49177,"state":"WV"},
        {"name":"Parkersburg","latitude":39.2661,"longitude":-81.5422,"size":31,"population":31186,"state":"WV"},
        {"name":"Milwaukee","latitude":43.0500,"longitude":-87.9500,"size":249,"population":599164,"state":"WI"},
        {"name":"Madison","latitude":43.0667,"longitude":-89.4000,"size":199,"population":243344,"state":"WI"},
        {"name":"Green Bay","latitude":44.5133,"longitude":-88.0158,"size":118,"population":104779,"state":"WI"},
        {"name":"Cheyenne","latitude":41.1456,"longitude":-104.8019,"size":64,"population":61537,"state":"WY"},
        {"name":"Casper","latitude":42.8347,"longitude":-106.3250,"size":70,"population":57813,"state":"WY"},
        {"name":"Laramie","latitude":41.3167,"longitude":-105.5833,"size":46,"population":31681,"state":"WY"}
    ]};

    Insta.App.init();

})(this);
