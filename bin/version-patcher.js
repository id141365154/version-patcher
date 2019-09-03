#!/usr/bin/env node

const fs = require("fs");
const printMessage = require("print-message");
const functions = require("./functions");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const confName = "version-patcher.config.json";
let config = "";
const versionType = process.argv[process.argv.length - 1];
const allowArguments = ["patch", "minor", "major"];

printMessage(["VERSION PATCHER"]);

try {
  config = fs.readFileSync(confName, "utf8");
} catch (e) {
  printMessage(
    [
      `Can\`t read config file: ${confName}`,
      "",
      "See https://github.com/id141365154/version-patcher#readme for reference"
    ],
    {
      borderColor: "red"
    }
  );
  throw e;
}

try {
  config = JSON.parse(config);
} catch (e) {
  printMessage([`Can\`t parse config file: ${confName}`], {
    borderColor: "red"
  });
  throw e;
}

if (allowArguments.indexOf(versionType) === -1) {
  printMessage(
    [
      `Version type not passed as argument`,
      "",
      "Allow types: " + allowArguments.join(" | ")
    ],
    {
      borderColor: "red"
    }
  );
  throw e;
}

config.patch.map(item => {
  const patchedFile = fs.readFileSync(item.file, "utf8");
  let fileObject = "";
  let referenceBuff = [];

  try {
    fileObject = JSON.parse(patchedFile);
  } catch (e) {
    printMessage(
      [
        "Can`t parse JSON in ",
        "",
        item.file,
        "",
        "Please note that other files may have been patched"
      ],
      {
        borderColor: "red"
      }
    );
    throw e;
  }

  functions.patchFile(item, fileObject, referenceBuff, versionType);
  referenceBuff.map(functions.patchByReference);
});

process.exit();
