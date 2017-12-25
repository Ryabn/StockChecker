var aStockPriceUpdate = [];
var oAPIData;
var sDefaultSymbol = 'AAPL';
var sFunction = 'TIME_SERIES_INTRADAY';
var sSymbol = 'AIRI';
var sInterval = '5min';
var sAPIKey = 'W1CZZAKZXYEMAHMU';

object.onload=load;
object.addEventListener('load', load);
document.addEventListener('visibilitychange', visibilitychange);
function load() {
	if(sSymbol === ''){
		sSymbol = sDefaultSymbol;
	}
	retrieveStockData();
	generateGraph();
	displayPrice();
}
function visibilitychange() {
    if (document.visibilityState === 'hidden') {
    	
    }else{	
    	
    }
}
var retrieveStockData = (function(){
	var requestURL = 'https://www.alphavantage.co/query?function='+sFunction+'&symbol='+sSymbol+'&interval='+sInterval+'&apikey='+sAPIKey;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", requestURL, false);
	xhr.send(); 
	oAPIData = JSON.parse(xhr.responseText);
	var arr = $.map(oAPIData["Time Series (5min)"], function(el) { return el });
	arr = Object.keys(oAPIData["Time Series (5min)"]).map(function(k) { return oAPIData["Time Series (5min)"][k]});
	arr = Object.values(oAPIData["Time Series (5min)"]);
	aStockPriceUpdate = [];
	var iFivePoints = 9;
	while(iFivePoints >= 0){
		aStockPriceUpdate.push(parseFloat(arr[iFivePoints]["4. close"]));
		iFivePoints--;
	}
	return{
		JSONVariable: function(){
			return arr;
		}
	};
})();

function generateGraph(){
	google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Intervals','Price'],
        ['',aStockPriceUpdate[0] ],
        ['',aStockPriceUpdate[1] ],
        ['',aStockPriceUpdate[2] ],
        ['',aStockPriceUpdate[3] ],
        ['',aStockPriceUpdate[4] ],
        ['',aStockPriceUpdate[5] ],
        ['',aStockPriceUpdate[6] ],
        ['',aStockPriceUpdate[7] ],
        ['',aStockPriceUpdate[8] ],
        ['',aStockPriceUpdate[9] ]
      ]);
      var options = {
        curveType: 'straight',
        legend: 'none',
        backgroundColor: 'black'
      };
      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(data, options);
    }
}
function displayPrice(){
	var lastUpdatedTime = oAPIData["Meta Data"]["3. Last Refreshed"];
	document.getElementById("stockName").innerHTML = oAPIData["Meta Data"]["2. Symbol"];
	document.getElementById("stockDataTime").innerHTML = lastUpdatedTime;
	if(parseFloat(oAPIData["Time Series (5min)"][lastUpdatedTime]["4. close"]) < parseFloat(oAPIData["Time Series (5min)"][lastUpdatedTime]["1. open"])){
		document.getElementById("stockPrice").style.color = "red";
	}
	document.getElementById("stockPrice").innerHTML = "$" + oAPIData["Time Series (5min)"][lastUpdatedTime]["4. close"];
}