// Test Purchase Without Value
// 구매 이벤트 테스트 (금액 없음)
const mockData = {
    serviceId: '001-000-001',
    businessType: 'ecommerce',
    eventType: 'Purchase',
    addValue: false,
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let trackedEvents = [];
  
  mock('createQueue', function(name) {
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
  assertThat(trackedEvents[0].event).isEqualTo('Purchase');
  assertThat(trackedEvents[0].params).isUndefined();