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
				}
			);
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

// returns a promise, apparently (Mark doesn't completely know why)
function generate_unique_name(){
	// get a new name
	var name = generate_random_name();
	// check to make sure it is unique
	return codename_exists(name).then(function(value){
		if( value === false ){
			// name not found. it's unique! return it.
			console.log("new name: " + name );
			return name;
		} else {
			// name was found, try again.
			console.log("name " + name + " not unique, trying again " + n);
			return generate_unique_name();
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
			var p = username_exists(username);
			p.then(
				function(value) {
					if (value === true){
						// username exists, just fetch the already-existing codename
						db.get("SELECT codename FROM usermap WHERE username = ?", username,
							function(err, row){
								resolve(row.codename);
							});
					} else if (value === false){
						//TODO
						// username does not exist, insert a new codename
						resolve("no name found!");
					}
				}
			);
		}
	);
// actual insertion:
//	db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", username, codename);
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
var namepgood = get_code_name("Calliope");
var namepbad = get_code_name("CalliopeZZZZ");
namepgood.then(function(value){
	console.log("good name value: " + value);
});
namepbad.then(function(value){
	console.log("bad name value: " + value);
});

//  db.each("SELECT id, username, codename FROM usermap", function(err, row) {
      //console.log(row.id + ": " + row.username + " : " + row.codename);
//  });
//dbinit();
//test_data();

//db.close();
