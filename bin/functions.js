"use strict";
const printMessage = require("print-message");
const fs = require("fs");

Object.defineProperty(exports, "__esModule", {
  value: true
});

const getByPath = (object, path) => {
  const steps = path.split(".");
  if (steps.length === 1) {
    return object[steps];
  }
  if (steps.length > 1) {
    const newObj = object[steps[0]];
    steps.shift();
    return getByPath(newObj, steps.join("."));
  }
};

const setByPath = (object, path, value) => {
  const steps = path.split(".");
  if (steps.length === 1) {
    object[steps] = value;
    return object[steps];
  }
  if (steps.length > 1) {
    const newObj = object[steps[0]];
    steps.shift();
    return setByPath(newObj, steps.join("."), value);
  }
};

const updateVersion = (version, versionType) => {
  version = version + "";
  const versions = version.split(".").map(item => parseInt(item));
  if (versions.length === 1) {
    return parseInt(version) + 1;
  }

  if (versionType === "patch") {
    versions[2] = versions[2] + 1;
  }
  if (versionType === "minor") {
    versions[1] = versions[1] + 1;
    versions[2] = 0;
  }
  if (versionType === "major") {
    versions[0] = versions[0] + 1;
    versions[1] = 0;
    versions[2] = 0;
  }

  return versions.join(".");
};

const patchFile = (item, fileObject, referenceBuff, versionType) => {
  item.params.map(param => {
    if (param.reference) {
      referenceBuff.push({
        file: item.file,
        fileObject: fileObject,
        path: param.path,
        source: param.reference
      });
    } else {
      const version = getByPath(fileObject, param.path);
      const newVersion = setByPath(
        fileObject,
        param.path,
        updateVersion(version, versionType)
      );
      printMessage([
        "File: " + item.file,
        "Path: " + param.path,
        "New version: " + newVersion
      ]);

      fs.writeFileSync(
        item.file,
        JSON.stringify(fileObject, null, "  "),
        "utf8"
      );
    }
  });
};

const patchByReference = option => {
  const sourceFile = fs.readFileSync(option.source.file, "utf8");
  const sourceFileObject = JSON.parse(sourceFile);

  const version = getByPath(sourceFileObject, option.source.params.path);
  const newVersion = setByPath(option.fileObject, option.path, version);
  printMessage([
    "File: " + option.file,
    "Path: " + option.path,
    "New version: " + newVersion
  ]);

  fs.writeFileSync(
    option.file,
    JSON.stringify(option.fileObject, null, "  "),
    "utf8"
  );
};

exports.default = {
  patchFile,
  patchByReference
};

module.exports = exports["default"];
