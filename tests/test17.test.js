// Test Service ID Format Validation
// 서비스 ID 형식 검증 테스트
const mockData = {
    serviceId: '001-000-001',  // 올바른 형식
    businessType: 'lead',
    eventType: 'PageView',
    scriptAlreadyLoaded: false,
    debugMode: false
  };
  
  let initServiceId = '';
  
  mock('createQueue', function(name) {
    return function(cmd, id) {
      if (cmd === 'init') {
        initServiceId = id;
      }
    };
  });
  
  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return false;
    return undefined;
  });
  
  mock('setInWindow', function() {
    return true;
  });
  
  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });
  
  mock('makeTableMap', function() {
    return {};
  });
  
  runCode(mockData);
  
  // 올바른 형식의 서비스 ID가 init에 전달되었는지 확인
  assertThat(initServiceId).isEqualTo('001-000-001');