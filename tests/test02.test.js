// Test Purchase Event with Value
const mockData = {
    serviceId: '001-000-001',
    eventType: 'Purchase',
    value: '15000',
    currency: 'KRW',
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let trackedEvents = [];

  mock('createArgumentsQueue', function(functionName, queueName) {
    return function() {};
  });

  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return true;
    if (name === '__dablena_script_loaded') return true;
    if (name === 'dablena') return function() {};
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

  mock('callInWindow', function(path, eventArray) {
    trackedEvents.push({
      event: eventArray[1],
      params: eventArray[2]
    });
    return undefined;
  });

  // 실행
  runCode(mockData);

  // 검증
  assertThat(trackedEvents.length).isEqualTo(1);
  assertThat(trackedEvents[0].event).isEqualTo('Purchase');
  assertThat(trackedEvents[0].params.value).isEqualTo('15000');
  assertThat(trackedEvents[0].params.currency).isEqualTo('KRW');