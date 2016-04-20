"use strict";

let PEG = require("pegjs");

class PegjsPlugin {
  constructor(config) {
    this.config = config && config.plugins && config.plugins.pegjs;
  }
  compile(file) {
    let options = {
      cache: false,
      output: "source",
      optimize: "size"
    };
    let parser;
    try {
      parser = PEG.buildParser(file.data, options);
    } catch(err) {
      if(err instanceof PEG.parser.SyntaxError) {
        err.message = `${err.message} At ${err.location.start.line}:${err.location.start.column}.`;
      }
      return Promise.reject(err);
    }
    let module = `"use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = ${parser}`;
    return Promise.resolve({data: module});
  }
}

PegjsPlugin.prototype.brunchPlugin = true;
PegjsPlugin.prototype.type = "javascript";
PegjsPlugin.prototype.extension = "peg";

module.exports = PegjsPlugin;
