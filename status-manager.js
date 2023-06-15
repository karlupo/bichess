// status-manager.js
const shared = require('./shared');

function updateSharedVariable(newValue) {
  shared.sharedVariable = newValue;
}

function getSharedVariable() {
  return shared.sharedVariable;
}

module.exports = {
  updateSharedVariable,
  getSharedVariable,
};
