var https   = require('https'),
    pubsub  = require('event-pubsub'),
    net     = require('net'),
    io      = require('socket.io').listen(14114);

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 0);
io.set('transports', [
    'websocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

var pikespeak={};

var checkingWeather;

new pubsub(pikespeak);

pikespeak.on(
    'weather.update',
    function(){
        //console.log(checkingWeather)
        if(checkingWeather>0)
            return;
        
        io.sockets.emit(
            'weather.update',
            pikespeak
        );
    }
);

function getDelay(){
    return 300000; //10 min
}

function getWeather(){
    checkingWeather=locations.length;
    for(var i=0; i<locations.length;i++){
        (
            function(i){
                https.get(
                    'https://api.forecast.io/forecast/[your api key here]/'+locations[i].lat+','+locations[i].long,
                    function(result) {
                        var response = '';
                        result.setEncoding('utf8');
                        result.on(
                            'data', 
                            function(chunk) {
                                //add this chunk to the output to send
                                response+=chunk;
                            }
                        );
                        result.on(
                            'end', 
                            function(){
                                //console.log(i,locations[i])
                                pikespeak[i]=JSON.parse(response);
                                pikespeak[i].name=locations[i].name;
                                checkingWeather--;
                                pikespeak.trigger(
                                    'weather.update'
                                );
                            }
                        );
                    }
                ).on(
                    'error', 
                    function(e) {
                        console.error(e);
                    }
                );
            }
        )(i)
    }
    
    setTimeout(
        getWeather,
        getDelay()    
    );
}

var locations=[
  {
    "name":"Garage",
    "lat":38.920244,
    "long":-105.020022
  },
  {
    "name":"Dam",
    "lat":38.920091,
    "long":-105.023731
  },
  {
    "name":"Start Line",
    "lat":38.921623,
    "long":-105.037188
  },
  {
    "name":"Crystal Work Road",
    "lat":38.915394,
    "long":-105.044721
  },
  {
    "name":"8 Mile Pit Road",
    "lat":38.910778,
    "long":-105.051822
  },
  {
    "name":"Hansen's Corner",
    "lat":38.908668,
    "long":-105.053911
  },
  {
    "name":"Horseshoe",
    "lat":38.906408,
    "long":-105.056101
  },
  {
    "name":"9 Mile",
    "lat":38.904668,
    "long":-105.059028
  },
  {
    "name":"Engeineers Corner",
    "lat":38.904453,
    "long":-105.061213
  },
  {
    "name":"Halfway Picnic Ground",
    "lat":38.901496,
    "long":-105.064844
  },
  {
    "name":"Gaylor Straits",
    "lat":38.898228,
    "long":-105.065122
  },
  {
    "name":"Brown Bush Corner",
    "lat":38.895381,
    "long":-105.061932
  },
  {
    "name":"Big Spring",
    "lat":38.892841,
    "long":-105.066002
  },
  {
    "name":"Blue Sky",
    "lat":38.893645,
    "long":-105.067342
  },
  {
    "name":"11 Mile Water Station",
    "lat":38.892895,
    "long":-105.068673
  },
  {
    "name":"Heitman's Hill",
    "lat":38.890926,
    "long":-105.066696
  },
  {
    "name":"Grouse Hill",
    "lat":38.891268,
    "long":-105.068678
  },
  {
    "name":"Gilly's Corner",
    "lat":38.88724,
    "long":-105.073166
  },
  {
    "name":"Sump",
    "lat":38.881752,
    "long":-105.071553
  },
  {
    "name":"Tin Barn",
    "lat":38.882559,
    "long":-105.07289
  },
  {
    "name":"S/B Below Glen Cove",
    "lat":38.87901,
    "long":-105.072754
  },
  {
    "name":"Glen Cove",
    "lat":38.875471,
    "long":-105.073264
  },
  {
    "name":"George's Corner",
    "lat":38.872968,
    "long":-105.075725
  },
  {
    "name":"Cove Creek",
    "lat":38.872326,
    "long":-105.070781
  },
  {
    "name":"Ragged Edge",
    "lat":38.875241,
    "long":-105.065907
  },
  {
    "name":"Double Cut",
    "lat":38.869729,
    "long":-105.067653
  },
  {
    "name":"Start of 1st Leg",
    "lat":38.868989,
    "long":-105.067376
  },
  {
    "name":"Start of 2nd Leg",
    "lat":38.866817,
    "long":-105.062816
  },
  {
    "name":"Start of 3rd Leg",
    "lat":38.867695,
    "long":-105.066515
  },
  {
    "name":"Start of 4th Leg",
    "lat":38.866224,
    "long":-105.064113
  },
  {
    "name":"Devil's Playground",
    "lat":38.865151,
    "long":-105.069312
  },
  {
    "name":"Bottomless Pit",
    "lat":38.857111,
    "long":-105.063409
  },
  {
    "name":"Upper Gravel Pit",
    "lat":38.84918,
    "long":-105.056108
  },
  {
    "name":"Boulder Park",
    "lat":38.846074,
    "long":-105.051602
  },
  {
    "name":"Cog Cut",
    "lat":38.83713,
    "long":-105.043473
  },
  {
    "name":"Olympic",
    "lat":38.841553,
    "long":-105.046325
  },
  {
    "name":"Finish Line",
    "lat":38.839942,
    "long":-105.043992
  }
];

getWeather();

io.sockets.on(
    'connection', 
    function (socket){
        //console.log(12345678);
        socket.emit(
            'weather.init',
            {
                weather:pikespeak,
                locations:locations
            }
        );
    }
);