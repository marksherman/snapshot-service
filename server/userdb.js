var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usermap.sqlite3');
var codename = require('codename')();

var exports = module.exports = {};

/*******************************************************************************
 * Provides:
 * .get_code_name(username) - gets the code name for the provided username.
 *           Returns a promise that resolves to a string
 * .close() - closes database (use when shutting down)
 ******************************************************************************/

// returns a promise that resolves true or false
function some_name_exists (colname, username) {
	return new Promise(
		function(resolve, reject) {
			// no need to serialize, db action is read-only
			db.get("SELECT EXISTS(SELECT 1 from usermap WHERE " + colname + " = ? LIMIT 1) AS found", username,
			function(err, row){
				if( err === null ){
					if( row.found === 1 ){
						return resolve(true);
					} else if( row.found === 0 ){
						return resolve(false);
					} else {
						return reject("database did not return an expected value in some_name_exists");
					}
				} else {
					return reject("Error from database in some_name_exists: " + err );
				}
			});
		}
	);
}

// returns a promise that resolves true or false
function username_exists (username) {
	return some_name_exists("username", username);
}

// returns a promise that resolves true or false
function codename_exists (username) {
	return some_name_exists("codename", username);
}

// returns a string, NOT a promise
function generate_random_name(){
	var tempname = codename.generate(['random'],['adjectives','animals']);
	return tempname[0]+tempname[1];
}

// for testing purposes, replaces generate_random_name
function generate_fake_name(){
	var names = ["shark", "ActualNewName"];
	return names[Math.floor(Math.random() * names.length)];
}

// returns a promise
function generate_unique_name(){
	// get a new name
	var name = generate_random_name();
	console.log("trying " + name);
	// check to make sure it is unique
	return codename_exists(name).then(function(value){
		console.log("exists value: " + value);
		if( value === false ){
			// name not found. it's unique! return it.
			console.log("new name: " + name );
			return name;
		} else if( value === true ) {
			// name was found, try again.
			console.log("name " + name + " not unique, trying again ");
			return generate_unique_name();
		} else {
			return reject("Unexpected value from codename_exists in generate_unique_name.");
		}
	});
}

// Tests the generate_unique_name function
function test_gen(){
	console.log("testing unique name generation....");
	return generate_unique_name().then(function(val){
		console.log("generated name: " + val);
		return val;
	}).catch(function(error){
		console.log("Something went wrong in test_gen: ", error);
	});
}

// To be called by the snapshot system anonymizer
var get_code_name = exports.get_code_name = function(username) {
	return new Promise(
		function(resolve, reject){
			// Check if username already exists
			return username_exists(username).then(function(value) {
				if (value === true){
					// username exists, just fetch the already-existing codename
					db.get("SELECT codename FROM usermap WHERE username = ?", username,
					function(err, row){
						if( err === null ){
							return resolve(row.codename);
						} else {
							return reject("Problem with datbase in get_code_name: " + err);
						}
					});
				} else if (value === false){
					// username does not exist, insert a new codename
					return generate_unique_name().then(function(newname){
						console.log("about to insert username: " + username + " and codename: " + newname);
						db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", [username, newname],
						function(err){
							if( err !== null ){
								return reject("Error from database while inserting new user: " + err );
							}
						});
						return resolve(newname);
					});
				} else {
					return reject("Got unexpected value from username_exists in get_code_name: " + value);
				}
			});
		}
	);
};

// Tests the get_code_name function
function test_name(username){
	console.log("testing getting code name for " + username + "....");
	return get_code_name(username).then(function(val){
		console.log("got code name: " + val);
		return val;
	}).catch(function(error){
		console.log("Something went wrong in test_name: ", error);
	});
}

var dbinit = function () {
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS usermap (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, codename TEXT NOT NULL, date_added DATETIME)", [],
		function(err){
			if( err !== null ){
				throw "Error initializing database in db.run: " + err ;
			}
		});
	});
};

exports.close = function () {
	db.close();
};

console.log("Initializing user database (userdb.js)");
try {
    dbinit();
} catch (e) {
    console.log("Error in userdb.init: ", e);
}
