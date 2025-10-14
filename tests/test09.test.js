// CompleteRegistration Event Test
// 회원가입 완료 이벤트 테스트
const mockData = {
    serviceId: '001-000-001',
    eventType: 'CompleteRegistration',
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
    trackedEvents.push({event: eventArray[1], params: eventArray[2]});
    return undefined;
  });

  runCode(mockData);

  assertThat(trackedEvents.length).isEqualTo(1);
  assertThat(trackedEvents[0].event).isEqualTo('CompleteRegistration');