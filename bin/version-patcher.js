#!/usr/bin/env node

const fs = require("fs");
const printMessage = require("print-message");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

var getByPath = (object, path) => {
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

var setByPath = (object, path, value) => {
  const steps = path.split('.')
  if (steps.length === 1) {
    object[steps] = value
    return object[steps]
  }
  if (steps.length > 1) {
    const newObj = object[steps[0]]
    steps.shift()
    return setByPath(newObj, steps.join('.'), value)
  }
}

const updateVersion = (version, versionType) => {
  version = version + ''
  const versions = version.split('.').map(item => parseInt(item))
  if (versions.length === 1) {
    return parseInt(version) + 1
  }

  if (versionType === 'patch') {
    versions[2] = versions[2] + 1
  }
  if (versionType === 'minor') {
    versions[1] = versions[1] + 1
    versions[2] = 0
  }
  if (versionType === 'major') {
    versions[0] = versions[0] + 1
    versions[1] = 0
    versions[2] = 0
  }

  return versions.join('.')
}

const confName = "version-patcher.config.json";
let config = "";
const versionType = process.argv[process.argv.length - 1]

printMessage(["VERSION PATCHER"]);

try {
  config = fs.readFileSync(confName, "utf8");
} catch (e) {
  printMessage([`Can\`t read config file: ${confName}`, '', 'See https://github.com/id141365154/version-patcher#readme for reference']);
  throw e;
}

try {
  config = JSON.parse(config);
} catch (e) {
  printMessage([`Can\`t parse config file: ${confName}`]);
  throw e;
}


config.patch.map(item => {
  const patchedFile = fs.readFileSync(item.file, 'utf8')

  let fileObject = ''

  try {
    fileObject = JSON.parse(patchedFile)
  } catch (e) {
    printMessage(['Can`t parse JSON in ', '', item.file, '', 'Please note that other files may have been patched'], {
      borderColor: "red"
    })

    throw e;
  }

  item.params.map(param => {
    const version = getByPath(fileObject, Object.keys(param)[0])
    const newVersion = setByPath(fileObject, Object.keys(param)[0], updateVersion(version, versionType))
    printMessage(['File: ' + item.file, 'Path: ' + Object.keys(param)[0], 'New version: ' + newVersion]);
  })
  fs.writeFileSync(item.file, JSON.stringify(fileObject, null, '  '), 'utf8');
})

process.exit()
