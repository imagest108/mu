var util = require('util');
var async = require('async');
var SensorTag = require('./index');
var request = require("request");

function lightOn(){



request(
      { method: 'PUT'
      , uri: 'http://128.122.151.141/api/newdeveloper/lights/1/state'
      , body: JSON.stringify({"on":true, hue:15628, bri:254})
      }
    , function (error, response, body) {
        if(response.statusCode == 201){
          console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
        }
      }
    )

}


function lightOff(){

  request(
      { method: 'PUT'
      , uri: 'http://128.122.151.141/api/newdeveloper/lights/1/state'
      , body: JSON.stringify({"on":false})
      }
    , function (error, response, body) {
        if(response.statusCode == 201){
          console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
        } else {
          console.log('error: '+ response.statusCode)
          console.log(body)
        }
      }
    )

}

function alert(){

  var indexNum = 1;
  setInterval(dimDown, 3000);
  function dimDown(){

    var brightness = 255-indexNum;
    request(
        { method: 'PUT'
        , uri: 'http://128.122.151.141/api/newdeveloper/lights/1/state'
        , body: JSON.stringify({bri:brightness,hue:46920})
        }
      , function (error, response, body) {
          if(response.statusCode == 201){
            console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
          } else {
            console.log('error: '+ response.statusCode)
            console.log(body)
          }
        }
      )

      if(indexNum > 200){
        indexNum = indexNum;
      }else{
      indexNum += 50;
      }

  }
}

SensorTag.discover(function(sensorTag) {

  //lightOn();

  var status = 0;
  var previousStatus = 0;

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });
  async.series([
      function(callback) {
        console.log('connect');
        sensorTag.connect(callback);
      },
      function(callback) {
        console.log('discoverServicesAndCharacteristics');
        sensorTag.discoverServicesAndCharacteristics(callback);
      },
      function(callback) {
        console.log('enableAccelerometer');
        sensorTag.enableAccelerometer(callback);
      },
      function(callback) {
        console.log('readAccelerometer');
        // sensorTag.readAccelerometer(function(x, y, z) {
        //   console.log('\tx = %d G', x.toFixed(1));
        //   console.log('\ty = %d G', y.toFixed(1));
        //   console.log('\tz = %d G', z.toFixed(1));
        //
        //   callback();
        // });
        sensorTag.on('accelerometerChange', function(x, y, z) {
          console.log('\tx = %d G', x.toFixed(1));
          console.log('\ty = %d G', y.toFixed(1));
          console.log('\tz = %d G', z.toFixed(1));
          console.log("------------------------------");



          if(y <= 0 && z > 0) {
            console.log("daytime");
            // lightOn();
            // alert();
            status = 1;
            if(previousStatus != status){
              lightOn();
              setTimeout(alert, 5000);
            }

          }else if(y >= -0.1 && z < 0){

            console.log("nighttime");
            //lightOff();
            status = 2;
            if(previousStatus != status){
                setTimeout(lightOff,5000);
            }

          }
          console.log("------------------------------");
          console.log("P: "+previousStatus+", S: "+status);
          previousStatus = status;

        });

        sensorTag.notifyAccelerometer(function() {

        });
      }
    ]);
});
