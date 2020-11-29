import {NAMES, DOC_EVENT, CONSTANTS, CMD_TYPE} from '../common/Constants';
import TextRenderer from './renderer/TextRenderer';
import Config from '../common/Config';
import Utils from '../common/Utils';
import EditorEventPublisher from '../EditorEventPublisher';

class EditorView {
	/**
	 * constructor
	 * @param {Element} containerEl
	 */
	constructor(containerEl) {
		this._editorWrapEl = document.createElement('DIV');
		this._editorWrapEl.classList.add(NAMES.editorWrap);

		this._editorEl = document.createElement('DIV');
		this._editorEl.setAttribute('contentEditorble', 'true');
		this._editorEl.setAttribute('spellcheck', false);

		this._editorWrapEl.appendChild(this._editorEl);

		try {
			containerEl.appendChild(this._editorWrapEl);

		} catch (exception){
			throw exception;
		}

		this._textRenderer = new TextRenderer();

		EditorEventPublisher.register(this);

		this._selectedPara = null;
		this._selectedSpan = null;
		this._selectedOffset = null;

		this._attrInfo = null;
	}

	/**
	 * 현재 selection에 대한 정보를 업데이트한다.
	 * @param {object} range
	 * @private
	 */
	_updateSelectionInfo(range) {
		let startContainer = range.startContainer,
			targetPara,
			targetSpan,
			childNode;

		if (!startContainer) {
			return;
		}

		if (startContainer === this._editorEl) {
			targetPara = this._editorEl.getElementsByTagName('P')[0];
			childNode = targetPara.firstChild;

			if (childNode && childNode.tagName === 'SPAN') {
				targetSpan = childNode;
			}

		} else {
			targetPara = Utils.findParentNode(startContainer, 'P');
			targetSpan = Utils.findParentNode(startContainer, 'SPAN');
		}

		if (targetPara && targetSpan) {
			this._selectedPara = targetPara;
			this._selectedSpan = targetSpan;
			this._selectedOffset = range.startOffset;
		}
	}

	/**
	 * 텍스트 셀렉션을 렌더링한다.
	 * @param {Element} startContainer
	 * @param {number} startOffset
	 * @param {Element} endContainer
	 * @param {number} endOffset
	 * @private
	 */
	_updateSelection(startContainer, startOffset, endContainer, endOffset) {
		let selection = Utils.getSelection(),
			range;

		if (selection) {
			range = Utils.getRange(selection);

			if (range) {
				range.setStart(startContainer, startOffset);

				if (endContainer) {
					range.setEnd(endContainer, endOffset);
				} else {
					range.setEnd(startContainer, startOffset);
				}

				selection.removeAllRanges();
				selection.addRange(range);

				this._updateSelectionInfo(range);
			}
		}
	}

	/**
	 * clear textEditor
	 * @private
	 */
	_clearEditor() {
		this._editorEl.textContent = '';
	}

	/**
	 * render contents
	 * @param {object} value
	 * @param {object} range
	 * @private
	 */
	_renderContents(value, range) {
		let contents,
			i;

		if (value.contents) {
			contents = value.contents;

			this._clearEditor();

			for (i = 0; i < contents.length; i++) {
				this._editorEl.appendChild(contents[i]);
			}
		}

		this._updateSelection(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
	}

	/**
	 * range 위치에 지정된 텍스트를 입력한다.
	 * @param {string} text
	 * @param {object} range
	 * @private
	 */
	_insertText(text, range) {
		let targetSpan,
			childNode,
			textContent,
			caretOffset;

		if (!range) {
			targetSpan = this._selectedSpan;
			caretOffset = this._selectedOffset;
		} else {
			/* TODO 텍스트 셀렉션 영역이 없는 경우 처리 */
			// targetSpan = range.startContainer;
			// find startContainer span
			console.log('');
		}

		if (targetSpan) {
			childNode = targetSpan.firstChild;
			if (!childNode || childNode.nodeType !== CONSTANTS.NODE_TYPE_TEXT) {
				if (childNode) {
					targetSpan.removeChild(childNode);
				}
				childNode = document.createTextNode('');
				caretOffset = 0;

				targetSpan.appendChild(childNode);
			}

			textContent = childNode.nodeValue;
			childNode.nodeValue = textContent.substr(0, caretOffset) + text + textContent.substr(caretOffset);

			this._updateSelection(childNode, caretOffset + text.length, childNode, caretOffset + text.length);
		}
	}

	/**
	 * textEditorWrap에 css class를 적용한다.
	 * @param {Array} classList
	 * @private
	 */
	_applyClass(classList) {
		let i = 0;
		if (classList) {
			for (i = 0; i < classList.length; i++) {
				this._editorWrapEl.classList.add(classList[i]);
			}
		}
	}

	/**
	 * textEditorWrap에 설정된 css class들을 제거한다.
	 * @private
	 */
	_clearClass() {
		let classList = this._editorWrapEl.classList,
			i;
		for (i = 0; i < classList.length; i++) {
			if (classList[i] !== TextEditorConst.name.editorWrap) {
				this._editorWrapEl.classList.remove(classList[i]);
			}
		}
	}

	/**
	 * textEditorWrap에 style 정보를 설정한다.
	 * @param {object} styleInfo
	 * @private
	 */
	_applyStyle(styleInfo) {
		let key,
			value;

		for (key in styleInfo) {
			if (styleInfo.hasOwnProperty(key)) {
				value = '';

				if (this._editorWrapEl.style[key]) {
					value = this._editorWrapEl.style[key] + ' ';
				}

				this._editorWrapEl.style[key] = value + styleInfo[key];
			}
		}
	}

	/**
	 * textEditorWrap에 style 정보를 제거한다.
	 * @private
	 */
	_clearStyle() {
		this._editorWrapEl.removeAttribute('style');
	}

	/**
	 * attribute 정보를 설정한다.
	 * @param {object} attr
	 * @private
	 */
	_applyAttr(attr) {
		let key;
		for (key in attr) {
			if (attr.hasOwnProperty(key)) {
				this._editorWrapEl.setAttribute(key, attr[key]);
			}
		}
	}

	/**
	 * attribute 정보를 제거한다.
	 * @private
	 */
	_clearAttr() {
		let key;
		if (this._attrInfo) {
			if (this._attrInfo.hasOwnProperty('attr')) {
				for (key in this._attrInfo.attr) {
					if (this._attrInfo.attr.hasOwnProperty(key)) {
						this._editorWrapEl.removeAttribute(key);
					}
				}
			}
		}
	}

	/**
	 * focus를 설정하고 커서 위치를 설정한다.(추후 range type 설정 추가)
	 * @private
	 */
	_focus() {
		let paraList,
			spanList,
			para,
			span,
			container;

		this._editorEl.focus();

		if (this._selectedSpan) {
			this._updateSelection(this._selectedSpan.firstChild, this._selectedOffset, this._selectedSpan.firstChild, this._selectedOffset);

		} else {
			paraList = this._editorEl.getElementsByTagName('P');
			if (paraList.length) {
				para = paraList[0];
				spanList = para.getElementsByTagName('SPAN');
				if (spanList.length) {
					span = spanList[0];
					container = span;
				} else {
					container = para;
				}
			} else {
				container = this._editorEl;
			}

			this._updateSelection(container, 0, container, 0);
		}
	}

	/**
	 * editor의 포커스를 제거한다.
	 * @private
	 */
	_blur() {
		this._editorEl.blur();
	}

	/**
	 * 유효하지 않은 구조인 경우 입력된 내용을 바탕으로 구조를 다시 생성한다.
	 * @param {object} range
	 * @private
	 */
	_restructure(range) {
		let startContainer = range.startContainer,
			targetPara,
			targetNode,
			textNode,
			span,
			childNodes,
			i;

		targetPara = Utils.findParentNode(startContainer, 'P');

		if (!Utils.isValidParagraph(targetPara)) {
			if (!targetPara) {
				if (this._editorEl.getElementsByTagName('P').length === 0) {
					if (this._selectedPara) {
						targetPara = this._selectedPara.cloneNode(false);
						this._editorEl.appendChild(targetPara);

					} else {
						return;
					}
					// firefox와 같이 paragraph없이 contenteditable 내에 텍스트가 입력된 상태가 존재하는 경우 현재 커서 위치의 node를 타겟으로 처리
					targetNode = startContainer;
				} else {
					return;
				}
			} else {
				// chrome과 같이 paragraph 내에 텍스트가 입력된 상태인 경우의 처리
				targetNode = targetPara.firstChild;
			}

			if (targetNode) { // 탐색할 node가 있는 경우
				if (targetNode.nodeType === TextEditorConst.defaults.NODE_TYPE_TEXT) {
					textNode = targetNode;

				} else {
					while (targetNode.firstChild) {
						targetNode = targetNode.firstChild;
					}

					if (targetNode.nodeType === TextEditorConst.defaults.NODE_TYPE_TEXT) {
						textNode = targetNode;

					} else {
						targetNode = document.createElement('BR');
					}
				}
			} else { // 탐색할 node가 없는 경우
				targetNode = document.createElement('BR');
			}

			// 텍스트 편집기 내 내용 모두 삭제
			while (targetPara.firstChild) {
				targetPara.removeChild(targetPara.lastChild);
			}

			// para = this._selectedPara.cloneNode(true);
			span = this._selectedSpan.cloneNode(false);

			if (textNode) {
				span.appendChild(textNode);
			} else {
				if (targetNode && targetNode.tagName === 'BR') {
					span.appendChild(targetNode);
				}
			}

			targetPara.appendChild(span);
			// this._editorEl.appendChild(para);

			range = document.createRange();

			if (textNode) {
				range.selectNodeContents(textNode);

			} else {
				if (targetNode && targetNode.tagName === 'BR') {
					range.setStart(span, 0);
					range.setEnd(span, 0);
				}
			}

			if (Config.browser.MSIE) {
				childNodes = this._editorEl.childNodes;
				i = 0;

				while (i < childNodes.length) {
					if (childNodes[i].nodeType === 3) {
						this._editorEl.removeChild(childNodes[i]);
						continue;
					} else {
						if (childNodes[i].nodeName === 'DIV' || childNodes[i].nodeName === 'BR') {
							this._editorEl.removeChild(childNodes[i]);
							continue;
						}
					}

					i++;
				}
			}
		}

		this._updateSelection(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
	}

	/**
	 * textEditor의 위치, 크기를 설정한다.
	 * @param {object} rectInfo
	 * @private
	 */
	_setEditorRect(rectInfo) {
		if (rectInfo) {
			this._editorWrapEl.style.top = rectInfo.y + 'px';
			this._editorWrapEl.style.left = rectInfo.x + 'px';
			this._editorWrapEl.style.width = rectInfo.w + 'px';
			this._editorWrapEl.style.height = rectInfo.h + 'px';
		}
	}

	/**
	 * textEditor의 여백을 설정한다.
	 * @param {object} marginInfo
	 * @private
	 */
	_setMargin(marginInfo) {
		this._editorWrapEl.style.paddingTop = marginInfo.top + 'px';
		this._editorWrapEl.style.paddingLeft = marginInfo.left + 'px';
		this._editorWrapEl.style.paddingRight = marginInfo.right + 'px';
		this._editorWrapEl.style.paddingBottom = marginInfo.bottom + 'px';
	}

	/**
	 * textEditorWrap에 css class를 적용한다.
	 * @param {Array} classList
	 * @private
	 */
	_applyClassStyle(classList) {
		let i = 0;
		if (classList) {
			for (i = 0; i < classList.length; i++) {
				this._editorWrapEl.classList.add(classList[i]);
			}
		}
	}

	/**
	 * show
	 * @private
	 */
	_show() {
		this._editorWrapEl.style.display = 'block';
	}

	/**
	 * hide
	 * @private
	 */
	_hide() {
		this._editorWrapEl.style.display = 'none';
	}

	// /**
	//  * render
	//  * @param {string} contents
	//  * @param {object} textRect
	//  * @param {object} attrInfo
	//  * @param {object} marginInfo
	//  * @private
	//  */
	// _render(contents, textRect, attrInfo, marginInfo) {
	// 	if (this._editorEl) {
	// 		//TODO innerHTML 코드 삭제
	// 		this._editorEl.innerHTML = contents;
	// 	}
	//
	// 	if (attrInfo) {
	// 		this._attrInfo = attrInfo;
	//
	// 		if (attrInfo.hasOwnProperty('classList') && attrInfo.classList.length) {
	// 			_applyClass(attrInfo.classList);
	// 		}
	//
	// 		if (attrInfo.hasOwnProperty('style') && attrInfo.style) {
	// 			_applyStyle(attrInfo.style);
	// 		}
	//
	// 		if (attrInfo.hasOwnProperty('attr') && attrInfo.attr) {
	// 			_applyAttr(attrInfo.attr);
	// 		}
	// 	}
	//
	// 	if (textRect) {
	// 		_setTextRect(textRect);
	// 	}
	//
	// 	if (marginInfo) {
	// 		_setMargin(marginInfo);
	// 	}
	// }

	/**
	 * render
	 * @param {object} body
	 * @private
	 */
	_render(body) {
		if (body) {
			let ps = body.ps;
			let bodyPr = body.bodyPr;

			this._textRenderer.render(this._editorEl, ps, bodyPr);
		}
	}

	/**
	 * clear
	 * @private
	 */
	_clear() {
		this._render('', null, null);

		this._clearClass();
		this._clearStyle();
		this._clearAttr();
		this._selectedPara = null;
		this._selectedSpan = null;
		this._selectedOffset = -1;
	}

	/**
	 * render Editor Event
	 * @param {string} type
	 * @param {object} value
	 * @private
	 */
	notify(type, value) {
		switch(type) {
			case DOC_EVENT.OPEN:
				this._render(value);
				break;
			case DOC_EVENT.RESIZE:
				this._setEditorRect(value);
				break;
			case CMD_TYPE.RESET:
				this._restructure(value);
				break;
			case CMD_TYPE.CONTENT:
				this._renderContents(value.content, value.range);
				break;
			case CMD_TYPE.TEXT:
				this._insertText(value.text, value.range);
				break;
			case CMD_TYPE.SELECTION:
				this._updateSelectionInfo(value);
				break;
		}
	}

	/**
	 * render
	 */
	render(body) {
		this._render(body);
	}

	/**
	 * show editor
	 */
	show() {
		this._show();
	}

	/**
	 * hide editor
	 */
	hide() {
		this._hide();
	}
	/**
	 * editor의 내용을 초기화한다.
	 */
	clear() {
		this._clear();
	}

	/**
	 *
	 */
	applyFormat() {
		console.log('applyFormat');
	}

}

export default EditorView;