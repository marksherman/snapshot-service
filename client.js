goog.require('goog.net.XhrIo');

var count = 101;
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
			"id": count }
		);
  console.log('Sending simple request for [' + dataUrl + ']' + ' # ' + count);

  goog.net.XhrIo.send(dataUrl, function (e) {
      var xhr = e.target,
					obj = xhr.getResponseJson();
      console.log('Result: ' + obj.result);
			console.log(obj);
  },
  "POST", content);
}
