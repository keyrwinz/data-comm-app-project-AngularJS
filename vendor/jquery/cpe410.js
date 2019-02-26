var cpe410 = angular.module("cpe410", []);
cpe410.controller("cpe410Ctrl", function($scope){
  $scope.solve = function(){
    $scope.DataCode;
    $scope.AsciiCode = [];
    $scope.Hexadecimal = [];
    $scope.Binary = [];
    $scope.inputText = [];
    $scope.text = "";
    $scope.endianBin = [];
    $scope.endians = [];

    $scope.signals = [];
    $scope.signalsRZ = [];

    $scope.signalData = [];
    $scope.signalDataRZ = [];
    $scope.tempData = [];

    ///////////////////////////////////////
    //2B1Q SCHEME
    $scope.nextBits = [];
    $scope.signalsBBQ = [];
    $scope.signalDataBBQ = [];
    $scope.tempDataBBQ = [];
    $scope.tempArrayBBQsignal = [];
    $scope.tempArrayBBQvolts = [];
    //END 2B1Q INIT
    ///////////////////////////////////////
    var format = /[ !#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?1234567890]/;

    var dataLength = $scope.DataCode.length;

    function isASCII(str) {
	    return /^[\x00-\x7F]*$/.test(str);
	  }

    //text
    for(var i=0; i<dataLength; i++){
      $scope.inputText[i] = $scope.DataCode[i];
    }
 	///////////for testing if datacode contains special char
    // console.log($scope.DataCode);
    // for(var i=0; i<dataLength; i++){
    //   	if(format.test($scope.inputText[i])){
    //   		console.log("CONTAINS SPECIAL CHAR");
    // 	}else{
    // 		console.log("NO SPECIAL CHAR");
    // 	}
    // }
    ///////////////////////////////////////////
    if(isASCII($scope.inputText)){
    	//ascii equivalent
	    for(var i=0; i<dataLength; i++){
	      $scope.AsciiCode[i] = $scope.DataCode.charCodeAt(i);
	    }

	    //hex equivalent
	    for(var i=0; i<dataLength; i++){
	      $scope.Hexadecimal[i] = $scope.DataCode.charCodeAt(i).toString(16);
	    }

	    //binary equivalent
	    for(var i=0; i<dataLength; i++){
	    	if(format.test($scope.inputText[i])){
	    		// shows MSB for char that contains 00 MSB
	      		$scope.Binary[i] = "0" + "0" + $scope.DataCode.charCodeAt(i).toString(2);
	    	}else{
	    		// shows MSB for char that contains 0 MSB
	    		$scope.Binary[i] = 0 + $scope.DataCode.charCodeAt(i).toString(2);
	    	}
	    }

	    //LSB-LSb(Binary) equivalent
	    for(var i=0; i<$scope.Binary.length; i++){
	      for(var j=0; j<$scope.Binary[i].length; j++){
	        $scope.endianBin.push($scope.Binary[i].charAt(j));
	      }
	    }
	    //REVERSING to make it LSB-LSb
	    $scope.endianBin.reverse();
    }else{
    	$scope.text = "NOT ASCII";
    }

    //signal to be sent MANCHESTER
    for(var i=0; i<$scope.endianBin.length; i++){
      for(var j=0; j<$scope.endianBin[i].length; j++){
        $scope.signals.push($scope.endianBin[i].charAt(j)^0);
        $scope.signals.push($scope.endianBin[i].charAt(j)^1);
      }
    }
    //signal strength (volts) (manchester)
    for(var i=0; i<$scope.signals.length; i++){
      $scope.signalData.push($scope.signals[i]*5);
    }
    var length = $scope.signals.length;
    $scope.signalData.push($scope.signals[length-1]*5); //to fix last data sa graph (manchester)

    //signal to be sent POLAR RZ
    for(var i=0; i<$scope.endianBin.length; i++){
      for(var j=0; j<$scope.endianBin[i].length; j++){
        if($scope.endianBin[i]==0){
          $scope.signalDataRZ.push(-5);
          $scope.signalDataRZ.push(0);
        }else{
          $scope.signalDataRZ.push(5);
          $scope.signalDataRZ.push(0);
        }
      }
    }$scope.signalDataRZ.push(0);

    //data identifier
    $scope.tempData.push(0);
    for(var i=0; i<$scope.signals.length; i++){
        var temp1 = $scope.signals[i];
        var temp2 = $scope.signals[i+1];
        if(temp1==0 && temp2 ==1){
          $scope.tempData.push(0);
          $scope.tempData.push(" ");
        }else if(temp1==1 && temp2==0){
          $scope.tempData.push(1);
          $scope.tempData.push(" ");
        }
        i++;
    }

    //////////////////////////////////////////
    //CODE FOR 2B1Q
    for(var i=0; i<$scope.endianBin.length; i++){
    	$scope.nextBits.push($scope.endianBin[i] + $scope.endianBin[i+1]);
    	i++;
    }

    //BBQ Data
    $scope.tempArrayBBQsignal.push(1);
    for(var i=0; i<$scope.nextBits.length; i++){
    	$scope.tempArrayBBQsignal.push($scope.nextBits[i]);
    }

    $scope.tempArrayBBQvolts.push(1);
    for(var i=1; i<$scope.tempArrayBBQsignal.length; i++){
    	if($scope.tempArrayBBQvolts[i-1]>0){
    		if($scope.tempArrayBBQsignal[i]==00){
    			$scope.tempArrayBBQvolts.push(1);
    			$scope.signalDataBBQ.push(1);
    		}else if($scope.tempArrayBBQsignal[i]==01){
    			$scope.tempArrayBBQvolts.push(3);
    			$scope.signalDataBBQ.push(3);
    		}else if($scope.tempArrayBBQsignal[i]==10){
    			$scope.tempArrayBBQvolts.push(-1);
    			$scope.signalDataBBQ.push(-1);
    		}else if($scope.tempArrayBBQsignal[i]==11){
    			$scope.tempArrayBBQvolts.push(-3);
    			$scope.signalDataBBQ.push(-3);
    		}
    	}else if($scope.tempArrayBBQvolts[i-1]<0){
    		if($scope.tempArrayBBQsignal[i]==00){
    			$scope.tempArrayBBQvolts.push(-1);
    			$scope.signalDataBBQ.push(-1);
    		}else if($scope.tempArrayBBQsignal[i]==01){
    			$scope.tempArrayBBQvolts.push(-3);
    			$scope.signalDataBBQ.push(-3);
    		}else if($scope.tempArrayBBQsignal[i]==10){
    			$scope.tempArrayBBQvolts.push(1);
    			$scope.signalDataBBQ.push(1);
    		}else if($scope.tempArrayBBQsignal[i]==11){
    			$scope.tempArrayBBQvolts.push(3);
    			$scope.signalDataBBQ.push(3);
    		}
    	}
    }
    //tofix last signal strength
    var lengthbbqdata = $scope.signalDataBBQ.length;
    var lastbbqdata = $scope.signalDataBBQ[lengthbbqdata-1];
    $scope.signalDataBBQ.push(lastbbqdata);

    //Identifier
    $scope.tempDataBBQ.push(0);
    for(var i=0; i<$scope.nextBits.length; i++){
    	$scope.tempDataBBQ.push($scope.nextBits[i]);
    }
    /////////////////////////////////////


    ///// destroy previous graph for new values
    $scope.ManchesterCode.destroy();
    $scope.PolarRZ.destroy();
    $scope.BBQ.destroy();
    ////// UPDATES GRAPHS

     /////////////////MANCHESTERCODE GRAPH
    var data = $scope.signalData;
    var time = $scope.tempData;
    var canvas = document.getElementById('ManchesterCode');
    var data = {
        labels: time,
        datasets: [
            {
                data: data,
                fill: false,
              label: "Volts",
              steppedLine: true,
              lineTension: 0.1,
              backgroundColor: '#238cbc',
              borderWidth: 3,
              borderColor: 'blue',
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
              pointBorderColor: 'gray',
              pointBackgroundColor: 'gray',
              pointBorderWidth: 1,
              pointHoverRadius: 3,
              pointHoverBackgroundColor: 'blue',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 20,
              pointStyle: 'circle',
            },
        ]
    };

    $scope.ManchesterCode = Chart.Line(canvas,{
        data:data,
        options:{
          legend:{
            display: false,
          }
        }
    });

    /////////////////POLAR RZ GRAPH
    var data = $scope.signalDataRZ;
    var time = $scope.tempData;
    var canvas = document.getElementById('PolarRZ');
    var data = {
        labels: time,
        datasets: [
            {
                data: data,
                fill: false,
              label: "Volts",
              steppedLine: true,
              lineTension: 0.1,
              backgroundColor: '#238cbc',
              borderWidth: 3,
              borderColor: 'red',
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
              pointBorderColor: 'gray',
              pointBackgroundColor: 'gray',
              pointBorderWidth: 1,
              pointHoverRadius: 3,
              pointHoverBackgroundColor: 'red',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 20,
              pointStyle: 'circle',
            },
        ]
    };

    $scope.PolarRZ = Chart.Line(canvas,{
        data:data,
        options:{
          legend:{
            display: false,
          }
        }
    });

    /////////////////2B1Q GRAPH
    var data = $scope.signalDataBBQ;
    var time = $scope.tempDataBBQ;
    var canvas = document.getElementById('BBQ');
    var data = {
        labels: time,
        datasets: [
            {
                data: data,
                fill: false,
              label: "Volts",
              steppedLine: true,
              lineTension: 0.1,
              backgroundColor: '#238cbc',
              borderWidth: 3,
              borderColor: 'red',
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
              pointBorderColor: 'gray',
              pointBackgroundColor: 'gray',
              pointBorderWidth: 1,
              pointHoverRadius: 3,
              pointHoverBackgroundColor: 'red',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 20,
              pointStyle: 'circle',
            },
        ]
    };

    $scope.BBQ = Chart.Line(canvas,{
        data:data,
        options:{
          legend:{
            display: false,
          }
        }
    });

  }//end solve function

  /////////INITIALIZE GRAPH FOR MANCHESTER, POLAR RZ & 2B1Q
  var canvas = document.getElementById('ManchesterCode');
  var data = {
      labels: [],
      datasets: [
          {
            fill: true,
            label: "Volts",
            steppedLine: true,
            lineTension: 0.1,
            backgroundColor: 'gray',
            borderWidth: 3,
            borderColor: 'blue',
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointBorderColor: 'gray',
            pointBackgroundColor: 'gray',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'blue',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 20,
            pointStyle: 'circle',
          }
      ]
  };

  $scope.ManchesterCode = Chart.Line(canvas,{
    data:data,
    options:{
      legend:{
        display: false,
      }
    }
  });

  var canvas = document.getElementById('PolarRZ');
  var data = {
      labels: [],
      datasets: [
          {
            fill: true,
            label: "Volts",
            steppedLine: true,
            lineTension: 0.1,
            backgroundColor: 'gray',
            borderWidth: 3,
            borderColor: 'red',
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointBorderColor: 'gray',
            pointBackgroundColor: 'gray',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'red',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 20,
            pointStyle: 'circle',
          }
      ]
  };

  $scope.PolarRZ = Chart.Line(canvas,{
    data:data,
    options:{
      legend:{
        display: false,
      }
    }
  });

  var canvas = document.getElementById('BBQ');
  var data = {
      labels: [],
      datasets: [
          {
            fill: true,
            label: "Volts",
            steppedLine: true,
            lineTension: 0.1,
            backgroundColor: 'gray',
            borderWidth: 3,
            borderColor: 'red',
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointBorderColor: 'gray',
            pointBackgroundColor: 'gray',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'red',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 20,
            pointStyle: 'circle',
          }
      ]
  };

  $scope.BBQ = Chart.Line(canvas,{
    data:data,
    options:{
      legend:{
        display: false,
      }
    }
  });
});
