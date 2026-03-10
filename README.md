# Dable Conversion GTM Template

Google Tag Manager (GTM) 템플릿을 통해 Dable 픽셀 추적 코드를 손쉽게 설치하고 관리할 수 있습니다.

## 🚨 중요 사항

Purchase 이벤트 사용 시 **반드시 GTM에서 변수를 먼저 생성**해야 합니다.

### "알 수 없는 변수" 경고 해결
템플릿에서 `{{purchase_value}}`나 `{{purchase_currency}}`를 입력하면 GTM이 "알 수 없는 변수"라는 경고를 표시할 수 있습니다. **이는 정상적인 동작**이며, 해당 변수를 GTM에서 생성하지 않았기 때문입니다.

**해결 방법:**
1. GTM에서 변수 먼저 생성
2. 템플릿에서 `{{변수명}}` 사용
3. 경고 자동 해결

## 설치 방법

1. GTM 컨테이너에서 **태그** > **새로 만들기** 선택
2. **태그 구성** > **커뮤니티 템플릿 갤러리** 선택  
3. "Dable Conversion" 검색 및 선택
4. 필수 설정 완료 후 저장

## 주요 기능

### 지원하는 이벤트 타입

- **PageView**: 페이지 조회 추적
- **ViewContent**: 콘텐츠 조회 추적
- **Search**: 검색 이벤트 추적
- **Lead**: 리드 생성 추적
- **CompleteRegistration**: 회원가입 완료 추적
- **AddToCart**: 장바구니 추가 추적
- **InitiateCheckout**: 결제 시작 추적
- **Purchase**: 구매 완료 추적 (value, currency 파라미터 필수)
- **Custom Event**: 사용자 정의 이벤트 (event1, event2, event3)

## DPA (Dynamic Product Ads) 설정

DPA(상품 기반 리타겟팅)를 사용하려면 상품 ID를 Items (DPA) 필드로 전달해야 합니다.

### 1단계: GTM 변수 생성

1. GTM에서 **변수** > **새로 만들기** 클릭
2. **변수 구성** > **데이터 영역 변수** 선택
3. **변수 이름**: `dable_items`
4. **데이터 영역 변수 이름**: `dable_items`
5. **저장**

### 2단계: 웹페이지에 Data Layer 코드 추가

```javascript
// 상품 상세 페이지 (PageView) - GTM 스크립트 로드 전에 push
dataLayer.push({
  'dable_items': [{ 'product_id': '12345' }]
});

// 장바구니 추가
dataLayer.push({
  'dable_items': [{ 'product_id': '12345' }, { 'product_id': '67890' }],
  'event': 'add_to_cart'
});

// 구매 완료
dataLayer.push({
  'purchase_value': 89000,
  'purchase_currency': 'KRW',
  'dable_items': [{ 'product_id': '12345' }, { 'product_id': '67890' }],
  'event': 'purchase_completed'
});
```

### 3단계: GTM 태그 설정

Dable Conversion 태그의 **Items (DPA)** 필드에 `{{dable_items}}`를 입력합니다.

> **참고:** Items (DPA) 필드는 PageView, AddToCart, Purchase 이벤트에서 사용됩니다. 다른 이벤트에서는 무시됩니다.

## Purchase 이벤트 설정 (단계별 가이드)

### 1단계: GTM 변수 생성 (필수)

Purchase 이벤트를 사용하기 전에 **반드시** 다음 변수들을 생성해야 합니다.

#### 방법 1: Data Layer 변수 (권장)

**purchase_value 변수 생성:**
1. GTM에서 **변수** > **새로 만들기** 클릭
2. **변수 구성** > **데이터 영역 변수** 선택
3. **변수 이름**: `purchase_value`
4. **데이터 영역 변수 이름**: `purchase_value`
5. **저장**

**purchase_currency 변수 생성:**
1. **변수** > **새로 만들기** 클릭
2. **변수 구성** > **데이터 영역 변수** 선택
3. **변수 이름**: `purchase_currency`
4. **데이터 영역 변수 이름**: `purchase_currency`
5. **저장**

### 2단계: 웹페이지에 Data Layer 코드 추가

```javascript
// 결제 완료 페이지에서 실행
dataLayer.push({
  'purchase_value': 15000,      // 실제 구매 금액
  'purchase_currency': 'KRW',   // 통화 코드
  'event': 'purchase_completed' // 트리거용 이벤트
});
```

### 3단계: GTM 태그 설정

1. **태그** > **새로 만들기** > **Dable Conversion** 선택
2. **Service ID**: 본인의 Dable Service ID 입력
3. **Event Type**: Purchase 선택
4. **Transaction Value**: `{{purchase_value}}`
5. **Currency**: `{{purchase_currency}}`

### 4단계: 트리거 설정

1. **트리거** > **새로 만들기** > **사용자 정의 이벤트**
2. **이벤트 이름**: `purchase_completed`
3. 태그에 이 트리거 연결

## 변수 설정 체크리스트

- [ ] GTM에서 `purchase_value` 변수 생성
- [ ] GTM에서 `purchase_currency` 변수 생성
- [ ] GTM에서 `dable_items` 변수 생성 (DPA 사용 시)
- [ ] 웹페이지에 dataLayer.push() 코드 추가
- [ ] 태그에서 `{{purchase_value}}`, `{{purchase_currency}}` 사용
- [ ] 태그에서 `{{dable_items}}` 사용 (DPA 사용 시)
- [ ] 트리거 설정 완료
- [ ] GTM Preview 모드에서 테스트

## 다양한 변수 활용 방법

### 방법 1: Data Layer 변수 (권장)

```javascript
// 웹페이지에서 실행
dataLayer.push({
  'purchase_value': orderData.totalAmount,
  'purchase_currency': orderData.currency,
  'transaction_id': orderData.orderId,
  'event': 'purchase_completed'
});
```

### 방법 2: JavaScript 변수

DOM 요소나 JavaScript 객체에서 값을 동적으로 가져올 수 있습니다.

```javascript
// GTM의 사용자 정의 JavaScript 변수
function() {
  var priceElement = document.querySelector('.total-price');
  return priceElement ? priceElement.textContent.replace(/[^0-9]/g, '') : '';
}
```

### 방법 3: DOM Element 변수

```html
<!-- HTML 예시 -->
<span id="order-total" data-value="15000">₩15,000</span>
<input type="hidden" id="currency" value="KRW">
```

**GTM 설정:**
1. **변수** > **DOM 요소** 선택
2. **선택 방법**: CSS 선택기
3. **요소 선택기**: `#order-total`
4. **속성 이름**: `data-value`

## 테스트 방법

### GTM Preview 모드 확인

1. GTM에서 **미리보기** 클릭
2. 웹사이트에서 Purchase 이벤트 발생시키기
3. GTM Preview 창에서 확인:
   - [ ] Variables 탭에서 변수 값 확인
   - [ ] Tags 탭에서 Dable Conversion 태그 실행 확인
   - [ ] Data Layer 탭에서 데이터 푸시 확인

### 브라우저 개발자 도구 확인

```javascript
// 콘솔에서 실행
console.log(dataLayer);           // data layer 내용 확인
console.log(window.dablena);      // dablena 객체 확인
console.log('{{purchase_value}}'); // 변수 값 확인 (GTM Preview에서만)
```

## FAQ (자주 묻는 질문)

### Q: "알 수 없는 변수 {{purchase_value}}" 경고가 나타납니다
**A:** 정상입니다. GTM에서 해당 변수를 먼저 생성하세요. 변수 생성 후 경고가 사라집니다.

### Q: 변수 값이 undefined로 나타납니다
**A:** 다음을 확인하세요:
- dataLayer.push() 코드가 태그 실행 전에 실행되는지
- 변수 이름 대소문자가 정확한지
- GTM Preview 모드에서 Variables 탭 확인

### Q: Purchase 이벤트가 전송되지 않습니다
**A:** 필수 사항을 확인하세요:
- value와 currency 변수가 모두 설정되었는지
- 트리거가 정상 작동하는지
- 네트워크 탭에서 Dable 스크립트 로드 확인

### Q: 동적 값 대신 고정 값을 사용할 수 있나요?
**A:** 네, 가능합니다. `{{purchase_value}}` 대신 `15000` 같은 고정 값을 직접 입력할 수 있습니다.

### Q: 다른 이벤트에도 변수를 사용할 수 있나요?
**A:** Purchase 이벤트만 value와 currency 파라미터를 지원합니다. 다른 이벤트는 추가 파라미터가 필요하지 않습니다.

## 문제 해결

### 일반적인 문제

1. **변수 값이 빈 문자열인 경우**
   ```javascript
   // dataLayer 푸시 타이밍 확인
   window.addEventListener('load', function() {
     dataLayer.push({
       'purchase_value': getPurchaseValue(),
       'purchase_currency': 'KRW'
     });
   });
   ```

2. **디버깅 활성화**
   - 태그 설정에서 **Enable Debug Mode** 체크
   - 브라우저 콘솔에서 상세 로그 확인

3. **네트워크 확인**
   - 개발자 도구 > Network 탭
   - `dablena.min.js` 로드 확인
   - 추적 요청 확인

## 테스트 예제 파일

`examples/` 폴더에서 테스트용 HTML 파일들을 제공합니다.

### purchase-test.html
Purchase 이벤트 테스트용 간단한 페이지입니다.
- 버튼 클릭으로 Purchase 이벤트 발생
- KRW, USD 테스트 케이스 포함
- DataLayer 로그 실시간 확인

**사용법:**
1. `GTM-XXXXXXX`를 실제 GTM 컨테이너 ID로 변경
2. GTM에서 `purchase_value`, `purchase_currency` 변수 생성
3. Dable Conversion 태그 설정 후 테스트

### basic-events.html
기본 이벤트들을 테스트할 수 있는 페이지입니다.
- PageView, ViewContent, Search, Lead 등
- 각 이벤트별 개별 테스트 가능

### custom-events.html
커스텀 이벤트(event1, event2, event3) 테스트 페이지입니다.
- 템플릿에서 선택 가능한 커스텀 이벤트 테스트

## 개발자 정보

### 템플릿 권한 설정

이 GTM 템플릿은 다음과 같은 권한을 요청합니다:

#### 1. 전역 변수 접근 (`access_globals`)
- `dablena`: Dable 픽셀 메인 객체 (읽기/쓰기/실행)
- `__dablena_gtm_loaded`: 로딩 상태 플래그 (읽기/쓰기)
- `dablena.q`: 명령 큐 배열 (읽기/쓰기)

#### 2. 스크립트 주입 (`inject_script`)
- `https://static.dable.io/dist/*`: Dable 픽셀 스크립트 로딩

#### 3. 로깅 (`logging`)
- **환경**: debug 모드에서만 활성화

### 개발자 API 사용법

템플릿 코드에서 다음 GTM API들을 사용할 수 있습니다:

```javascript
// 기본 GTM API
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');

```

### 보안 고려사항

- 모든 권한은 **최소 필요 범위로만** 제한됨
- 외부 스크립트는 **Dable 도메인으로만** 제한됨
- 로깅은 **디버그 모드에서만** 활성화됨

### 템플릿 수정 시 주의사항

1. **권한 추가**: 새로운 API 사용 시 해당 권한을 `___WEB_PERMISSIONS___` 섹션에 추가
2. **테스트 업데이트**: 코드 변경 시 `___TESTS___` 섹션의 테스트 케이스도 함께 업데이트
3. **보안 검토**: 추가 권한이 최소 필요 범위인지 확인

## 릴리즈 프로세스 (개발자용)

이 템플릿은 GitHub Actions를 통해 자동으로 릴리즈됩니다.

### 릴리즈 방법

1. **GitHub Actions 페이지로 이동**
   - Repository > Actions > "Release GTM Template" 워크플로우 선택

2. **Run workflow 클릭**
   - Branch: `main` 선택
   - 다음 정보 입력:
     - **Version**: 버전 번호 (예: `v1.0.6`)
       - 형식: `v[major].[minor].[patch]` (예: `v1.0.0`, `v1.2.3`)
     - **Release notes**: 릴리즈 노트 내용

3. **자동 처리 내용**

   워크플로우가 다음 작업을 자동으로 수행합니다:

   ✅ **버전 검증**
   - 버전 형식 확인 (`v[숫자].[숫자].[숫자]`)
   - 중복 태그 체크

   ✅ **파일 업데이트**
   - `template.tpl`: 타임스탬프 갱신
   - `metadata.yaml`: 새 버전 SHA 추가
   - `CHANGELOG.md`: 릴리즈 노트 추가

   ✅ **Git 작업**
   - 변경사항 커밋
   - Git 태그 생성 및 푸시
   - GitHub Release 생성

   ✅ **GTM 커뮤니티 갤러리 연동**
   - `metadata.yaml`의 SHA를 통해 GTM 갤러리 자동 업데이트

### 릴리즈 버전 규칙

이 프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다:

- **Major** (v2.0.0): Breaking changes (호환성 깨지는 변경)
- **Minor** (v1.1.0): 새 기능 추가 (하위 호환성 유지)
- **Patch** (v1.0.1): 버그 수정

### 릴리즈 예시

```yaml
Version: v1.0.6
Release notes: |
  ### 개선사항
  - 타이머 트리거 이슈 수정
  - callInWindow 사용으로 변경하여 안정성 향상

  ### 버그 수정
  - 스크립트 로드 후 이벤트 전송 문제 해결
```

### 릴리즈 후 확인사항

1. **GitHub Release 페이지 확인**
   - https://github.com/teamdable/dable-conversion-gtm/releases

2. **GTM 커뮤니티 갤러리 확인**
   - GTM에서 "Dable Conversion" 검색
   - 새 버전이 표시되는지 확인 (최대 24시간 소요)

3. **metadata.yaml 검증**
   - SHA가 올바른 커밋을 가리키는지 확인
   - 버전 히스토리가 올바르게 보존되었는지 확인

### 수동 롤백 방법

문제 발생 시:

```bash
# 1. 태그 삭제
git tag -d v1.0.6
git push origin :refs/tags/v1.0.6

# 2. 커밋 되돌리기
git revert HEAD~3  # 최근 3개 커밋 되돌리기

# 3. metadata.yaml 수동 수정
# 이전 버전의 SHA로 복구

# 4. 푸시
git push origin main
```

### 주의사항

⚠️ **중요**:
- 릴리즈 후에는 태그를 수정하거나 삭제하지 마세요
- GTM 갤러리에 배포된 후에는 롤백이 어렵습니다
- 릴리즈 전에 반드시 테스트를 완료하세요

## 관련 문서

- [GTM Data Layer 가이드](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GTM 변수 문서](https://support.google.com/tagmanager/answer/7683056)
- [GTM 사용자 정의 변수](https://support.google.com/tagmanager/answer/7683362)
- [GTM 전자상거래 추적](https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce)
- [GTM Custom Templates](https://developers.google.com/tag-platform/tag-manager/templates)
- [GTM Sandboxed JavaScript](https://developers.google.com/tag-platform/tag-manager/templates/sandboxed-javascript)

## 지원

문의사항이나 기술적 문제가 있으시면 Dable 고객지원팀에 연락주세요.