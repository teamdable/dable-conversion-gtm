// Test Debug Mode
const mockData = {
    serviceId: '001-000-001',
    businessType: 'lead',
    eventType: 'Lead',
    scriptAlreadyLoaded: false,
    debugMode: true  // 디버그 모드 활성화
  };
  
  let logMessages = [];
  
  mock('createArgumentsQueue', function(functionName, queueName) {
    return function() {};
  });
  
  mock('copyFromWindow', function() {
    return false;
  });
  
  mock('setInWindow', function() {
    return true;
  });
  
  mock('logToConsole', function(message) {
    logMessages.push(message);
  });
  
  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });
  
  mock('makeTableMap', function() {
    return {};
  });
  
  runCode(mockData);
  
  // 디버그 로그가 출력되었는지 확인
  assertThat(logMessages.length).isGreaterThan(0);