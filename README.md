# TextEditor

## 프로젝트 컨셉
contentEditor 기능을 기반으로 텍스트 입력, 서식 편집 등의 작업을 할 수 있는 텍스트 편집기를 구현한다.<br/>
텍스트 편집기의 연동을 위해 편집 동작을 수행시킬 수 있는 API 함수 및 편집기 내 event 전달을 위한 publisher도 함께 구현한다.<br/>

## 구조
![image](https://user-images.githubusercontent.com/18525366/100903124-e3099a80-3508-11eb-853b-dfe880d8a596.png)

## 동작
- 셀렉션 및 텍스트 입력 : contentEditable의 기본 입력 동작을 활용<br/>
- 텍스트 서식 : 편집 action을 통한 css 서식 적용<br/>

## 모델
OOXML의 Document 속성들을 JSON 형식으로 모델링

#### 1. 전제 모델 구조
<pre>
Document: {
  bodyPr: {},               // document body properties : 문서 전체 속성정보
  ps: [                     // paragraph list : 문단 정보 리스트
    {
      pPr: {}               // paragraph properties : 문단 속성정보
      runs: [               // run list : 문단 내 텍스트 구분 단위(run) 리스트
        {
          r: {              // r : run 정보
            rPr: {},        // rPr : run 속성정보
            t: "content"    // t : 텍스트 값 정보
          }
        },
        ...
      ]
    },
    ...
  ]
}
</pre>

#### 2. 문서 전체 속성정보(bodyPr)
<pre>
bodyPr: {
  anchor: 't',      // 세로정렬 : "t", "ctr", "b"
  tIns: '',
  lIns: '',
  rIns: '',
  bIns: ''
{
</pre>
#### 3. 문단 속성정보(pPr)
<pre>
pPr: {
  algn: 'l',        //  가로정렬 : "l", "ctr", "r"
{
</pre>
#### 4. run 속성정보(rPr)
<pre>
rPr: {
  b: 1,             // bold : 0 / 1
  i: 1,             // italic : 0 / 1
  u: 'sng'          // underline : 'sng' / 'dbl(브라우저 렌더링 이슈로 현재 미지원)' / 'none'
  strike: 1,        // strike : 0 / 1
  sz: 1200,         // font-size (pt x 100)
  ea: {             // ea, latin font info
    typeface: 'nanumgothic'
  }
}
</pre>

## HTML 렌더링
paragraph는 p 태그로 표현, paragraph 내에는 문단을 구성하는 텍스트 단위(run)이 span으로 표현된다.<br/>
paragraph properties 정보는 p 태그의 style 속성으로 렌더링, run properties 정보는 span 태그의 style 속성으로 렌더링한다.<br/>
```
<div contentEditable="true">
  <p>
    <span style="font-size:12pt;">텍스트</span><span> </span><span >편집기</span>
  </p>
</div>
```

