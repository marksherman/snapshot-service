var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usermap.sqlite3');
var codename = require('codename')();

function username_exists (username) {
	return new Promise(
		function(resolve, reject) {
			// no need to serialize, db action is read-only
			db.get("SELECT EXISTS(SELECT 1 from usermap WHERE username = ? LIMIT 1)", username,
				function(err, row){
					if( row["EXISTS(SELECT 1 from usermap WHERE username = ? LIMIT 1)"] == 1 ){
						resolve(true);
					} else {
						resolve(false);
					}
				}
			);
		}
	);
}

function generate_random_name(){
	var tempname = codename.generate(['random'],['adjectives','animals']);
	return tempname[0]+tempname[1];
}

function generate_unique_name(){
	var name = generate_random_name();




}

function get_code_name (username) {
	return new Promise(
		function(resolve, reject){
			// Check if username already exists
			var p = username_exists(username);
			p.then(
				function(value) {
					if (value == 1){
						// username exists, just fetch the already-existing codename
						db.get("SELECT codename FROM usermap WHERE username = ?", username,
							function(err, row){
								console.log("in promise got codename: " + row.codename);
								resolve(row.codename);
							});
					} else {
						//TODO
						// username does not exist, insert a new codename
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



console.log("about to run it all");
var namep = get_code_name("Calliope");
console.log("name promise returned " + namep);
namep.then(function(value){
	console.log("got name value: " + value);
});

//  db.each("SELECT id, username, codename FROM usermap", function(err, row) {
      //console.log(row.id + ": " + row.username + " : " + row.codename);
//  });
//dbinit();
//test_data();

db.close();
