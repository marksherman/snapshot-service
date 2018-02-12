var rewire = require('rewire');

describe('file.js', () => {
  const file = rewire('../rpc_modules/file.js');
  describe('strip screen name', () => {
    var strip_screen_name = file.__get__('strip_screen_name');
    const screen_name = '5725107787923456_Screen7';
    const screen_name_stripped = 'Screen7';
    it('should strip off a project ID number', () => {
      strip_screen_name(screen_name).should.equal(screen_name_stripped);
    });
    it('should not modify already-stripped names', () => {
      strip_screen_name(screen_name_stripped).should.equal(screen_name_stripped);
    });
  });
});
