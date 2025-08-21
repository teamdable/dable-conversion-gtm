// Test Custom Event2
// 커스텀 이벤트2 테스트
const mockData = {
    serviceId: '001-000-001',
    businessType: 'custom',
    eventType: 'custom',
    customEventName: 'event2',
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let trackedEvents = [];
  
  mock('createArgumentsQueue', function(functionName, queueName) {
    return function(cmd, eventName, params) {
      if (cmd === 'track') {
        trackedEvents.push({event: eventName, params: params});
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
  
  assertThat(trackedEvents.length).isEqualTo(1);
  assertThat(trackedEvents[0].event).isEqualTo('event2');