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
  bodyPr: {}
  ps: [
    {
      pPr: {}
      runs: [
        {
          r: {
            rPr: {},
            t: "content"
          }
        },
        ...
      ]
    }
  ]
}
</pre>
