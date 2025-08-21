// Require necessary APIs
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');

// Get user inputs
const serviceId = data.serviceId;
const eventType = data.eventType === 'custom' ? data.customEventName : data.eventType;
const value = data.value || undefined;
const currency = data.currency || undefined;
const customParams = data.customParams ? makeTableMap(data.customParams, 'name', 'value') : {};
const scriptAlreadyLoaded = data.scriptAlreadyLoaded;
const debugMode = data.debugMode;

// Function to initialize dablena queue
function initializeDablena() {
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

  // Debug: Check if dablena function works properly
  if (debugMode) {
    log('Dable GTM: dablena function exists:', !!dablena);
    if (dablena) {
      log('Dable GTM: dablena type:', typeof dablena);
      log('Dable GTM: Ready to queue commands');
    }
  }

  return dablena;
}

// Function to prepare event parameters
function prepareEventParams() {
  let eventParams = {};

  // Handle Purchase event with value and currency
  if (eventType === 'Purchase') {
    if (!value) {
      log('Dable GTM Error: Purchase event requires a value parameter');
      data.gtmOnFailure();
      return eventParams;
    }
    if (!currency) {
      log('Dable GTM Error: Purchase event requires a currency parameter');
      data.gtmOnFailure();
      return eventParams;
    }
    eventParams.value = value;
    eventParams.currency = currency;
  }

  // Add custom parameters
  for (let key in customParams) {
    if (customParams.hasOwnProperty(key)) {
      eventParams[key] = customParams[key];
    }
  }

  return eventParams;
}

// Function to initialize tracking (run only once per page)
function initializeTracking(dablena) {
  const isLoaded = copyFromWindow('__dablena_gtm_loaded');
  
  if (!isLoaded && !scriptAlreadyLoaded) {
    if (debugMode) {
      log('Dable GTM: Initializing with Service ID:', serviceId);
    }
    
    // Mark as loaded
    setInWindow('__dablena_gtm_loaded', true, true);
    
    // Initialize Dable - this will be queued
    dablena('init', serviceId);
    
    if (debugMode) {
      log('Dable GTM: Commands queued successfully');
    }
  }
  
  return isLoaded;
}

// Function to track the current event
function trackEvent(dablena, eventParams) {
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

// Function to load the Dable script
function loadScript(scriptUrl) {
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
}

// Dable script URL
const scriptUrl = 'https://static.dable.io/dist/dablena.min.js';

// 1. Load the Dable script first (parallel loading)
loadScript(scriptUrl);

// 2. Initialize dablena queue
const dablena = initializeDablena();

// 3. Prepare event parameters
const eventParams = prepareEventParams();

// 4. Initialize tracking (first load setup)
initializeTracking(dablena);

// 5. Track the current event
trackEvent(dablena, eventParams);