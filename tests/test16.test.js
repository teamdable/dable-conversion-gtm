// Test Multiple Custom Parameters
// 다중 커스텀 파라미터 테스트
const mockData = {
    serviceId: '001-000-001',
    eventType: 'Lead',
    addCustomParams: true,
    customParams: [
      {name: 'user_id', value: '12345'},
      {name: 'campaign', value: 'summer_2024'},
      {name: 'referrer', value: 'google'},
      {name: 'page_type', value: 'landing'}
    ],
    scriptAlreadyLoaded: true,
    debugMode: false
  };
  
  let trackedEvents = [];
  
  mock('createArgumentsQueue', function(functionName, queueName) {
    return function(cmd, eventName, params) {
      if (cmd === 'track') {
        trackedEvents.push({event: eventName, params: params});
      }
    };
  });
  
  mock('copyFromWindow', function(name) {
    if (name === '__dablena_gtm_loaded') return true;
    return undefined;
  });
  
  mock('makeTableMap', function(table, keyColumn, valueColumn) {
    const result = {};
    for (let i = 0; i < table.length; i++) {
      result[table[i][keyColumn]] = table[i][valueColumn];
    }
    return result;
  });
  
  mock('injectScript', function(url, onSuccess) {
    onSuccess();
  });
  
  runCode(mockData);
  
  assertThat(trackedEvents.length).isEqualTo(1);
  assertThat(trackedEvents[0].event).isEqualTo('Lead');
  assertThat(trackedEvents[0].params.user_id).isEqualTo('12345');
  assertThat(trackedEvents[0].params.campaign).isEqualTo('summer_2024');
  assertThat(trackedEvents[0].params.referrer).isEqualTo('google');
  assertThat(trackedEvents[0].params.page_type).isEqualTo('landing');