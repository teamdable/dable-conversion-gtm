// Test Purchase Event with DPA Items
const mockData = {
  serviceId: '001-000-001',
  eventType: 'Purchase',
  value: '89000',
  currency: 'KRW',
  items: [
    { product_id: 'SKU-001', price: 39000, quantity: 1 },
    { product_id: 'SKU-002', price: 50000, quantity: 1 }
  ],
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
assertThat(trackedEvents[0].params.value).isEqualTo('89000');
assertThat(trackedEvents[0].params.currency).isEqualTo('KRW');
assertThat(trackedEvents[0].params.items.length).isEqualTo(2);
assertThat(trackedEvents[0].params.items[0].product_id).isEqualTo('SKU-001');
assertThat(trackedEvents[0].params.items[1].product_id).isEqualTo('SKU-002');
