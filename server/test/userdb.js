var chai            = require('chai'),
    chaiAsPromised  = require('chai-as-promised');

chai.use(chaiAsPromised);

var should      = chai.should();

// for testing purposes, replaces generate_random_name
function generate_fake_name(){
	var names = ["shark", "ActualNewName"];
	return names[Math.floor(Math.random() * names.length)];
}

// Tests the get_code_name function
function test_name(username){
	return get_code_name(username).then(function(val){
		Log.debug("#UDB got code name: " + val);
		return val;
	}).catch(function(error){
		Log.debug("#UDB Something went wrong in test_name: ", error);
	});
}

// Tests the generate_unique_name function
function test_gen(){
	Log.debug("#UDB testing unique name generation....");
	return generate_unique_name().then(function(val){
		Log.debug("#UDB generated name: " + val);
		return val;
	}).catch(function(error){
		Log.error("#UDB Something went wrong in test_gen: ", error);
	});
}

// inserts test data into and exercises user database
function testusername (username){
  Log.debug("Querying username " + username);
  userdb.get_code_name(username).then(function(value){
    Log.debug("Username: " + username + " Codename: " + value);
  }).catch(function(err){
    Log.error("Error in userdb.get_code_name: ", err);
  });
}

function do_userdb_tests (){
  ["Calliope", "Clio", "Euterpe", "Erato", "Melpomene", "Polyhymnia", "Terpsichore", "Thalia", "Urania"].forEach(
    function(val, i, array){
      testusername(val);
    }
  );
}
