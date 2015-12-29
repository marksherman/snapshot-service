var chai            = require('chai'),
    chaiAsPromised  = require('chai-as-promised');

chai.use(chaiAsPromised);

var should      = chai.should();
var fs = require('fs');

var random = function() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
};

describe('userdb.js',function(){
  before('create a path', function(){
    test_db_path = 'testdb' + random() + '.sqlite3';
  });
  after('close db', function(){
    db.close();
    fs.unlinkSync(test_db_path);
  });

  describe("Initialize database and check file path", function(){

    it('should initialize without throwing exception and return path name', function(){
      db = require('../userdb.js')(
        {
          db_path: test_db_path,
          log_debug: false,
          log_utility: false
        }
      );
      return db.db_path.should.equal(test_db_path);
    });
  });

  describe('get_code_name', function(){

    describe('query without error', function(){

      it('should run some name queries', function(){
        var name1 = random();
        var name2 = random();
        while(name1 === name2){ name2 = random(); }

        var code1 = db.get_code_name(name1);
        var code2 = db.get_code_name(name2);

        return Promise.all([
          code1.should.eventually.be.a('string'),
          code2.should.eventually.be.a('string')
        ]);
      });

    });

    describe('consistency of result', function() {
      it('should give codename back consistently', function(){
        var name = random();
        return db.get_code_name(name).then(function(value) {
          return db.get_code_name(name).should.become(value);
        });

      });
    });

    describe('different inputs must be different', function() {
      it('should get not-equal results for not-equal name inputs', function(){
        var name1 = random();
        var name2 = random();
        while(name1 === name2){ name2 = random(); }

        return db.get_code_name(name1).then(function(value1){
          return db.get_code_name(name2).then(function(value2){
            return value2.should.not.equal(value1);
          });
        });

      });
    });

  });


}); /* describe userdb.js */
