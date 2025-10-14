// Timer Trigger Test - Script Already Loaded
// 스크립트가 이미 로드된 상태에서 타이머 트리거로 이벤트 전송
const mockData = {
  serviceId: '001-000-001',
  eventType: 'Lead',
  scriptAlreadyLoaded: false,
  debugMode: false
};

// Mock 함수들
let trackedEvents = [];
let callInWindowCalls = [];

mock('createArgumentsQueue', function(functionName, queueName) {
  return function(cmd, eventName, params) {
    // Should not be used when script is loaded
  };
});

mock('copyFromWindow', function(name) {
  // Simulate script already loaded
  if (name === '__dablena_script_loaded') return true;
  if (name === '__dablena_gtm_loaded') return true;
  if (name === 'dablena') return function() {}; // Mock function
  return undefined;
});

mock('setInWindow', function(name, value) {
  return true;
});

mock('injectScript', function(url, onSuccess) {
  // Should not be called when script is already loaded
  assertThat(false).isEqualTo(true); // Fail if called
});

mock('makeTableMap', function() {
  return {};
});

mock('callInWindow', function(path, arg1, arg2, arg3) {
  // Track callInWindow calls
  callInWindowCalls.push({
    path: path,
    args: [arg1, arg2, arg3]
  });

  // Simulate successful push
  if (path === 'dablena.q.push') {
    trackedEvents.push({
      event: arg1[1], // ['track', 'Lead'] -> 'Lead'
      params: arg1[2]
    });
  }

  return undefined;
});

// 템플릿 실행
runCode(mockData);

// callInWindow이 dablena.q.push로 호출되었는지 확인
assertThat(callInWindowCalls.length).isEqualTo(1);
assertThat(callInWindowCalls[0].path).isEqualTo('dablena.q.push');

// Lead 이벤트가 정확히 한 번 트래킹되었는지 확인
assertThat(trackedEvents.length).isEqualTo(1);
assertThat(trackedEvents[0].event).isEqualTo('Lead');
