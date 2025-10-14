// Test Timer Trigger - Second Event with Script Already Loaded
// 타이머 트리거 - 스크립트 이미 로드된 상태에서 두 번째 이벤트
const mockData = {
  serviceId: '001-000-001',
  eventType: 'Lead',
  scriptAlreadyLoaded: false,
  debugMode: false
};

let trackedEvents = [];
let injectScriptCalled = false;

mock('createArgumentsQueue', function(functionName, queueName) {
  assertThat(functionName).isEqualTo('dablena');
  assertThat(queueName).isEqualTo('dablena.q');
  // Return mock function, but should not be used for tracking
  return function() {};
});

mock('copyFromWindow', function(name) {
  // Simulate: GTM already initialized, script already loaded
  if (name === '__dablena_gtm_loaded') return true;
  if (name === '__dablena_script_loaded') return true;
  if (name === 'dablena') return function() {}; // Mock dablena function

  return undefined;
});

mock('setInWindow', function() {
  return true;
});

mock('injectScript', function(url, onSuccess) {
  // Should NOT be called when script already loaded
  injectScriptCalled = true;
  // If somehow called, call the success callback
  onSuccess();
});

mock('makeTableMap', function() {
  return {};
});

mock('callInWindow', function(path, eventArray) {
  // callInWindow('dablena.q.push', ['track', eventType])
  assertThat(path).isEqualTo('dablena.q.push');
  assertThat(eventArray[0]).isEqualTo('track');

  trackedEvents.push({
    event: eventArray[1],
    params: eventArray[2]
  });

  return undefined;
});

// 템플릿 실행
runCode(mockData);

// Verify injectScript was NOT called (script already loaded)
assertThat(injectScriptCalled).isFalse();
// Verify Lead event was tracked using callInWindow
assertThat(trackedEvents.length).isEqualTo(1);
assertThat(trackedEvents[0].event).isEqualTo('Lead');
