import AbstractRenderer from "./AbstractRenderer";

class FormatRenderer extends AbstractRenderer {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * 현재 selection을 반환한다.
	 * @returns {*}
	 */
	getSelection() {
		return window.getSelection();
	}

	/**
	 * 현재의 range 정보를 반환한다.
	 * @returns {*}
	 */
	getRange() {
		return this.getSelection().getRangeAt(0);
	}

	/**
	 * text를 전달받은 offset에 따라 나눈다.
	 * @param {string} text
	 * @param {array} offsetList
	 * @returns {object}
	 */
	devideContent(text, offsetList) {
		let contentList = [],
			cursorOffset = 0,
			targetIndex = 0,
			content,
			i;

		for (i = 0; i < offsetList.length; i++) {
			content = contentList.push(text.substring(cursorOffset, offsetList[i]));
			if (content.length) {
				contentList.push(content);
				if (cursorOffset === offsetList[0]) {
					targetIndex = contentList.length - 1;
				}
			}
			cursorOffset = offsetList[i];
		}

		if (offsetList[offsetList.length - 1] !== text.length) {
			contentList.push(text.substring(offsetList[offsetList.length - 1], text.length));
		}

		return {contentList: contentList, targetIndex: targetIndex};
	}

	// 개발 중인 코드 임시 comment 처리
	//
	// /**
	//  *
	//  * @param range
	//  */
	// getDevidedRange(range) {
	//     let startParentContainer,
	//         endParentContainer,
	//         startContainer = range.startContainer,
	//         endContainer = range.endContainer,
	//         startOffset = range.startOffset,
	//         endOffset = range.endOffset,
	//         textContent,
	//         devideResult,
	//         contentList,
	//         targetIndex,
	//         cursorElement,
	//         targetSpan,
	//         span,
	//         i;
	//
	//     // 1. 특정 span 내에 셀섹션이 위치하는 경(한 span 내에 start, end가 위치)
	//     if (startContainer === endContainer) {
	//         if (startContainer.tagName === "SPAN") {
	//             startParentContainer = startContainer.parentElement;
	//             textContent = startContainer.textContent;
	//
	//             devideResult = this.devideContent(textContent, [startOffset, endOffset]);
	//
	//             if (devideResult) {
	//                 contentList = devideResult.contentList;
	//                 targetIndex = devideResult.targetIndex;
	//             }
	//
	//             cursorElement = startContainer.previousSibling;
	//
	//             for (i = 0; i < contentList.length; i++) {
	//                 span = startContainer.cloneNode();
	//                 span.textContent = document.createTextNode(contentList[i]);
	//
	//                 // select 대상 span이 paragraph의 첫번째 span인 경우
	//                 if (!cursorElement) {
	//                     startParentContainer.prepend(span);
	//
	//                 } else {
	//                     cursorElement.after(span);
	//                 }
	//
	//                 cursorElement = span;
	//
	//                 if (i === targetIndex) {
	//                     targetSpan = span;
	//                 }
	//             }
	//
	//             range = document.createRange();
	//             range.setStart(targetSpan, 0);
	//             range.setEnd(targetSpan, targetSpan.textContent.length);
	//
	//             return range;
	//         }
	//
	//     } else {
	//         startParentContainer = startContainer.parentElement;
	//         endParentContainer = endContainer.parentElement;
	//
	//         // 2. 셀렉션의 start, end 해당하는 element가 서로 다른 span이나 동일한 paragraph 안에 있는 경우
	//         if (startParentContainer === endParentContainer) {
	//             if (startContainer.tagName === "SPAN") {
	//                 textContent = startContainer.textContent;
	//                 devideResult = this.devideContent(textContent, [startOffset, textContent.length]);
	//
	//                 if (devideResult) {
	//                     contentList = devideResult.contentList;
	//                     targetIndex = devideResult.targetIndex;
	//                 }
	//             }
	//         }
	//     }
	// }

	/**
	 * range 내 paragraph들을 반환한다.
	 * @param {object} range
	 * @param {boolean} wholePara
	 * @returns {*}
	 */
	getParasInRange(range, wholePara) {
		let editor,
			paraList = [];

		if (wholePara) {
			editor = this.getEditorLayout();
			return editor.getElementsByTagName("P");
		}

		return paraList;
	}

	/**
	 * range 내 span들을 반환한다.
	 * @param {object} range
	 * @param {boolean} wholeSpans
	 * @returns {*}
	 */
	getSpansInRange(range, wholeSpans) {
		let editor,
			spanList = [];

		if (wholeSpans) {
			editor = this.getEditorLayout();
			return editor.getElementsByTagName("SPAN");
		}

		return spanList;

		// 개발 중인 코드 임시 comment 처리
		//
		// range = this.getDevidedRange(range);
		// spanList.push(range.startContainer);
		//
		// if (range.startContainer !== range.endContainer) {
		//     spanList.push(range.endContainer);
		// }
		//
		// return spanList;
	}

	/**
	 * style을 적용한다.
	 * @param {string} type
	 * @param {object} value
	 */
	applyFormat(type, value) {
		let styleInfo = this.generateHtmlStyle(type, value),
			prop,
			range = this.getRange(),
			targetList,
			i,
			getStyleValue = function (prevStyle, newStyleObj) {
				let DELIM = " ",
					styles = [],
					type = newStyleObj.type,
					value = newStyleObj.value,
					index;

				if (prevStyle) {
					styles = prevStyle.split(DELIM);
				}

				index = styles.indexOf(type);
				if (index > -1) {
					if (!value) {
						styles.splice(index, 1);
					}
				} else {
					if (value) {
						styles.push(type);
					}
				}

				return styles.join(DELIM);
			};

		if (styleInfo.hasOwnProperty("textAlign")) {
			targetList = this.getParasInRange(range, true);
		} else {
			targetList = this.getSpansInRange(range, true);
		}

		for (i = 0; i < targetList.length; i++) {
			for (prop in styleInfo) {
				if (styleInfo.hasOwnProperty(prop)) {
					if (prop === "textDecoration") {
						targetList[i].style[prop] = getStyleValue(targetList[i].style[prop], styleInfo[prop]);
					} else {
						targetList[i].style[prop] = styleInfo[prop];
					}
				}
			}
		}
	}
}

// const FormatRenderer = {
// 	/**
// 	 * 현재 selection을 반환한다.
// 	 * @returns {*}
// 	 */
// 	getSelection: function () {
// 		return window.getSelection();
// 	},
//
// 	/**
// 	 * 현재의 range 정보를 반환한다.
// 	 * @returns {*}
// 	 */
// 	getRange: function () {
// 		return this.getSelection().getRangeAt(0);
// 	},
//
// 	/**
// 	 * text를 전달받은 offset에 따라 나눈다.
// 	 * @param {string} text
// 	 * @param {array} offsetList
// 	 * @returns {object}
// 	 */
// 	devideContent: function (text, offsetList) {
// 		let contentList = [],
// 			cursorOffset = 0,
// 			targetIndex = 0,
// 			content,
// 			i;
//
// 		for (i = 0; i < offsetList.length; i++) {
// 			content = contentList.push(text.substring(cursorOffset, offsetList[i]));
// 			if (content.length) {
// 				contentList.push(content);
// 				if (cursorOffset === offsetList[0]) {
// 					targetIndex = contentList.length - 1;
// 				}
// 			}
// 			cursorOffset = offsetList[i];
// 		}
//
// 		if (offsetList[offsetList.length - 1] !== text.length) {
// 			contentList.push(text.substring(offsetList[offsetList.length - 1], text.length));
// 		}
//
// 		return {contentList: contentList, targetIndex: targetIndex};
// 	},
//
// 	// 개발 중인 코드 임시 comment 처리
// 	//
// 	// /**
// 	//  *
// 	//  * @param range
// 	//  */
// 	// getDevidedRange: function (range) {
// 	//     var startParentContainer,
// 	//         endParentContainer,
// 	//         startContainer = range.startContainer,
// 	//         endContainer = range.endContainer,
// 	//         startOffset = range.startOffset,
// 	//         endOffset = range.endOffset,
// 	//         textContent,
// 	//         devideResult,
// 	//         contentList,
// 	//         targetIndex,
// 	//         cursorElement,
// 	//         targetSpan,
// 	//         span,
// 	//         i;
// 	//
// 	//     // 1. 특정 span 내에 셀섹션이 위치하는 경(한 span 내에 start, end가 위치)
// 	//     if (startContainer === endContainer) {
// 	//         if (startContainer.tagName === "SPAN") {
// 	//             startParentContainer = startContainer.parentElement;
// 	//             textContent = startContainer.textContent;
// 	//
// 	//             devideResult = this.devideContent(textContent, [startOffset, endOffset]);
// 	//
// 	//             if (devideResult) {
// 	//                 contentList = devideResult.contentList;
// 	//                 targetIndex = devideResult.targetIndex;
// 	//             }
// 	//
// 	//             cursorElement = startContainer.previousSibling;
// 	//
// 	//             for (i = 0; i < contentList.length; i++) {
// 	//                 span = startContainer.cloneNode();
// 	//                 span.textContent = document.createTextNode(contentList[i]);
// 	//
// 	//                 // select 대상 span이 paragraph의 첫번째 span인 경우
// 	//                 if (!cursorElement) {
// 	//                     startParentContainer.prepend(span);
// 	//
// 	//                 } else {
// 	//                     cursorElement.after(span);
// 	//                 }
// 	//
// 	//                 cursorElement = span;
// 	//
// 	//                 if (i === targetIndex) {
// 	//                     targetSpan = span;
// 	//                 }
// 	//             }
// 	//
// 	//             range = document.createRange();
// 	//             range.setStart(targetSpan, 0);
// 	//             range.setEnd(targetSpan, targetSpan.textContent.length);
// 	//
// 	//             return range;
// 	//         }
// 	//
// 	//     } else {
// 	//         startParentContainer = startContainer.parentElement;
// 	//         endParentContainer = endContainer.parentElement;
// 	//
// 	//         // 2. 셀렉션의 start, end 해당하는 element가 서로 다른 span이나 동일한 paragraph 안에 있는 경우
// 	//         if (startParentContainer === endParentContainer) {
// 	//             if (startContainer.tagName === "SPAN") {
// 	//                 textContent = startContainer.textContent;
// 	//                 devideResult = this.devideContent(textContent, [startOffset, textContent.length]);
// 	//
// 	//                 if (devideResult) {
// 	//                     contentList = devideResult.contentList;
// 	//                     targetIndex = devideResult.targetIndex;
// 	//                 }
// 	//             }
// 	//         }
// 	//     }
// 	// },
//
// 	/**
// 	 * range 내 paragraph들을 반환한다.
// 	 * @param {object} range
// 	 * @param {boolean} wholePara
// 	 * @returns {*}
// 	 */
// 	getParasInRange: function (range, wholePara) {
// 		let editor,
// 			paraList = [];
//
// 		if (wholePara) {
// 			editor = this.getEditorLayout();
// 			return editor.getElementsByTagName("P");
// 		}
//
// 		return paraList;
// 	},
//
// 	/**
// 	 * range 내 span들을 반환한다.
// 	 * @param {object} range
// 	 * @param {boolean} wholeSpans
// 	 * @returns {*}
// 	 */
// 	getSpansInRange: function (range, wholeSpans) {
// 		let editor,
// 			spanList = [];
//
// 		if (wholeSpans) {
// 			editor = this.getEditorLayout();
// 			return editor.getElementsByTagName("SPAN");
// 		}
//
// 		return spanList;
//
// 		// 개발 중인 코드 임시 comment 처리
// 		//
// 		// range = this.getDevidedRange(range);
// 		// spanList.push(range.startContainer);
// 		//
// 		// if (range.startContainer !== range.endContainer) {
// 		//     spanList.push(range.endContainer);
// 		// }
// 		//
// 		// return spanList;
// 	},
//
// 	/**
// 	 * type과 value 정보로 styleInfo를 생성한다.
// 	 * @param {string} type
// 	 * @param {object} value
// 	 */
// 	generateHtmlStyle: function (type, value) {
// 		let styleInfo = {};
//
// 		switch (type) {
// 			case CMD_TYPE.ALIGN:
// 				styleInfo.textAlign = String(value);
// 				break;
// 			case CMD_TYPE.BOLD:
// 				styleInfo.fontWeight = value ? "bold" : "normal";
// 				break;
// 			case CMD_TYPE.FONT_COLOR:
// 				styleInfo.color = value;
// 				break;
// 			case CMD_TYPE.FONT_NAME:
// 				styleInfo.fontFamily = value;
// 				break;
// 			case CMD_TYPE.FONT_SIZE:
// 				styleInfo.fontSize = value + "pt";
// 				break;
// 			case CMD_TYPE.ITALIC:
// 				styleInfo.fontStyle = value ? "italic" : "normal";
// 				break;
// 			case CMD_TYPE.STRIKETHROUGH:
// 				styleInfo.textDecoration = {};
// 				styleInfo.textDecoration.type = "line-through";
// 				styleInfo.textDecoration.value = value;
// 				break;
// 			case CMD_TYPE.UNDERLINE:
// 				styleInfo.textDecoration = {};
// 				styleInfo.textDecoration.type = "underline";
// 				styleInfo.textDecoration.value = value;
// 				styleInfo.textDecorationStyle = "solid";
// 				break;
// 			case CMD_TYPE.DOUBLE_UNDERLINE:
// 				styleInfo.textDecoration = {};
// 				styleInfo.textDecoration.type = "underline";
// 				styleInfo.textDecoration.value = value;
// 				styleInfo.textDecorationStyle = value ? "double" : "";
// 				break;
// 		}
//
// 		return styleInfo;
// 	},
//
// 	/**
// 	 * style을 적용한다.
// 	 * @param {string} type
// 	 * @param {object} value
// 	 */
// 	applyFormat: function (type, value) {
// 		let styleInfo = this.generateHtmlStyle(type, value),
// 			prop,
// 			range = this.getRange(),
// 			targetList,
// 			i,
// 			getStyleValue = function (prevStyle, newStyleObj) {
// 				let DELIM = " ",
// 					styles = [],
// 					type = newStyleObj.type,
// 					value = newStyleObj.value,
// 					index;
//
// 				if (prevStyle) {
// 					styles = prevStyle.split(DELIM);
// 				}
//
// 				index = styles.indexOf(type);
// 				if (index > -1) {
// 					if (!value) {
// 						styles.splice(index, 1);
// 					}
// 				} else {
// 					if (value) {
// 						styles.push(type);
// 					}
// 				}
//
// 				return styles.join(DELIM);
// 			};
//
// 		if (styleInfo.hasOwnProperty("textAlign")) {
// 			targetList = this.getParasInRange(range, true);
// 		} else {
// 			targetList = this.getSpansInRange(range, true);
// 		}
//
// 		for (i = 0; i < targetList.length; i++) {
// 			for (prop in styleInfo) {
// 				if (styleInfo.hasOwnProperty(prop)) {
// 					if (prop === "textDecoration") {
// 						targetList[i].style[prop] = getStyleValue(targetList[i].style[prop], styleInfo[prop]);
// 					} else {
// 						targetList[i].style[prop] = styleInfo[prop];
// 					}
// 				}
// 			}
// 		}
// 	}
// };

export default FormatRenderer;