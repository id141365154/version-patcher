#!/usr/bin / env node

const fs = require("fs");
const child_process = require("child_process");
const readline = require("readline");
const https = require("https");
const printMessage = require("print-message");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const getByPath = (object, path) => {
  const steps = path.split('.')

  if (steps.length === 1) {
    return object[steps]
  }
  if (steps.length > 1) {

    const newObj = object[steps[0]]
    steps.shift()
    return getByPath(newObj, steps.join('.'))
  }
}

const confName = "version-patcher.config.json";
let config = "";

try {
  config = fs.readFileSync(confName, "utf8");
} catch (e) {
  console.log("\x1b[31m", `Can\`t read config file: ${confName}`);
  throw e;
}

try {
  config = JSON.parse(config);
} catch (e) {
  console.log(`Can\`t parse config file: ${confName}`);
  throw e;
}

printMessage(["VERSION PATCHER"]);

config.patch.map(item => {
  const patchedFile = fs.readFileSync(item.file, 'utf8')

  let fileObject = JSON.parse(patchedFile)

  item.params.map(param => {
    let version = getByPath(fileObject, Object.keys(param)[0])
    console.log(Object.keys(param)[0] + " version", version);
  })


  //  console.log(fileObject)
})
