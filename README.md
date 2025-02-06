# ✈️ Hey! Local

**각국의 유저들이 여행 정보를 주고 받는 커뮤니티**

![이미지소스_L](https://github.com/user-attachments/assets/3ecb7a4e-fda8-45be-932c-7e8e8abe9610)

## 💪 Our Team
|박주희|박현지|박민준|강민정|문다슬|김민정|
|---|---|---|---|---|---|
|[@juhuibag42](juhuibag42@gmail.com)|[@hjpark9955](hjpark9955@gmail.com)|[@DevIruka](https://github.com/DevIruka)|[@cara656513](https://github.com/cara656513)|[@Raina-Moon](https://github.com/Raina-Moon)|[@minjung7](https://github.com/minjung7)|
|UI/UX|UI/UX|TL,FE|FE|FE|FE|
|🎨꼼꼼함의 끝판왕|📝스마트 능력자|👑해결사 리더|🫶팀 마스코트|👨‍💻멀티 플레이어|🔥코드 해석 열정러|

### [📝 프로젝트 노션 바로가기](https://www.notion.so/teamsparta/5-2c6f7f355c1a4f4999039d482886700b)

## 📖 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [주요 기능](#주요-기능)
3. [개발 기간](#개발-기간)
4. [적용 기술](#적용-기술)
5. [기술적 의사결정](#기술적-의사결정)
6. [트러블 슈팅](#트러블-슈팅)
7. [최적화](#최적화)
8. [유저 테스트](#유저-테스트)
9. [기술 스택](#기술-스택)
10. [ERD](#ERD)
11. [프로젝트 파일 구조](#프로젝트-파일-구조)


## 프로젝트 소개

> ### "여행 정보를 묻고 답하다!"

- 한 줄 설명: **나를 위한 여행 계획**을 **현지인에게 요청**하고, 내가 잘 아는 장소의 **여행 계획을 판매**하는 서비스

- 기획 의도
1. 여행 계획을 세울 때 정보 검색만으로 한계를 느끼는 사용자들의 니즈를 충족시키고자 했습니다.
2. 현지인의 추천이라 신뢰도가 높고, 개개인에 맞춰진 여행 계획이라는 강점을 셀링포인트로 삼고자 했습니다.

## 주요 기능

### 🏠 홈

> - 게시글을 주제, 질문/답변, 국가 또는 도시별로 필터링하는 것이 가능합니다.
> - 수파베이스의 range API, useInfiniteQuery의 fetchNextPage로 더보기 기능을 구현하였습니다.
> - shadcn tabs 라이브러리를 사용하였습니다. 

<details>

<summary>미리보기</summary>

<div  markdown="1">

<img  width="926"  alt="Image"  src="https://github.com/user-attachments/assets/32a23251-d5ff-4745-a5b6-ce5f93cbda01"  />

<br>

</div>

</details>

### 📝 게시글 상세

> - open ai api(GPT 4o)를 통해 번역 데이터를 저장하고, 원문 또는 번역문을 보여줄 수 있도록 구현하였습니다.
> - 나도 궁금해요 기능에 optimistic update를 적용하였습니다.
> - 답변글 구매 및 크레딧 차감 로직을 구현하였습니다. (답변글 작성자는 바로 보기)
> - 답변하기 버튼을 통해 답변글 작성 페이지로 이동합니다. (기한이 지나면 disabled)
> - 셀렉트 박스 클릭 시 수정 삭제 기능이 구현되어 있습니다. (작성자가 아닐 시 신고하기)

<details>

<summary>미리보기</summary>

<div  markdown="1">

![Image](https://github.com/user-attachments/assets/cfdbedbd-4335-4c0d-b3b5-f596d07628f4)

<br>

</div>

</details>

### 🖋 질문하기

> - 나라/도시 선택과 기한 선택을 모달로 띄워 UX를 최적화하였습니다.
> - disabled와 watch를 사용하여 사용자가 form을 다 채워야 등록할 수 있도록 유도하였습니다.
> - 수정 시 업로드한 질문글에 답변이 1개 이상 달릴 시 기한만 수정 가능하도록 disabled 처리하였습니다. (답변이 없으면 전체 수정 가능)

<details>

<summary>미리보기</summary>

<div  markdown="1">

<img  width="682"  alt="Image"  src="https://github.com/user-attachments/assets/eb014c76-a6d8-46c0-869c-542208c291e2"  />

<br>

</div>

</details>

### 🖋 답변하기

> - 글, 이미지, 구글맵스를 사용자가 원하는 방식으로 자유롭게 작성할 수 있습니다.
> - 글의 굵기, align을 바꿔가며 사용자가 원하는 컨셉을 구현할 수 있습니다.
> - 구글맵스에서 장소를 검색, 에디터에 추가하여 정확한 여행 정보를 전달할 수 있습니다.
> - 모바일에서 하단 메뉴바가 키보드 toggle 시 키보드 높이를 반영하여 유저 사용의 편의성을 구현하였습니다.

<details>

<summary>미리보기</summary>

<div  markdown="1">

<img  width="650"  alt="Image"  src="https://github.com/user-attachments/assets/c26db8b6-08ee-47d7-bb80-c530c89d6be2"  />

<img  width="281"  alt="Image"  src="https://github.com/user-attachments/assets/a44dfb94-5d4f-4fdc-9fe6-8c3a400b1bb8"  />

<br>

</div>

</details>

### 🔐 로그인/회원가입

> - 로그인이 필요한 기능 클릭 시, 로그인이 필요하다는 모달이 표시되며, 로그인 하기 버튼을 누르면 여러 로그인 방법들이 제시됩니다.
> - 지원하는 소셜 로그인 방식은 세계적으로 많이 쓰이는 구글 로그인과, 카카오 로그인이 있습니다.
> - 카카오, 구글을 이용해 로그인 시, 해당 소셜에서 사용하는 이름이 그대로 닉네임으로 정해집니다.

<details>     

<summary>미리보기</summary>

<div  markdown="1">

<img  width="646"  alt="Image"  src="https://github.com/user-attachments/assets/33d4ab2b-276d-49b5-83f6-601a9722ddfd"  />

<img  width="512"  alt="Image"  src="https://github.com/user-attachments/assets/1eca323a-96b4-4f6f-91b6-ce9c599a8513"  />

<br>

</div>

</details>

### 🔍 검색

> - 키워드를 입력하여 검색하면, 질문&답변, 질문, 답변 카테고리 별로 필터링 가능하며, 최근 검색어가 저장이 됩니다.
> - 최근 검색어는 총 10개까지 저장되며, 필요에 따라 삭제할 수도 있습니다.

<details>

<summary>미리보기</summary>

<div  markdown="1">

<img  width="888"  alt="Image"  src="https://github.com/user-attachments/assets/d2202daf-987a-4aa7-b188-c4d0e814bf8c"  />

<img  width="887"  alt="Image"  src="https://github.com/user-attachments/assets/74193d3b-be85-4cc1-bfb4-d1847e3f09a9"  />

<br>

</div>

</details>

### 😃 마이페이지

> - 사용자 프로필, 셀러 인증, 언어 설정을 관리할 수 있습니다.
> - 사용자의 구글 지도 API를 활용하여 현재 위치를 기반으로 국가 인증을 진행하여 신뢰할 수 있는 거래 환경을 제공합니다.
> - 다국어 설정을 변경하여 원하는 언어로 사용할 수 있습니다.
> - 나의 활동 내역에서 작성한 글, 구매한 글, 북마크한 글을 확인할 수 있으며, Supabase에서 불러와 필터링 및 정렬 기능을 제공합니다.
> - 데이터는 실시간으로 업데이트되며, 최신 정보를 빠르게 확인할 수 있습니다.
> - 토스페이먼츠 API를 사용하여 가상결제로 크레딧을 충전하고 답변을 보는데 사용할 수 있습니다.
 
<details>

<summary>미리보기</summary>

<div  markdown="1">

- 국가인증

<img  width="675"  alt="Image"  src="https://github.com/user-attachments/assets/66d54017-7c95-4118-ac08-42a886badbe4"  />

- 언어 설정

<img  width="671"  alt="Image"  src="https://github.com/user-attachments/assets/dbd3a1f4-f330-44d9-9445-d63f003bd67e"  />

- 크레딧

<img  width="647"  alt="Image"  src="https://github.com/user-attachments/assets/1c07a7bf-9a17-45b5-b4f7-060293ad3642"  />

<img  width="671"  alt="Image"  src="https://github.com/user-attachments/assets/c4a123eb-cc57-4295-9842-203fe655e715"  />

<br>

</div>

</details>

### 👽 언어 변경 지원

> - i18next로 다국어 지원, 언어 설정에 따라 사용자 위치 정보를 각 언어에 맞게 표시합니다.

### 🎭 반응형 화면 구현

> - Mobile, PC & Tablet 화면 사이즈에 맞게 반응형으로 구현하였습니다.
<details>

<summary>미리보기</summary>

<div  markdown="1">

![스크린샷 2025-02-05 오후 9 36 24](https://github.com/user-attachments/assets/c9913424-8711-4dab-a6e5-cfc5256bbfdf)

![스크린샷 2025-02-05 오후 9 36 54](https://github.com/user-attachments/assets/18b22a4b-b117-4cfc-8a18-09cea0825e27)

<br>

</div>

</details>

## 개발 기간

- 2024.12.31(화) ~ 2025.2.6(목)

## 적용 기술

### OpenAi Api

- 글 작성 시 GPT 요청을 통해 번역본을 supabase에 저장합니다. (질문글: 여행지 국가의 언어/답변글: 질문자 국가의 언어로 번역)

<details>

<summary>자세히 보기</summary>

<div  markdown="1">

- OpenAi 플레이그라운드 활용

![Image](https://github.com/user-attachments/assets/21085733-5cd8-436e-92a6-edc4c0111641)

<br>

</div>

</details>

### 소셜 로그인

- supabase의 signInWithOAuth API를 사용하였고, 트리거를 설정하여 auth.users 테이블의 새로운 행을 자동으로 public.users 테이블에 추가 합니다

<details>

<summary>자세히 보기</summary>

<div  markdown="1">
  
- 트리거 설정

![Image](https://github.com/user-attachments/assets/32618dc2-abd4-4509-b314-0fa66783f591)

<br>

</div>

</details>

### TOSS PAYMENTS 결제 시스템

- 토스 페이먼츠의 API를 활용하여 실제 토스 어플 또는 링크로 이동하여 결제 및 충전에 성공하는 가상 모델을 구현하였습니다.

### TIPTAP Editor/Google map api

- 팁탭 에디터 라이브러리와 구글맵 api를 함께 사용하였습니다.
- 장소 선택 시 미리보기 데이터 및 create, update, read시에 구글맵 api를 활용하였습니다.

### i18next과 ip 주소를 이용한 사용자의 국가에 따른 언어 변경 시스템

- 다국어 언어 지원 라이브러리 i18next를 사용하였습니다.
- 사용자의 ip 주소를 https://ipwho.is/ 을 통해 받아와, 접속한 국가에 따라 언어를 다르게 표시해주는 기능을 탑재하였습니다.

### Sentry

- 유저테스트 전 sentry.captureException을 주요 로직(크레딧 차감, GPT 번역 등)에 삽입하여 에러 현상을 사이트에서 직접 확인할 수 있도록 하였습니다.

<details>

<summary>자세히 보기</summary>

<div  markdown="1">

![Image](https://github.com/user-attachments/assets/777f887d-7c00-49d7-a8a2-44116adc4081)

<br>

</div>

</details>

## 기술적 의사결정

<details>

<summary>1. 게시물의 질문-답변 형식</summary>

<div  markdown="1">

- 문제: 게시글 작성 시 사용할 에디터 라이브러리에 구글 맵 API를 삽입해야 했음

- 해결책 후보

1. TipTap 장점 : 갖추고 있는 플러그인 종류가 다양하고 커스터마이징이 용이함. 커뮤니티에서 다른 사용자가 만든 플러그인을 가져올 수 있음 단점 : 테일윈드가 적용 안된다는 사용자들이 은근하게 있음
2. Lexical 장점 : 커스터마이징과 경량화 면에서 훌륭함. 웬만한 플러그인은 구축하고 있음. DOM조작이 최적화돼서 셋 중 제일 성능이 빠름. 단점 : 플러그인 생태계가 처참. 한마디로 추가 기능을 구현할 때 개발자에게 더 많은 작업량을 요구함
3. Slate.js 장점 : 완전한 커스터마이징이 가능함. 단점 : 장점이 단점. 기본 에디터 기능도 제공 안됨

- 최종 선택: 팁탭 에디터-구글 맵 API를 사용할 수 있고 자유도가 적당해 러닝 커브가 비교적 낮음

<br>

</div>

</details>

<details>

<summary>2. 크레딧 충전</summary>

<div  markdown="1">

- 문제: 서비스의 가상 화폐인 크레딧을 실제 돈으로 결제할 수 있도록 결제 시스템 도입 필요

- 해결책 후보

1. Google Pay: 많은 국가를 지원하지만, 국내에서 많이 사용하지 않음
2. 토스 페이먼츠: 최근 국내 많은 기업들이 실사용, 국내에 초점

- 최종 선택: 토스 페이먼츠-토스에서 페이팔 해외 결제 시스템 지원함

<br>

</div>

</details>

<details>

<summary>3. 국내-해외 유저 간 소통</summary>

<div  markdown="1">

- 문제: 국내 유저와 해외 유저의 게시물이 서로의 언어로 자동 번역되도록 해야 함

- 해결책 후보

1. 챗지피티: 문맥 이해가 필요한 자연어 처리, 대화형 응답 생성/사용량 제한과 가격 책정 구조가 명확
2. DeepL: ai 활용하지 않고 번역 기능만 필요한 간단한 서비스에 적합

- 최종 선택: 챗지피티-높은 번역 퀄리티/간단한 REST API를 통해 통합 가능, 플레이그라운드로 프로토타이핑 지원하여 개발자 친화적

<br>

</div>

</details>

## 트러블 슈팅

<details>

<summary>i18 next</summary>

<div  markdown="1">

#### ⚙️ 문제 상황 1.

- i18next를 통한 다국어 지원을 구현하려 했으나, SSR에서는 I18next의 훅인 useTranslation을 사용할 수 없음.

#### 🚀 해결 방법 1.

- 서버에서 사용할 수 있도록, 서버 측에서도 config를 만들었다.
- initTranslation을 이용하여 서버 컴포넌트에서도 i18next를 이용한 번역 데이터 관리가 가능해짐 

#### ⚙️ 문제 상황 2.

- 서버를 활용하여 i18next를 사용할 경우, url을 일부 바꿔 params를 활용하여 다국어를 구현하는 방식을 사용해야 함.
  ex)https://heylocal.site/en
- 하지만 이 방식을 사용하면 url이 더러워지고, params를 사용해야 구현이 되어 로직이 복잡해진다.

#### 🚀 해결 방법 2.

- 쿠키는 서버에서도 불러오는 게 가능하다는 걸 이용. 언어 설정을 쿠키에 저장해놓는 식으로 구현해놓았다.
- 쿠키를 이용해 zustand를 이용하여 전역 관리를 함으로서 언어 설정을 쉽게 설정할 수 있도록 하였다.

<br>

</div>

</details>

<details>

<summary>번역 데이터 저장</summary>

<div  markdown="1">

#### ⚙️ 문제 상황 1.

- 게시물 페이지에 들어갈 때마다 번역을 요청하여 로딩 오래 걸림/요청 토큰에 따른 요금이 크게 빠져나감

#### 🚀 해결 방법 1.

- 임시방편으로 useQuery의 staletime을 높여 한번 번역이 된 게시물은 나갔다가 다시 들어와도 로딩 시간이 없고, 번역 요청도 보내지 않음
- 이후 번역 데이터를 데이터베이스에 저장하는 것으로 변경하였음

#### ⚙️ 문제 상황 2.

- GPT가 플레이그라운드 프롬프터 테스트와 다르게 응답 값에 image나 지도는 빼고 돌려줄 때가 있음

#### 🚀 해결 방법 2.

- temparature를 1이 아닌 0으로 하니까 의도한 대로 잘 돌려주었다.

(temparature: GPT 모델에서 생성된 텍스트의 무작위성을 제어하는 매개변수)

<br>

</div>

</details>

<details>

<summary>Vercel timeout</summary>

<div  markdown="1">

#### ⚙️ 문제 상황

- ut 도중 serverless function has timed out 이라며 vercel이 다운되는 현상이 있었음.

#### 🚀 해결 방법

- vercel의 function max duration을 최대치로 설정함으로서 해당 오류를 수정함

![Image](https://github.com/user-attachments/assets/e5f1e9d9-c4d0-4e7d-abec-d56c69495c33)

![Image](https://github.com/user-attachments/assets/bc003716-7b91-4dc5-8ccc-47b48c36eb40)

<br>

</div>

</details>

## 최적화

### LIGHTHOUSE 진단 결과 성능을 58점에서 82점으로 개선하였다.

1. 질문글과 답변글을 따로따로 불러와 클라이언트에서 병합 후, 최신순으로 정렬하는 식으로 데이터를 불러왔으나, **supabase에서 sql editor를 사용하여 요청만 한 번 하는 것**으로 원하는 데이터를 한 번에 빠르게 얻어올 수 있었다.

2. svg 이미지들을 적극 활용하여 기존에 사용하고 있던 무거운 라이브러리인 react-icon를 지움으로서 **번들을 최적화**할 수 있었다.

3. modal provider에서 **modal을 import 시에 dynamic으로 import**하여 필요 시에만 가져오도록 하고, ssr: false로 지정해주었다.

## 유저 테스트

- 유저 테스트 진행 기간: 2025.01.24 ~ 2025.01.28
- 피드백 내용
1. 구매하기 / 전체보기를 눌렀을 때 로그인 화면으로 쉽게 이동/유도할 수 있게 하는 편이 UX에 더 나을 것이란 의견
2. 카테고리별 이동 시 로딩이 걸리는 문제
3. 메인 페이지에서 카테고리에 해당되는 글이 없을 때, 상단 메뉴가 쭉 아래로 내려오는 엣지 케이스 발견
- 반영
1. 로그인이 필요해요라는 모달을 제작하였고, 로그인 하기 버튼을 누르면, 로그인의 옵션을 보여주는 모달을 추가로 보여주게끔 하였다.
2. 카테고리를 수파베이스 필터링 로직에 포함시켜서 클릭할 때마다 매번 요청하고 응답을 받았는데 이 부분을 filter로 수정
3. 컨텐츠를 화면 상단에 고정하여 수정

<details>

<summary>자세히 보기</summary>

<div  markdown="1">

![Image](https://github.com/user-attachments/assets/eef19bf2-f895-40b8-94ce-418d7094fcd1)

![Image](https://github.com/user-attachments/assets/a3d3c2d7-9136-40ef-b7a7-39ed1fb307eb)

![Image](https://github.com/user-attachments/assets/d2f21925-dc1a-4d78-848c-8576ecd24409)

<br>

</div>

</details>

## 기술 스택

### ✔️ Language

<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> 
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">

### ✔️ Framework & Libraries

<img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white"> 
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white">
<img src="https://img.shields.io/badge/Tanstack Query-FF4154?style=for-the-badge&logo=TanstackQuery&logoColor=white">
<img src="https://img.shields.io/badge/zustand-FF4154?style=for-the-badge&logo=TanstackQuery&logoColor=white">
<img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">
<img src="https://img.shields.io/badge/react slick-FF4154?style=for-the-badge&logo=react-slick&logoColor=white">
<img src="https://img.shields.io/badge/react spinners-FF4154?style=for-the-badge&logo=react-spinners&logoColor=white">
<img src="https://img.shields.io/badge/react carousel-FF4154?style=for-the-badge&logo=react-carousel&logoColor=white">
<img src="https://img.shields.io/badge/uuid-FF4154?style=for-the-badge&logo=uuid&logoColor=white">

### ✔️ Hosting & Deployment

<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

### ✔️ Version Control

<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

### ✔️ IDE

![VSCode](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

### ✔️System Architecture

![Image](https://github.com/user-attachments/assets/2a72b475-2b6d-4943-8814-756cdd356b8c)

### ✔️ Deploy

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

### ✔️ Database Manage System

![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

## ERD

<img  width="1451"  alt="Image"  src="https://github.com/user-attachments/assets/9cf350ad-7af6-4a21-9bf7-2bb8b37bc859"  />

## 프로젝트 파일 구조

```
├─public
│  ├─images
│  └─locales
│      ├─en
│      └─ko
├─src
│  ├─app
│  │  ├─api
│  │  │  ├─response
│  │  │  └─sentry-example-api
│  │  ├─auth
│  │  │  └─callback
│  │  ├─fonts
│  │  ├─home
│  │  │  ├─_components
│  │  │  ├─_hooks
│  │  │  └─_types
│  │  ├─i18n
│  │  ├─login
│  │  │  ├─_auth
│  │  │  └─_components
│  │  ├─mypage
│  │  │  ├─bookmark
│  │  │  ├─credit
│  │  │  │  ├─_components
│  │  │  │  ├─_hooks
│  │  │  │  └─_types
│  │  │  ├─filters
│  │  │  │  └─all
│  │  │  ├─language
│  │  │  ├─purchase
│  │  │  ├─seller-auth
│  │  │  │  ├─country-verification
│  │  │  │  ├─identity-verification
│  │  │  │  │  └─codepage
│  │  │  │  └─_components
│  │  │  ├─_components
│  │  │  ├─_type
│  │  │  └─_util
│  │  ├─post
│  │  │  ├─[id]
│  │  │  ├─_components
│  │  │  ├─_hooks
│  │  │  ├─_types
│  │  │  └─_utils
│  │  ├─request
│  │  │  ├─_api
│  │  │  ├─_components
│  │  │  │  └─icons
│  │  │  ├─_hooks
│  │  │  └─_types
│  │  ├─request-edit
│  │  │  └─[request_id]
│  │  ├─response
│  │  │  ├─[postId]
│  │  │  ├─_components
│  │  │  ├─_icons
│  │  │  └─_types
│  │  ├─response-edit
│  │  │  └─[responseId]
│  │  ├─response-list
│  │  ├─review
│  │  │  └─[response_id]
│  │  │      ├─_components
│  │  │      └─_utils
│  │  ├─search
│  │  │  ├─[id]
│  │  │  │  ├─_components
│  │  │  │  └─_types
│  │  │  ├─_components
│  │  │  ├─_hooks
│  │  │  └─_utils
│  │  ├─sentry-example-page
│  │  ├─signup
│  │  └─user
│  │      ├─[id]
│  │      ├─_components
│  │      └─_types
│  ├─components
│  │  └─ui
│  ├─config
│  │  └─server
│  ├─constants
│  ├─data
│  │  └─images
│  ├─hook
│  │  └─home
│  ├─lib
│  ├─providers
│  ├─store
│  ├─types
│  └─utils
│      ├─api
│      │  ├─supabase_api
│      │  │  ├─home
│      │  │  ├─post
│      │  │  ├─search
│      │  │  └─user
│      │  └─tanstack
│      │      ├─home
│      │      ├─post
│      │      ├─search
│      │      └─user
│      └─supabase
└─supabase
    └─.temp
```
