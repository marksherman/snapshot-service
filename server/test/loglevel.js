const chai = require('chai');

describe('loglevel.js', () => {
  describe('defaults all true', () => {
    const log = require('../loglevel.js')();
    it('should give console.error for error', () => {
      (log.error).should.equal(console.error);
    });
    it('should give console.log for log', () => {
      (log.log).should.equal(console.log);
    });
    it('should give console.log for debug', () => {
      (log.debug).should.equal(console.log);
    });
  });
  describe('set all to false', () => {
    const log = require('../loglevel.js')({
      log_error: false,
      log_utility: false,
      log_debug: false,
    });
    it('should give silent function for error', () => {
      (log.error).should.equal(log.silent);
    });
    it('should give silent function for log', () => {
      (log.log).should.equal(log.silent);
    });
    it('should give silent function for debug', () => {
      (log.debug).should.equal(log.silent);
    });
  });
});
