// Test First Visit with PageView Auto-fire
// 첫 방문 시 PageView 자동 실행 테스트
const mockData = {
    serviceId: '001-000-001',
    businessType: 'lead',
    eventType: 'Lead',  // PageView가 아닌 다른 이벤트
    scriptAlreadyLoaded: false,
    debugMode: true
  };
  
  let trackedEvents = [];
  let logMessages = [];
  
  mock('createQueue', function(name) {
    return function(cmd, eventName, params) {
      if (cmd === 'track') {
        trackedEvents.push({event: eventName, params: params});
      }
    };
  });
  
  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return false;  // 첫 방문
    return undefined;
  });
  
  mock('setInWindow', function() {
    return true;
  });
  
  mock('logToConsole', function(msg) {
    logMessages.push(msg);
  });
  
  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });
  
  mock('makeTableMap', function() {
    return {};
  });
  
  runCode(mockData);
  
  // PageView와 Lead 이벤트 모두 추적되어야 함
  assertThat(trackedEvents.length).isEqualTo(2);
  assertThat(trackedEvents[0].event).isEqualTo('PageView');
  assertThat(trackedEvents[1].event).isEqualTo('Lead');