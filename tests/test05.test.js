// Test Script Already Loaded Check
const mockData = {
    serviceId: '001-000-001',
    businessType: 'lead',
    eventType: 'ViewContent',
    scriptAlreadyLoaded: false,
    debugMode: false
  };
  
  let initCalled = false;
  let pageViewCalled = false;
  
  mock('createQueue', function() {
    return function(cmd, param) {
      if (cmd === 'init') initCalled = true;
      if (cmd === 'track' && param === 'PageView') pageViewCalled = true;
    };
  });
  
  mock('copyFromWindow', function(name) {
    // 이미 로드된 상태로 모킹
    if (name === '__dablena_gtm_loaded') return true;
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
  
  // 이미 로드된 경우 init과 PageView가 호출되지 않아야 함
  assertThat(initCalled).isFalse();
  assertThat(pageViewCalled).isFalse();