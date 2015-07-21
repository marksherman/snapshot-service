var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usermap.sqlite3');

var dbinit = function() {
	db.serialize(function() {
  		db.run("CREATE TABLE IF NOT EXISTS usermap (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, codename TEXT NOT NULL, date_added DATETIME)");
  	});
};

var get_code_name = function(username) {

// actual insertion: 
//	db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", username, codename);
};

var test_data = function () {
	db.serialize(function() {
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Brazentone", "shark");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Zazzle", "tank");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Calliope", "bottle");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "RuPaul", "era");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Tanya", "skiboot");
		db.run("INSERT INTO usermap (username,codename,date_added) VALUES (?,?,strftime('%s','now'))", "Tony.Shaloub", "doctor");
	})
}

db.serialize(function() {
	dbinit();
	test_data();
  // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();

  db.each("SELECT id, username, codename FROM usermap", function(err, row) {
      console.log(row.id + ": " + row.username + " : " + row.codename);
  });
});

db.close();
