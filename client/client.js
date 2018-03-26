/*
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 */

var count = 101;

var testdata =
{
	"userName":"test@client.html",
	"projectName":"TestClientProject",
	"projectId":"9999999999999999",
	"screenName":"Screen1",
	"sessionId":"2be55c43-d3af-4806-8694-ccc6ec93414b",
	"yaversion":140,
	"languageVersion":19,
	"eventType":"pollYail",
	"blocks":"<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <block type=\"text_join\" id=\"1\" inline=\"false\" x=\"259\" y=\"346\">\n    <mutation items=\"2\"></mutation>\n    <value name=\"ADD0\">\n      <block type=\"color_red\" id=\"21\">\n        <field name=\"COLOR\">#ff0000</field>\n      </block>\n    </value>\n  </block>\n  <yacodeblocks ya-version=\"140\" language-version=\"19\"></yacodeblocks>\n</xml>",
	"form":"{\"YaVersion\":\"140\",\"Source\":\"Form\",\"Properties\":{\"$Name\":\"Screen1\",\"$Type\":\"Form\",\"$Version\":\"18\",\"AppName\":\"asdf\",\"Title\":\"Screen1\",\"Uuid\":\"0\"}}"
};

goog.require('goog.dom');


/*************** from snapshot.js ************************/
/**
 * @license
 * @fileoverview Visual blocks editor for App Inventor
 * Methods to snapshot project state to remote server
 *
 * @author msherman@cs.uml.edu (Mark Sherman)
 */

goog.require('goog.net.XhrIo');

//var dataUrl = 'http://snapshot.appinventor.mit.edu/v1.0';
var dataUrl = 'http://localhost:8000/v1.0';

var idno = 0;

// Listen for completed RPC calls
// "Complete" could be SUCCESS or ERROR
// "Complete" is called before success or error
var ss_xhrComplete = function()
{
	// Put in here anything to run regardless of success/error
  console.log('%%%% getData COMPLETE');

};

// Listen for Successfull RPC calls
// Success event is fired AFTER complete event.
var ss_xhrSuccess = function() {
  var obj = this.getResponseJson();
  ss_xhrPool.releaseObject(this);
	console.log('%%%% getData Success - result: ' + obj.result);
	//console.log(obj);
};

// Listen for Error-result RPC calls
// Error event is fired AFTER complete event.
var ss_xhrError = function() {
  ss_xhrPool.releaseObject(this);
	console.log('%%%% getData resulted in error.');
};

/**
 * Prepares and Sends some snapshot data to a server
 *
 * @param {string} dataUrl The url to request.
 * @param {string} snapshot data to send.
 */
blockly_send = function(projectData) {
	pd = _.assign({}, projectData,
		{
			"sendDate":new Date().toJSON()
		}
	);

	var data = [
		JSON.stringify(pd)
	];

	var content = goog.json.serialize(
	{	"jsonrpc": "2.0",
		"method": "file.log",
		"params": data,
		"id": ++idno }    // dirty, i know -Mark
	);

	console.log("\n\n------ Snapshot! ------ " + new Date() + "\n");
	//console.log("Data:\n");
	//console.log(content);

	goog.net.XhrIo.send(dataUrl, ss_xhrComplete, "POST", content);

};

/*******************************/

var send = function(){
	blockly_send(_.assign({}, testdata,
		{
			"eventType":"Testbutton click"
		}
	));
};

var jiggle = function(){
	var jiggledData = {};
	var jiggledBlocks =
		"<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <block type=\"text_join\" id=\"1\" inline=\"false\" x=\"" +
		_.random(0,999).toString() +
		"\" y=\"" +
		_.random(0,999).toString() +
		"\">\n    <mutation items=\"2\"></mutation>\n    <value name=\"ADD0\">\n      <block type=\"color_red\" id=\"21\">\n        <field name=\"COLOR\">#ff0000</field>\n      </block>\n    </value>\n  </block>\n  <yacodeblocks ya-version=\"140\" language-version=\"19\"></yacodeblocks>\n</xml>";

	jiggledData = _.assign({}, testdata,
		{
			"blocks":jiggledBlocks,
			"eventType":"Test jiggle button click"
		});

	blockly_send(jiggledData);
};

var hello = function(){

    var content = goog.json.serialize(
        {	"jsonrpc": "2.0",
            "method": "sayHello",
            "params": "{}",
            "id": ++idno }    // dirty, i know -Mark
    );

    console.log("\n\n------ Saying Hello to server ------ " + new Date() + "\n");

    goog.net.XhrIo.send(dataUrl, function(e) {
        const obj = e.target.getResponseJson();
        console.log('%%%% sayHello COMPLETE');
        if (obj["result"] === "Hello!") {
            console.log('%%%% sayHello Server said hello at ' + dataUrl);
        }
    }, "POST", content);
};

/*******************************/
/* Display in the page which server we're hooked up to */
window.onload = () => {
  document.getElementById("serverUrl").innerText = dataUrl;
};
