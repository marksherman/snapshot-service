var chai            = require('chai'),
    chaiAsPromised  = require('chai-as-promised'),
    should          = chai.should(),
    expect          = chai.expect;

var _ = require('lodash');

var git = require('../savegit.js')();

chai.use(chaiAsPromised);

var should      = chai.should();
var fs = require('fs');

var random = function() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
};

// gitDir is git root
// screenDir is folder withing gitDir

var gitDir = 'testGitDir_' + random();
var screenDir1 = gitDir + '/screen' + random();
var userName = "testUser";
var r1 = random();
var blocksFile1 = 'blocks' + r1;
var formFile1 = 'form' + r1;
var fileContents = "<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <block type=\"text_join\" id=\"1\" inline=\"false\" x=\"259\" y=\"346\">\n    <mutation items=\"2\"></mutation>\n    <value name=\"ADD0\">\n      <block type=\"color_red\" id=\"21\">\n        <field name=\"COLOR\">#ff0000</field>\n      </block>\n    </value>\n  </block>\n  <yacodeblocks ya-version=\"140\" language-version=\"19\"></yacodeblocks>\n</xml>";
var detail_empty = "";
var detail_something = "\nsome detail\n";
var notes_empty = "";
var notes_something = "\nsome notes\n";

describe('savegit.js', function(){

  describe('Module functions must return promise-appropriate functions', function(){
    var tests =
      [
        {name: "mkScreenDir", f: git.mkScreenDir(screenDir1)},
        {name: "writeFile", f: git.writeFile(screenDir1, blocksFile1, fileContents)},
        {name: "createRepo", f: git.createRepo(gitDir)},
        {name: "setUser", f: git.setUser(gitDir, userName)},
        {name: "setFakeEmail", f: git.setFakeEmail(gitDir)},
        {name: "addFiles", f: git.addFiles(screenDir1, blocksFile1, formFile1)},
        {name: "commit", f: git.commit(gitDir, detail_empty)},
        {name: "afterCommitSucceed", f: git.afterCommitSucceed(notes_empty)},
        {name: "afterCommitFail", f: git.afterCommitFail(gitDir, screenDir1, blocksFile1, formFile1, detail_empty, notes_empty)}
      ];
    tests.forEach(function(test){
      it(test.name + ' should return a function', function(){
        expect(_.isFunction(test.f)).to.equal(true);
      });
    });
  });

  describe('mkScreenDir', function(){
    f = git.mkScreenDir(screenDir1);
    describe('returns function', function(){
      it('should return a function', function(){
        expect(_.isFunction(f)).to.equal(true);
        //_.isFunction(f).should.equal(true);
      });
    });
  });

});

/****** currently unused, pasted in ******/

// Utility: check return value of System.System
var onReject = (result) => {
  Log.error("REJECTION/ERROR return code: " + result.exitCode);
  Log.error("> std out: " + result.stdout);
  Log.error("> std err: " + result.stderr);
  return Promise.reject(result);
};
