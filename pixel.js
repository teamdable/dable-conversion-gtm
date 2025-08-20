// Require necessary APIs
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');

// Get user inputs
const serviceId = data.serviceId;
const businessType = data.businessType;
const eventType = data.eventType === 'custom' ? data.customEventName : data.eventType;
const value = data.value;
const currency = data.currency;
const customParams = data.customParams ? makeTableMap(data.customParams, 'name', 'value') : {};
const scriptAlreadyLoaded = data.scriptAlreadyLoaded;
const debugMode = data.debugMode;

// Create the dablena queue using GTM's createArgumentsQueue API
const existingDablena = copyFromWindow('dablena');
if (debugMode) {
  log('Dable GTM: existingDablena:', !!existingDablena);
}

let dablena;
if (!existingDablena) {
  // Create dablena function and queue array exactly like native implementation
  dablena = createArgumentsQueue('dablena', 'dablena.q');
  
  if (debugMode) {
    log('Dable GTM: Created dablena queue using createArgumentsQueue');
  }
} else {
  dablena = existingDablena;
}

// Prepare event parameters
let eventParams = {};

// Handle Purchase event with value and currency
if (eventType === 'Purchase' && value) {
  eventParams.value = value;
  if (currency) {
    eventParams.currency = currency;
  }
}

// Add custom parameters
for (let key in customParams) {
  if (customParams.hasOwnProperty(key)) {
    eventParams[key] = customParams[key];
  }
}

// Check if script is already loaded
const isLoaded = copyFromWindow('__dablena_gtm_loaded');

// Debug: Check if dablena function works properly
if (debugMode) {
  log('Dable GTM: dablena function exists:', !!dablena);
  if (dablena) {
    log('Dable GTM: dablena type:', typeof dablena);
    log('Dable GTM: Ready to queue commands');
  }
}

// Initialize Dable only once per page
if (!isLoaded && !scriptAlreadyLoaded) {
  if (debugMode) {
    log('Dable GTM: Initializing with Service ID:', serviceId);
  }
  
  // Mark as loaded
  setInWindow('__dablena_gtm_loaded', true, true);
  
  // Initialize Dable - this will be queued
  dablena('init', serviceId);
  
  // Always fire PageView on first load - this will be queued
  dablena('track', 'PageView');
  
  if (debugMode) {
    log('Dable GTM: Commands queued successfully');
  }
}

// Send the current event (if not PageView, as it's already sent on init)
if (eventType !== 'PageView' || isLoaded || scriptAlreadyLoaded) {
  // Check if eventParams has any properties
  let hasParams = false;
  for (let key in eventParams) {
    if (eventParams.hasOwnProperty(key)) {
      hasParams = true;
      break;
    }
  }
  
  if (hasParams) {
    dablena('track', eventType, eventParams);
    if (debugMode) {
      log('Dable GTM: Event queued with parameters:', eventType, eventParams);
    }
  } else {
    dablena('track', eventType);
    if (debugMode) {
      log('Dable GTM: Event queued:', eventType);
    }
  }
}

// Load the Dable script - this should process the queue automatically
const scriptUrl = 'https://static.dable.io/dist/dablena.min.js';

injectScript(scriptUrl, 
  function() {
    if (debugMode) {
      log('Dable GTM: Script loaded successfully');
    }
    data.gtmOnSuccess();
  }, 
  function() {
    if (debugMode) {
      log('Dable GTM: Script failed to load');
    }
    data.gtmOnFailure();
  },
  'dablena_script'
);