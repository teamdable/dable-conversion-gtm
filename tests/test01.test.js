// Basic PageView Test
// 테스트 데이터
const mockData = {
  serviceId: '001-000-001',
  businessType: 'lead',
  eventType: 'PageView',
  scriptAlreadyLoaded: false,
  debugMode: false
};

// Mock 함수들
let trackedEvents = [];

mock('createArgumentsQueue', function(functionName, queueName) {
  assertThat(functionName).isEqualTo('dablena');
  assertThat(queueName).isEqualTo('dablena.q');
  return function(cmd, eventName, params) {
    if (cmd === 'track') {
      trackedEvents.push({event: eventName, params: params});
    }
  };
});

mock('copyFromWindow', function(name) {
  if (name === '__dablena_gtm_loaded') return false;
  return undefined;
});

mock('setInWindow', function(name, value) {
  if (name === '__dablena_gtm_loaded') {
    assertThat(value).isEqualTo(true);
  }
  return true;
});

mock('injectScript', function(url, onSuccess) {
  assertThat(url).isEqualTo('https://static.dable.io/dist/dablena.min.js');
  onSuccess();
});

mock('makeTableMap', function() {
  return {};
});

// 템플릿 실행
runCode(mockData);

// PageView 이벤트가 정확히 한 번 트래킹되었는지 확인
assertThat(trackedEvents.length).isEqualTo(1);
assertThat(trackedEvents[0].event).isEqualTo('PageView');