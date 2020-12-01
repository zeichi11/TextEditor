# TextEditor

### 프로젝트 설명
contentEditor 기능을 기반으로 텍스트 입력, 서식 편집 등의 작업을 할 수 있는 텍스트 편집기를 구현한다.

### 구조

텍스트 입력 : contentEditable의 기본 입력 동작을 활용
텍스트 서식 : 편집 action을 통한 css 서식 적용

### 모델
OOXML의 Document 속성을 JSON 형식으로 변환하여 사용
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
            t: "content"    // t : 텍스트
          }
        },
        ...
      ]
    }
  ]
}
</pre>


