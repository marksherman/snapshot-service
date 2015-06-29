goog.require('goog.net.XhrIo');


/**
 * Retrieve Json data using XhrIo's static send() method.
 *
 * @param {string} dataUrl The url to request.
 */
function getData(dataUrl) {
	var content = goog.json.serialize(
		{	"jsonrpc": "2.0",
			"method": "math.add",
			"params": [2, 3],
			"id": 97 }
		);
  log('Sending simple request for ['+ dataUrl + ']');
  goog.net.XhrIo.send(dataUrl, function(e) {
      var xhr = e.target;
      var obj = xhr.getResponseJson();
      log('Result: ' + obj.result);
      console.log(obj);
  },
  "POST", content);
}

/**
 * Basic logging to an element called "log".
 *
 * @param {string} msg Message to display on page
 */
function log(msg) {
  document.getElementById('log').appendChild(document.createTextNode(msg));
  document.getElementById('log').appendChild(document.createElement('br'));
}
