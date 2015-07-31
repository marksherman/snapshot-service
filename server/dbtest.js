var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usermap.sqlite3');
var codename = require('codename')();


// returns a promise that resolves true or false
function some_name_exists (colname, username) {
	return new Promise(
		function(resolve, reject) {
			// no need to serialize, db action is read-only
			db.get("SELECT EXISTS(SELECT 1 from usermap WHERE " + colname + " = ? LIMIT 1)", username,
			function(err, row){
				if( row["EXISTS(SELECT 1 from usermap WHERE " + colname + " = ? LIMIT 1)"] === 1 ){
					resolve(true);
				} else if( row["EXISTS(SELECT 1 from usermap WHERE " + colname + " = ? LIMIT 1)"] === 0 ){
					resolve(false);
				} else {
					reject("database did not return an expected value in some_name_exists");
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

// for testing purposes
function generate_fake_name(){
	var names = ["shark", "ActualNewName"];
	return names[Math.floor(Math.random() * names.length)];
}

// returns a promise, apparently (Mark doesn't completely know why)
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
			reject("Unexpected value from codename_exists in generate_unique_name.");
		}
	});
}

// Tests the generate_unique_name function
function test_gen(){
	console.log("testing random name generation....");
	return generate_unique_name().then(function(val){
		console.log("generated name: " + val);
		return val;
	}).catch(function(error){
		console.log("something went wrong", error);
	});
}


function get_code_name (username) {
	return new Promise(
		function(resolve, reject){
			// Check if username already exists
			return username_exists(username).then(function(value) {
				if (value === true){
					// username exists, just fetch the already-existing codename
					db.get("SELECT codename FROM usermap WHERE username = ?", username,
					function(err, row){
						return resolve(row.codename);
					});
				} else if (value === false){
					// username does not exist, insert a new codename
					return generate_unique_name().then(function(newname){
						console.log("about to insert username: " + username + " and codename: " + newname);
						db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", [username, newname]);
						return resolve(newname);
					});
				} else {
					reject("got unexpected value from username_exists in get_code_name");
				}
			});
		}
	);
}

// Tests the get_code_name function
function test_name(username){
	console.log("testing getting code name for " + username + "....");
	return get_code_name(username).then(function(val){
		console.log("got code name: " + val);
		return val;
	}).catch(function(error){
		console.log("test_name something went wrong", error);
	});
}

var dbinit = function(error) {
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS usermap (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, codename TEXT NOT NULL, date_added DATETIME)");
	});
};

var test_data = function () {
	db.serialize(function() {
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Brazentone", "shark");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Zazzle", "tank");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Calliope", "bottle");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "RuPaul", "era");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Tanya", "skiboot");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Tony.Shaloub", "doctor");
	});
};


console.log("**********************************");
test_name("Calliope").then(function(value){
	console.log("bad name value: " + value);
}).catch(function(error){
	console.log("test_name something went wrong", error);
});


//dbinit();
//test_data();

// comment out the db.close when running in the REPL!
db.close();
