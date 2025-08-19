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
mock('createQueue', function(name) {
  assertThat(name).isEqualTo('dablena');
  return function() {};
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