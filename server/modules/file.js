module.exports = {
  log: function (data) {
    console.log("\n\n--------------------------------------\n");
    console.log("Snapshot recieved at " + new Date());
    console.log(sanitizeFilename(data));

    return "0";
  }
};

/**
     * Sanitize a file name by replacing ".." with "DOTDOT", backslash with
     * slash, multiple adjacent slashes with a single slash, and any remaining
     * slash with "SLASH".
     *
     * @author Derrell Lipman
     * @param name {String}
     *   The file name to be sanitized
     *
     * @return {String}
     *   The sanitized file name
     */
     sanitizeFilename = function(name)
    {
      // Remove dangerous ..
      name = name.replace(/\.\./g, "DOTDOT");

      // Replace backslashes with forward slashes
      name = name.replace(/\\/g, "/");

      // Strip any double slashes; replace with single slashes
      name = name.replace(/\/+/g, "/");

      // Replace dangerous slashes
      name = name.replace(/\//g, "SLASH");

      return name;
    }
