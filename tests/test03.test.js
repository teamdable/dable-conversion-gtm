// Test Custom Event
const mockData = {
    serviceId: '001-000-001',
    eventType: 'custom',
    customEventName: 'event1',
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let eventTracked = '';

  mock('createArgumentsQueue', function(functionName, queueName) {
    return function() {};
  });

  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return true;
    if (name === '__dablena_script_loaded') return true;
    if (name === 'dablena') return function() {};
    return undefined;
  });

  mock('setInWindow', function() {
    return true;
  });

  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });

  mock('makeTableMap', function() {
    return {};
  });

  mock('callInWindow', function(path, eventArray) {
    eventTracked = eventArray[1];
    return undefined;
  });

  runCode(mockData);

  assertThat(eventTracked).isEqualTo('event1');