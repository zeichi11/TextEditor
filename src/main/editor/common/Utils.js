import $ from 'jquery';
import { CONSTANTS, BROWSER } from "./Constants";

export default {
	/**
	 * init
	 * @param {Object} editor
	 */
	init: function (editor) {
		this.editor = editor;
	},

	/**
	 * browser를 반환한다.
	 * @returns {*}
	 */
	getBrowser: function () {
		const browserProps = [BROWSER.EDGE, BROWSER.OPR, BROWSER.CHROME, BROWSER.FIREFOX, BROWSER.SAFARI, BROWSER.MSIE];
		let browser = {};

		browserProps.forEach(prop => browser[prop] = false);

		if (navigator.userAgent.indexOf(BROWSER.CHROME) > -1 && navigator.userAgent.indexOf(BROWSER.SAFARI) > -1 && navigator.userAgent.indexOf(BROWSER.EDGE) > -1) {
			browser[BROWSER.EDGE] = true;
		}
		if (navigator.userAgent.indexOf(BROWSER.CHROME) > -1 && navigator.userAgent.indexOf(BROWSER.SAFARI) > -1 && navigator.userAgent.indexOf(BROWSER.OPR) > -1) {
			browser[BROWSER.OPR] = true;
		}
		if (navigator.userAgent.indexOf(BROWSER.CHROME) > -1 && navigator.userAgent.indexOf(BROWSER.SAFARI) > -1) {
			browser[BROWSER.CHROME] = true;
		}
		if (navigator.userAgent.indexOf(BROWSER.FIREFOX)) {
			browser[BROWSER.FIREFOX] = true;
		}
		if (navigator.userAgent.indexOf(BROWSER.SAFARI)) {
			browser[BROWSER.SAFARI] = true;
		}
		if (navigator.userAgent.indexOf(BROWSER.MSIE) > -1 || navigator.userAgent.indexOf(BROWSER.WIN) > -1 || navigator.userAgent.indexOf(BROWSER.TRIDENT) > -1) {
			browser[BROWSER.MSIE] = true;
		}

		return browser;
	},

	/**
	 * Selection을 반환한다.
	 * @returns {Selection}
	 */
	getSelection: function () {
		let selection = null;

		if (window.getSelection) {
			selection =  window.getSelection();
		} else {
			selection = document.selection;
		}

		return selection;
	},

	/**
	 * Range를 반환한다.
	 * @param {object} selection
	 * @returns {object}
	 */
	getRange: function (selection){
		let range = null;

		if (!selection) {
			selection = this.getSelection();
		}

		if (selection.getRangeAt) {
			try {
				range = selection.getRangeAt(0);
			} catch (ex) {
				range = null;
			}
		}

		if (!range) {
			range = document.createRange();
		}

		return range;
	},

	/**
	 * 전달받은 selection의 type을 반환한다.
	 * @param {object} selection
	 * @returns {*}
	 */
	getSelectionType: function (selection) {
		let range;

		if (selection.type) {
			return selection.type;
		}

		range = this.getRange(selection);

		if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
			return CONSTANTS.SELECTION_TYPE_CARET;
		}

		return CONSTANTS.SELECTION_TYPE_RANGE;
	},

	/**
	 * HTMLElementArray가 아닌 일반 Array 타입으로 paragraph 리스트를 반환한다.
	 * @param {Element} editor
	 * @returns {Array}
	 */
	getParagraphs: function (editor) {
		let childNodes = editor.childNodes,
			result = [],
			i;

		for (i = 0; i < childNodes.length; i++) {
			result.push(childNodes[i]);
		}

		return result;
	},

	/**
	 * paragraph내 span node들을 반환한다.
	 * @param {Node} para
	 */
	getSpans: function (para) {
		let childNodeList = Array.prototype.slice.call(para.childNodes);
		return childNodeList.filter(function (node) {
			return node.nodeType !== "SPAN";
		});
	},

	/**
	 * 단일 paragraph 구조의 유효성을 확인한다.
	 * @returns {boolean}
	 * @private
	 */
	validateSingleParagraph: function () {
		let paraList = this.editor.getElementsByTagName("P"),
			childNode;

		if (paraList.length) {
			childNode = paraList[0].firstChild;

			if (childNode && childNode.tagName === "SPAN") {
				return true;
			}
		}

		return false;
	},

	/**
	 * 유효한 paragraph 구조인지 여부를 반환한다.
	 * @param targetPara
	 * @returns {boolean}
	 */
	isValidParagraph: function (targetPara) {
		let childNode;
		if (targetPara && targetPara.tagName === "P") {
			childNode = targetPara.firstChild;

			if (childNode && childNode.tagName === "SPAN") {
				return true;
			}
		}

		return false;
	},

	/**
	 * 전달받은 node로부터 name에 해당하는 상위 노드를 반환한다.
	 * @param {Node} node
	 * @param {string} name
	 * @returns {Node}
	 */
	findParentNode : function(node, name) {
		name = name.toUpperCase();
		while (node && node.nodeName !== name) {
			node = node.parentNode;
		}

		return node;
	},

	/**
	 * 전달받은 문자열을 바탕으로 paragraph 구조를 생성하여 반환한다.
	 * @param {string} content
	 * @param {Element} template
	 * @returns {Array}
	 */
	generateParagraph: function (content, template) {
		let NEW_LINE_CHAR = ["\r\n", "\r", "\n"],
			contentLines,
			paraList = [],
			para,
			span,
			i;

		if (template) {
			if (template.nodeName !== "P" || !(template.firstChild && template.firstChild.nodeName === "SPAN")) {
				template = null;
			}
		}

		if (NEW_LINE_CHAR.indexOf(content) > -1) {
			if (template) {
				para = template.cloneNode(true);

				if (template.firstChild) {
					span = template.firstChild.cloneNode(true);
				} else {
					span = document.createElement("SPAN");
				}
			} else {
				para = document.createElement("P");
				span = document.createElement("span");
			}

			span.appendChild(document.createElement("BR"));
			para.appendChild(span);
			paraList.push(para);

		} else {
			contentLines = content.split("\n");

			for (i = 0; i < contentLines.length; i++) {
				contentLines[i] = contentLines[i].replace(/(?:\r\n|\r|\n)/g, "");

				if (template) {
					para = template.cloneNode(false);

					if (template.firstChild) {
						span = template.firstChild.cloneNode(false);
					} else {
						span = document.createElement("SPAN");
					}
				} else {
					para = document.createElement("P");
					span = document.createElement("span");
				}

				if (contentLines[i].length > 0 && contentLines[i] !== "") {
					contentLines[i] = contentLines[i].replace(/\t/g, "");
					span.appendChild(document.createTextNode(contentLines[i]));

				} else {
					span.appendChild(document.createElement("BR"));
				}

				para.appendChild(span);
				paraList.push(para);
			}
		}

		return paraList;
	},

	/**
	 * 전달받은 paragraph, span 정보로 template paragraph를 생성한다.
	 * @param {Element} para
	 * @param {Element} span
	 * @returns {*}
	 * @private
	 */
	generateTemplateParagraph: function (para, span) {
		let templatePara = para.cloneNode(false),
			templateSpan = span.cloneNode(false);

		templatePara.appendChild(templateSpan);

		return templatePara;
	},

	/**
	 * range 정보의 startContainer, endContainer 정보로 paragraph, span, textNode를 찾아 반환한다.
	 * @param {object} range
	 * @returns {*}
	 */
	getTextRangeState: function (range) {
		let textRangeState = {},
			startRangeState,
			endRangeState,
			getRangeState = function (container, offset) {
				let rangeInfo = {},
					paraList,
					spanList;

				rangeInfo.textNode = container.nodeType === CONSTANTS.NODE_TYPE_TEXT ? container : $(container).contents().filter(function () {
					return this.nodeType === CONSTANTS.NODE_TYPE_TEXT;
				})[0];

				if (rangeInfo.textNode) {
					rangeInfo.span = rangeInfo.textNode.parentNode;
				} else {
					if (container.nodeName === "SPAN") {
						rangeInfo.span = container;

					} else if (container.nodeName === "BR") {
						rangeInfo.span = container.parentNode;

					} else if (container.nodeName === "P") {
						rangeInfo.sPara = container;
						spanList = container.getElementsByTagName("SPAN");

						if (spanList.length) {
							rangeInfo.sSpan = spanList[0];
						}

						return rangeInfo;
					}
					if (container.nodeName === "DIV") {
						paraList = container.getElementsByTagName("P");

						if (paraList.length) {
							rangeInfo.sPara = paraList[0];
							spanList = container.getElementsByTagName("SPAN");

							if (spanList.length) {
								rangeInfo.sSpan = spanList[0];
							}
						}

						return rangeInfo;
					}
				}

				rangeInfo.para = rangeInfo.span.parentNode;
				rangeInfo.offset = offset;

				return rangeInfo;
			};

		if (!range) {
			return null;
		}

		startRangeState = getRangeState(range.startContainer, range.startOffset);
		endRangeState = getRangeState(range.endContainer, range.endOffset);

		textRangeState.sText = startRangeState.textNode;
		textRangeState.sSpan = startRangeState.span;
		textRangeState.sPara = startRangeState.para;
		textRangeState.sOffset = startRangeState.offset;

		textRangeState.eText = endRangeState.textNode;
		textRangeState.eSpan = endRangeState.span;
		textRangeState.ePara = endRangeState.para;
		textRangeState.eOffset = endRangeState.offset;

		return textRangeState;
	},

	/**
	 * range 정보를 담은 객체를 반환한다.
	 * @param {Element} startContainer
	 * @param {number} startOffset
	 * @param {Element} endContainer
	 * @param {number} endOffset
	 */
	generateRangeInfo: function (startContainer, startOffset, endContainer, endOffset) {
		let rangeInfo = {};
		rangeInfo.startContainer = startContainer;
		rangeInfo.startOffset = startOffset;
		rangeInfo.endContainer = startContainer;
		rangeInfo.endOffset = startOffset;

		if (endContainer && endOffset > -1) {
			rangeInfo.endContainer = endContainer;
			rangeInfo.endOffset = endOffset;
		}

		return rangeInfo;
	},

	/**
	 * 전달받은 2개의 paragraph를 하나의 paragraph로 구성하여 반환한다.
	 * @param {Element} targetPara
	 * @param {Element} targetSpan
	 * @param {number} offset
	 * @param {Element} newPara
	 * @returns {*}
	 * @private
	 */
	joinParagraph: function (targetPara, targetSpan, offset, newPara) {
		let spanList,
			textContent = "",
			elCursor,
			i;

		if ((targetSpan && targetSpan.nodeName === "SPAN") && (newPara && newPara.nodeName === "P")) {
			spanList = newPara.getElementsByTagName("SPAN");

			if (spanList.length) {
				textContent = targetSpan.textContent;

				if (spanList.length === 1) {
					targetSpan.textContent = textContent.substring(0, offset) + spanList[0].textContent + textContent.substring(offset, textContent.length);

				} else {
					for (i = 0; i < spanList.length; i++) {
						if (i === 0) {
							targetSpan.textContent = textContent.substring(0, offset) + spanList[i].textContent;

							// 대상 span 뒤에 다른 span이 존재하는 경우 해당 span을 삽입 기준으로 삼는다.
							if (targetSpan.nextSibling) {
								elCursor = targetSpan.nextSibling;
							}

							continue;

						} else if (i === spanList.length - 1) {
							spanList[i].textContent = spanList[i].textContent + textContent.substring(offset, textContent.length);
						}

						if (elCursor) {
							targetPara.insertBefore(spanList[i], elCursor);
						} else {
							targetPara.appendChild(spanList[i]);
						}
					}
				}
			}
		}

		return targetPara;
	},

	/**
	 * 현재 Editor 상태(내용, 셀렉션 정보)를 가져온다.
	 * @param {object} range
	 * @returns {*[]}
	 */
	captureEditorState: function (range) {
		let editorClone = this.editor.cloneNode(false),
			textRangeState = this.getTextRangeState(range),
			contents = this.editor.childNodes,
			startTarget,
			endTarget,
			para,
			span,
			spanList,
			newRange,
			i, j;

		for (i = 0; i < contents.length; i++) {
			para = contents[i].cloneNode(false);
			spanList = contents[i].getElementsByTagName("SPAN");

			for (j = 0; j < spanList.length; j++) {
				span = spanList[j].cloneNode(true);
				para.appendChild(span);

				if (spanList[j] === textRangeState.sSpan) {
					startTarget = span.firstChild; // textNode
					if (!startTarget) {
						startTarget = span;
					}
				}

				if (spanList[j] === textRangeState.eSpan) {
					endTarget = span.firstChild; // textNode
					if (!endTarget) {
						endTarget = span;
					}
				}
			}

			editorClone.appendChild(para);
		}

		newRange = this.generateRangeInfo(startTarget, textRangeState.sOffset, endTarget, textRangeState.eOffset);

		return [editorClone, newRange];
	},

	/**
	 * 전달받은 paragraphList와 range 정보를 바탕으로 현재 editor 내용과 조합한 결과를 반환한다.
	 * @param {Array} contentParaList
	 * @param {object} range
	 * @private
	 */
	combineContents: function (contentParaList, range) {
		let editorState = this.captureEditorState(range),
			editorClone,
			rangeClone,
			textRangeState,
			startContainer,
			endContainer,
			startOffset,
			endOffset,
			startPara,
			startSpan,
			endPara,
			endSpan,
			elCursor,
			joinedPara,
			newRange,
			childNodes,
			breakable = true,
			para,
			span,
			text,
			i;

		if (!contentParaList || contentParaList.length === 0) {
			return;
		}

		if (!editorState) {
			return;
		}

		editorClone = editorState[0];
		rangeClone = editorState[1];
		textRangeState = this.getTextRangeState(rangeClone);

		startSpan = textRangeState.sSpan;
		startPara = textRangeState.sPara;
		startOffset = textRangeState.sOffset;
		endOffset = textRangeState.eOffset;

		// break para
		// 붙여넣을 내용이 여러 라인인 경우에는 현재 커서가 위치한 라인을 커서 위치를 기준으로 다른 라인으로 분리 후 처리한다.
		if (contentParaList.length > 1) {
			childNodes = startPara.childNodes;
			if (childNodes.length === 0) {
				breakable = false;
			} else {
				// 공백 라인인 경우(startSpan 이외에 다른 span이 없고 startSpan의 내용이 없는 경우)
				if (childNodes[0] === startSpan) { // startSpan이 대상 라인의 첫번째 span
					if (childNodes.length === 1 && startSpan.textContent.length === 0) {
						breakable = false;
					}
				}

				// 라인의 끝에 커서가 위치한 경우
				if (childNodes[childNodes.length - 1] === startSpan) {
					if (startSpan.textContent.length === startOffset) {
						breakable = false;
					}
				}
			}

			if (breakable) {
				span = startSpan.cloneNode(false);
				para = startPara.cloneNode(false);

				if (startPara.nextSibling) {
					editorClone.insertBefore(para, startPara.nextSibling);
				} else {
					editorClone.appendChild(para);
				}

				text = startSpan.textContent;
				startSpan.textContent = text.substring(0, textRangeState.sOffset);

				text = text.substring(textRangeState.sOffset, text.length);
				// text의 내용이 존재하는 경우에만 span으로 추가
				if (text.length) {
					span.textContent = text;
					para.appendChild(span);
				}

				while (startSpan.nextSibling) {
					para.appendChild(startSpan.nextSibling);
				}
			}
		}

		for (i = 0; i < contentParaList.length; i++) {
			if (i === 0) {
				joinedPara = this.joinParagraph(startPara, startSpan, startOffset, contentParaList[0]);
				endPara = joinedPara;
				endSpan = endPara.lastChild;

				if (endSpan.firstChild && endSpan.firstChild.nodeType === CONSTANTS.NODE_TYPE_TEXT) {
					endContainer = endSpan.firstChild;
					endOffset = startOffset + contentParaList[0].textContent.length;
				}

				if (joinedPara.nextSibling) {
					elCursor = joinedPara.nextSibling;
				}

			} else {
				if (elCursor) {
					editorClone.insertBefore(contentParaList[i], elCursor);
					endPara = elCursor.previousSibling;

				} else {
					editorClone.appendChild(contentParaList[i]);
					endPara = editorClone.lastChild;
				}

				endSpan = endPara.lastChild;

				if (endSpan.firstChild && endSpan.firstChild.nodeType === CONSTANTS.NODE_TYPE_TEXT) {
					endContainer = endSpan.firstChild;
					endOffset = endSpan.textContent.length;
				}
			}
		}

		if (endContainer === undefined || endOffset === undefined) {
			endContainer = startSpan;
			endOffset = 0;
		}

		startContainer = endContainer;
		startOffset = endOffset;

		newRange = this.generateRangeInfo(startContainer, startOffset, endContainer, endOffset);

		return [this.getParagraphs(editorClone), newRange];
	},

	/**
	 * window selection의 range 영역을 삭제하고 range를 다시 설정하여 반환한다.
	 * @param {object} selection
	 * @param {object} range
	 * @returns {*}
	 * @private
	 */
	deleteSelectionRange: function (selection, range) {
		let startContainer = range.startContainer,
			startOffset = range.startOffset,
			endContainer = range.endContainer,
			endOffset = range.endOffset,
			selectionType = this.getSelectionType(selection),
			startPara,
			startSpan,
			endPara,
			childNodeList,
			spanList,
			i;

		if (selectionType === CONSTANTS.SELECTION_TYPE_RANGE) {
			if (startContainer === endContainer && startOffset === endOffset) {
				return range;
			}

			startPara = this.findParentNode(startContainer, "P");
			startSpan = this.findParentNode(startContainer, "SPAN");
			endPara = this.findParentNode(endContainer, "P");

			if (startPara.nodeName !== "P" && endPara.nodeName !== "P") {
				return;
			}

			range.deleteContents();

			if (startPara && startPara !== endPara) {
				childNodeList = Array.prototype.slice.call(endPara.childNodes);
				spanList = childNodeList.filter(function (node) {
					return node.textContent !== "";
				});

				for (i = 0; i < spanList.length; i++) {
					startPara.appendChild(spanList[i]);
				}

				this.editor.removeChild(endPara);
			}

			if (startContainer.nodeType === CONSTANTS.NODE_TYPE_TEXT) {
				if (startSpan.firstChild === startContainer) {
					if (startContainer.textContent.length === 0 && startOffset === 0) {
						if (!startSpan.nextSibling) {
							startContainer = startSpan;

							while (startContainer.firstChild) {
								startContainer.removeChild(startContainer.firstChild);
							}

							startContainer.appendChild(document.createElement("BR"));

						} else {
							startContainer = startSpan.nextSibling;
						}
					}
				}
			}

			range = document.createRange();
			range.setStart(startContainer, startOffset);
			selection.removeAllRanges();
			selection.addRange(range);

			return selection.getRangeAt(0);
		}

		return range;
	},

	/**
	 * 문자열의 양쪽 따옴표를 제거하고 반환
	 * @param {string} str
	 * @returns {*}
	 */
	removeQuotationMarks: function (str) {
		let result = str,
			regExp = /['"][a-zA-Z0-9]*['"]?/;

		if (regExp.test(str)) {
			result = str.substring(1, (str.length - 1));
		}

		return result;
	},

	/**
	 * Emu를 Px로 변환한다.
	 * @param val
	 * @param {=number} digits - 변환 결과의 소수점 자리수
	 * @returns {*}
	 */
	emuToPx: function (val, digits) {
		if (!digits) {
			digits = 0;
		}

		return val ? CommonFrameUtil.getUnits(val + "emu", digits, "px").pixel : 0;
	},

	/**
	 * Px를 Emu로 변환한다.
	 * @param val
	 * @returns {*}
	 */
	pxToEmu: function (val) {
		return val ? CommonFrameUtil.getUnits(val + "px", 0, "emu").emu : 0;
	}
};




