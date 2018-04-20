/**
 * Author: Mark Sherman <shermanm@mit.edu>
 *
 * Copyright 2015-2017 Mark Sherman
 *
 * How to receive a screen recording video.
 *
 * License:
 *   GPL-3.0 : https://www.gnu.org/licenses/gpl-3.0.en.html
 */
const multer = require('multer');
const Log = require('./loglevel.js')();

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    let name = req.body.username + '_' + req.body.recordStartDate;
    name = name + '_' + new Date().toISOString() + '.webm';
    cb(null, name);
  }
});

const upload = multer({ storage: storage });

const gotPost = function(req, res, next) {
  Log.debug('POST file:');
  Log.debug(req.file);
  Log.debug('POST body:');
  Log.debug(req.body);
  res.send('Upload received at ' + new Date().toISOString());
};

module.exports = {
  post: [upload.single('screencast'), gotPost]
};
