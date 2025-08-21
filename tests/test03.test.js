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
    return function(cmd, eventName) {
      if (cmd === 'track') {
        eventTracked = eventName;
      }
    };
  });
  
  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return true;
    return undefined;
  });
  
  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });
  
  mock('makeTableMap', function() {
    return {};
  });
  
  runCode(mockData);
  
  assertThat(eventTracked).isEqualTo('event1');