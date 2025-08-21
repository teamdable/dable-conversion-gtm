// Test Purchase Event with Value
const mockData = {
    serviceId: '001-000-001',
    eventType: 'Purchase',
    value: '15000',
    currency: 'KRW',
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let dablenaCallArgs = [];
  
  mock('createArgumentsQueue', function(functionName, queueName) {
    return function() {
      dablenaCallArgs.push(arguments);
    };
  });
  
  mock('copyFromWindow', function(name) {
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
  
  // 실행
  runCode(mockData);
  
  // 검증
  assertThat(dablenaCallArgs.length).isGreaterThan(0);
  // Purchase 이벤트와 파라미터 확인
  let foundPurchase = false;
  for (let i = 0; i < dablenaCallArgs.length; i++) {
    if (dablenaCallArgs[i][1] === 'Purchase') {
      foundPurchase = true;
      assertThat(dablenaCallArgs[i][2].value).isEqualTo('15000');
      assertThat(dablenaCallArgs[i][2].currency).isEqualTo('KRW');
    }
  }
  assertThat(foundPurchase).isTrue();