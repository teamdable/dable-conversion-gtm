// GTM API imports
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');
const callInWindow = require('callInWindow');

// User configuration
const serviceId = data.serviceId;
const eventType = data.eventType === 'custom' ? data.customEventName : data.eventType;
const value = data.value || undefined;
const currency = data.currency || undefined;
const customParams = data.customParams ? makeTableMap(data.customParams, 'name', 'value') : {};
const scriptAlreadyLoaded = data.scriptAlreadyLoaded;
const debugMode = data.debugMode;

// Initialize dablena queue for init command
function initializeDablena() {
  // Always create queue for compatibility
  const dablena = createArgumentsQueue('dablena', 'dablena.q');

  if (debugMode) {
    log('Dable GTM: Initialized dablena queue');
  }

  return dablena;
}

// Prepare event parameters
function prepareEventParams() {
  let eventParams = {};

  // Validate Purchase event parameters
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

// Initialize tracking (run only once per page)
function initializeTracking(dablena) {
  const isLoaded = copyFromWindow('__dablena_gtm_loaded');

  if (!isLoaded && !scriptAlreadyLoaded) {
    setInWindow('__dablena_gtm_loaded', true, true);
    dablena('init', serviceId);

    if (debugMode) {
      log('Dable GTM: Initialized with Service ID:', serviceId);
    }
  }
}

// Track the current event
function trackEvent(eventParams) {
  const scriptLoaded = copyFromWindow('__dablena_script_loaded');
  const existingDablena = copyFromWindow('dablena');

  // Check if event has parameters
  let hasParams = false;
  for (let key in eventParams) {
    if (eventParams.hasOwnProperty(key)) {
      hasParams = true;
      break;
    }
  }

  // If script is already loaded, push directly to window.dablena.q
  if (scriptLoaded && existingDablena) {
    // Create event array: ['track', eventType, eventParams?]
    const eventArray = hasParams ? ['track', eventType, eventParams] : ['track', eventType];

    // Push to queue: window.dablena.q.push(eventArray)
    callInWindow('dablena.q.push', eventArray);

    if (debugMode) {
      log('Dable GTM: Event pushed via callInWindow:', eventType);
    }
  } else {
    // Script not loaded yet - use createArgumentsQueue
    const dablena = createArgumentsQueue('dablena', 'dablena.q');

    if (hasParams) {
      dablena('track', eventType, eventParams);
    } else {
      dablena('track', eventType);
    }

    if (debugMode) {
      log('Dable GTM: Event queued:', eventType);
    }
  }
}

// Load the Dable script
function loadScript(scriptUrl) {
  injectScript(
    scriptUrl,
    function() {
      // Set flag after script loads successfully
      setInWindow('__dablena_script_loaded', true, true);

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


// Main Execution
const scriptUrl = 'https://static.dable.io/dist/dablena.min.js';

// Load script on first execution
const scriptLoaded = copyFromWindow('__dablena_script_loaded');
if (!scriptLoaded && !scriptAlreadyLoaded) {
  if (debugMode) {
    log('Dable GTM: Loading script for the first time');
  }
  loadScript(scriptUrl);
} else if (debugMode) {
  log('Dable GTM: Script already loaded, skipping');
}

// Initialize dablena queue
const dablena = initializeDablena();

// Prepare event parameters
const eventParams = prepareEventParams();

// Initialize tracking (run once per page)
initializeTracking(dablena);

// Track the current event
trackEvent(eventParams);