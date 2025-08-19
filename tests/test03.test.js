// Test Custom Event
const mockData = {
    serviceId: '001-000-001',
    businessType: 'custom',
    eventType: 'custom',
    customEventName: 'video_complete',
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let eventTracked = '';
  
  mock('createQueue', function(name) {
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
  
  assertThat(eventTracked).isEqualTo('video_complete');