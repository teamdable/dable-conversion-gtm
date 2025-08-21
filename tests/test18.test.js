// Test First Visit with Non-PageView Event
// 첫 방문 시 PageView가 아닌 이벤트 테스트
const mockData = {
    serviceId: '001-000-001',
    eventType: 'Lead',  // PageView가 아닌 다른 이벤트
    scriptAlreadyLoaded: false,
    debugMode: true
  };
  
  let trackedEvents = [];
  let logMessages = [];
  
  mock('createArgumentsQueue', function(functionName, queueName) {
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
  
  // PageView 자동 실행이 없으므로 Lead 이벤트만 추적되어야 함
  assertThat(trackedEvents.length).isEqualTo(1);
  assertThat(trackedEvents[0].event).isEqualTo('Lead');