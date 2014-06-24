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
        https.get(
            'https://api.forecast.io/forecast/[yourAPIKey]/'+locations[i].latLon,
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
                        pikespeak[i]=JSON.parse(response);
                        pikespeak[i].name=locations[i].name;
                        locations.length--;
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
    
    setTimeout(
        getWeather,
        getDelay()    
    );
}

getWeather();

io.sockets.on(
    'connection', 
    function (socket){
        socket.emit(
            'weather.init',
            {
                weather:pikespeak,
                locations:locations
            }
        );
    }
);

var locations=[
  {
    "Name":"Garage",
    "Lat":38.920244,
    "Long":-105.020022
  },
  {
    "Name":"Dam",
    "Lat":38.920091,
    "Long":-105.023731
  },
  {
    "Name":"Start Line",
    "Lat":38.921623,
    "Long":-105.037188
  },
  {
    "Name":"Crystal Work Road",
    "Lat":38.915394,
    "Long":-105.044721
  },
  {
    "Name":"8 Mile Pit Road",
    "Lat":38.910778,
    "Long":-105.051822
  },
  {
    "Name":"Hansen's Corner",
    "Lat":38.908668,
    "Long":-105.053911
  },
  {
    "Name":"Horseshoe",
    "Lat":38.906408,
    "Long":-105.056101
  },
  {
    "Name":"9 Mile",
    "Lat":38.904668,
    "Long":-105.059028
  },
  {
    "Name":"Engeineers Corner",
    "Lat":38.904453,
    "Long":-105.061213
  },
  {
    "Name":"Halfway Picnic Ground",
    "Lat":38.901496,
    "Long":-105.064844
  },
  {
    "Name":"Gaylor Straits",
    "Lat":38.898228,
    "Long":-105.065122
  },
  {
    "Name":"Brown Bush Corner",
    "Lat":38.895381,
    "Long":-105.061932
  },
  {
    "Name":"Big Spring",
    "Lat":38.892841,
    "Long":-105.066002
  },
  {
    "Name":"Blue Sky",
    "Lat":38.893645,
    "Long":-105.067342
  },
  {
    "Name":"11 Mile Water Station",
    "Lat":38.892895,
    "Long":-105.068673
  },
  {
    "Name":"Heitman's Hill",
    "Lat":38.890926,
    "Long":-105.066696
  },
  {
    "Name":"Grouse Hill",
    "Lat":38.891268,
    "Long":-105.068678
  },
  {
    "Name":"Gilly's Corner",
    "Lat":38.88724,
    "Long":-105.073166
  },
  {
    "Name":"Sump",
    "Lat":38.881752,
    "Long":-105.071553
  },
  {
    "Name":"Tin Barn",
    "Lat":38.882559,
    "Long":-105.07289
  },
  {
    "Name":"S/B Below Glen Cove",
    "Lat":38.87901,
    "Long":-105.072754
  },
  {
    "Name":"Glen Cove",
    "Lat":38.875471,
    "Long":-105.073264
  },
  {
    "Name":"George's Corner",
    "Lat":38.872968,
    "Long":-105.075725
  },
  {
    "Name":"Cove Creek",
    "Lat":38.872326,
    "Long":-105.070781
  },
  {
    "Name":"Ragged Edge",
    "Lat":38.875241,
    "Long":-105.065907
  },
  {
    "Name":"Double Cut",
    "Lat":38.869729,
    "Long":-105.067653
  },
  {
    "Name":"Start of 1st Leg",
    "Lat":38.868989,
    "Long":-105.067376
  },
  {
    "Name":"Start of 2nd Leg",
    "Lat":38.866817,
    "Long":-105.062816
  },
  {
    "Name":"Start of 3rd Leg",
    "Lat":38.867695,
    "Long":-105.066515
  },
  {
    "Name":"Start of 4th Leg",
    "Lat":38.866224,
    "Long":-105.064113
  },
  {
    "Name":"Devil's Playground",
    "Lat":38.865151,
    "Long":-105.069312
  },
  {
    "Name":"Bottomless Pit",
    "Lat":38.857111,
    "Long":-105.063409
  },
  {
    "Name":"Upper Gravel Pit",
    "Lat":38.84918,
    "Long":-105.056108
  },
  {
    "Name":"Boulder Park",
    "Lat":38.846074,
    "Long":-105.051602
  },
  {
    "Name":"Cog Cut",
    "Lat":38.83713,
    "Long":-105.043473
  },
  {
    "Name":"Olympic",
    "Lat":38.841553,
    "Long":-105.046325
  },
  {
    "Name":"Finish Line",
    "Lat":38.839942,
    "Long":-105.043992
  }
];

var server = net.createServer();
server.listen(
    8002, 
    function() {}
);