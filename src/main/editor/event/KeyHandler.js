import { CMD_TYPE, KEY_CODE } from '../common/Constants';
import Utils from '../common/Utils';
import Config from '../common/Config';
import UndoRedo from '../command/UndoRedo';

const KeyHandler = function () {
	const MODIFIER_KEY_INDEX_MAP = {
			"ctrl": 0,
			"alt": 1,
			"shift": 2,
		};

	let _modKeyInfo = [],
		_textEditor,
		_commandExecutor,
		_headPara,
		_headSpan,
		_isCompositionStart,
		_needToCapture = true;

	/**
	 * textEditor Command을 실행한다.
	 * @param {string} type
	 * @param {object} value
	 * @param {object} range
	 * @private
	 */
	function _executeCommand(type, value, range) {
		_commandExecutor.execCommand(type, value, range);
	}

	/**
	 * Content Command을 실행한다.
	 * @param cmd
	 * @param rCmd
	 * @private
	 */
	function _execContentCommand(cmd, rCmd) {
		_commandExecutor.execContentCommand(cmd, rCmd, false);
	}

	/**
	 * 현재 편집 내용을 push하고 수행한다.
	 * @private
	 */
	function _pushContentCommand() {
		let editorStateCache = _textEditor.getEditorStateCache(),
			selection = Utils.getSelection(),
			currEditorState,
			currContents,
			prevContents,
			prevRangeInfo,
			currRangeInfo,
			cmdValue,
			rCmdValue,
			range,
			cmd,
			rCmd;

		if (selection) {
			range = Utils.getRange(selection);

			if (range) {
				currEditorState = Utils.captureEditorState(range);
				currContents = Utils.getParagraphs(currEditorState[0]);
				currRangeInfo = currEditorState[1];

				cmdValue = {"contents": currContents, "needToRender": false};
				cmd = {"type": CMD_TYPE.CONTENT, "value": cmdValue, "range": currRangeInfo};

				if (editorStateCache) {
					prevContents = editorStateCache[0];
					prevRangeInfo = editorStateCache[1];

					rCmdValue = {"contents": prevContents, "needToRender": false};
					rCmd = {"type": CMD_TYPE.CONTENT, "value": rCmdValue, "range": prevRangeInfo};
				}

				_execContentCommand(cmd, rCmd);
				_textEditor.setEditorStateCache(currContents, currRangeInfo);
			}
		}
	}

	/**
	 * shift, ctrl, alt 키 입력 정보를 설정한다.
	 * @param {object} event
	 * @returns {Array}
	 * @private
	 */
	function _setModifierKeys(event) {
		_modKeyInfo[MODIFIER_KEY_INDEX_MAP.ctrl] = Config.osName === "MacOS" ? event.metaKey : event.ctrlKey;
		_modKeyInfo[MODIFIER_KEY_INDEX_MAP.alt] = event.altKey;
		_modKeyInfo[MODIFIER_KEY_INDEX_MAP.shift] = event.shiftKey;
	}

	/**
	 * contentEditable의 기본 단축키 여부 반환
	 * @param {object} event
	 * @private
	 */
	function _isCommandShortCut(event) {
		let  keyCode = event.keyCode;

		if (_modKeyInfo[MODIFIER_KEY_INDEX_MAP.ctrl] && !_modKeyInfo[MODIFIER_KEY_INDEX_MAP.alt] &&
			!_modKeyInfo[MODIFIER_KEY_INDEX_MAP.shift]) {
			if (keyCode === KEY_CODE.B || keyCode === KEY_CODE.U ||
				keyCode === KEY_CODE.I || keyCode === KEY_CODE.F ||
				keyCode === KEY_CODE.S) {
				return true;
			}
		}

		return false;
	}

	/**
	 * undo, redo 단축키 입력을 처리한다.
	 * @param {object} event
	 * @returns {boolean}
	 * @private
	 */
	function _executeUndoRedoShortCut(event) {
		let execResult = false;
		if (event.metaKey || event.ctrlKey) {
			if (Config.osName === "MacOS") {
				if (!event.altKey) {
					if (event.metaKey && event.keyCode === KEY_CODE.Z) {
						if (!event.shiftKey) { // redo
							if (UndoRedo.isUndoable()) {
								UndoRedo.undo();
								execResult = true;
							}
						} else { // undo
							if (UndoRedo.isRedoable()) {
								UndoRedo.redo();
								execResult = true;
							}
						}
					}
				}
			} else {
				if (!event.altKey) {
					if (event.ctrlKey) {
						if (event.keyCode === KEY_CODE.Z) {
							UndoRedo.undo();
							execResult = true;
						} else if (event.keyCode === KEY_CODE.Y) {
							UndoRedo.redo();
							execResult = true;
						}
					}
				}
			}
		}

		if (execResult) {
			_textEditor.setEditorStateCache(null, null);
		}

		return execResult;
	}

	/**
	 * editor 상태 저장이 필요한 키 이벤트인지 확인하고 처리한다.
	 * @param {object} event
	 * @private
	 */
	function _captureEditorOnKeydown(event) {
		if (event.keyCode === KEY_CODE.BACK_SPACE || event.keyCode === KEY_CODE.DELETE) {
			// let selection = Utils.getSelection(),
			//     range = selection.getRangeAt(0);
			//
			// event.preventDefault();
			// range.startContainer.textContent = range.startContainer.textContent.substring(0, range.startOffset - 1) + range.startContainer.textContent.substring(range.startOffset, range.startContainer.textContent.length);

			_pushContentCommand();
		}
	}

	/**
	 * 내부 복사/잘라내기 처리
	 * @param {boolean} isCopy
	 * @private
	 */
	function _handleInnerCopyCut(isCopy) {
		let cmd = isCopy ? "copy" : "cut",
			textField = document.createElement("textarea"),
			selection,
			range,
			contents,
			childNodes,
			node,
			i;

		function saveSelection() {
			let sel;
			if (window.getSelection) {
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}

			} else if (document.selection && document.selection.createRange) {
				return document.selection.createRange();
			}

			return null;
		}

		function restoreSelection(range) {
			let sel;
			if (range) {
				if (window.getSelection) {
					sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);

				} else if (document.selection && range.select) {
					range.select();
				}
			}
		}

		function getSelectionText(range){
			let value = "";
			if (range) {
				contents = range.cloneContents(); // documentFlagment type
				childNodes = contents.childNodes;

				for (i = 0; i < childNodes.length; i++) {
					node = childNodes[i];

					if (i > 0) {
						if (node.nodeType !== Constants.defaults.NODE_TYPE_TEXT) {
							if (node.tagName === "P") {
								value += "\n";
							}
						}
					}

					value += node.textContent;
				}
			}

			return value;
		}

		range = saveSelection();
		textField.value = getSelectionText(range);
		textField.style.position = "absolute";
		document.body.appendChild(textField);

		if (Config.browser.MSIE) {
			selection = Utils.getSelection();
			if (selection) {
				selection.selectAllChildren(textField);
				document.execCommand(cmd);
				textField.parentNode.removeChild(textField);
			}

		} else {
			textField.select();
			document.execCommand(cmd);
			textField.remove();
		}

		restoreSelection(range);

		if (!isCopy) {
			selection = Utils.getSelection();
			if (selection) {
				range = Utils.getRange(selection);
				if (range) {
					_pushContentCommand();
					Utils.deleteSelectionRange(selection, range);
				}
			}
		}
	}

	/**
	 * editor 상태 저장이 필요한 키 이벤트인지 확인하고 처리한다.
	 * @param {object} event
	 * @private
	 */
	function _captureEditorOnKeyup(event) {
		if (event.metaKey || event.ctrlKey) {
			if (Config.osName === "MacOS") {
				if (!event.altKey) {
					if (event.metaKey && event.keyCode === KEY_CODE.X) {
						_pushContentCommand();
					}
				}
			} else {
				if (!event.altKey) {
					if (event.ctrlKey) {
						if (event.keyCode === KEY_CODE.X) {
							_pushContentCommand();
						}
					}
				}
			}
		} else {
			if (!(event.keyCode === KEY_CODE.META || event.keyCode === KEY_CODE.CTRL)) {
				if (!(event.keyCode >= KEY_CODE.F1 && event.keyCode <= KEY_CODE.F12)) {
					if (event.keyCode === KEY_CODE.SPACE || event.keyCode === KEY_CODE.ENTER) {
						_pushContentCommand();
						_needToCapture = true;

					} else {
						if (_needToCapture) {
							_pushContentCommand();
							_needToCapture = false;
						}
					}
				}

				if (event.keyCode === KEY_CODE.LEFT || event.keyCode === KEY_CODE.RIGHT
					|| event.keyCode === KEY_CODE.DOWN || event.keyCode === KEY_CODE.UP) {
					_textEditor.setEditorStateCache(null, null);
				}
			}
		}
	}

	/**
	 * selection 정보를 업데이트 한다.
	 * @param {object} event
	 * @private
	 */
	function _executeUpdateSelection(event) {
		if (event.keyCode === KEY_CODE.LEFT || event.keyCode === KEY_CODE.RIGHT ||
			event.keyCode === KEY_CODE.DOWN || event.keyCode === KEY_CODE.UP ||
			event.keyCode === KEY_CODE.BACK_SPACE || event.keyCode === KEY_CODE.DELETE ||
			event.keyCode === KEY_CODE.SPACE) {

			let range = Utils.getRange();

			if (range) {
				_executeCommand(CMD_TYPE.SELECTION, {"updateState": true}, range);
			}
		}
	}

	/**
	 * contentEditable 내 단축키 입력 처리
	 * @param {object} event
	 * @private
	 */
	function _executeShortCut(event) {
		let ctrl = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.ctrl],
			alt = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.alt],
			shift = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.shift];

		if (ctrl && !alt && !shift) {
			let keyCode = event.keyCode;

			switch (keyCode) {
				case KEY_CODE.C:
					_handleInnerCopyCut(true);
					return true;
				case KEY_CODE.X:
					_handleInnerCopyCut(false);
					return true;
			}
		}

		return false;
	}

	/**
	 * 복사, 잘라내기 단축키 입력인지 여부를 반환한다
	 * @param {object} event
	 * @private
	 */
	function _isCopyCutShorcut(event) {
		let ctrl = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.ctrl],
			alt = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.alt],
			shift = _modKeyInfo[MODIFIER_KEY_INDEX_MAP.shift];

		if (ctrl && !alt && !shift) {
			let keyCode = event.keyCode;

			if (keyCode === KEY_CODE.C || keyCode === KEY_CODE.X) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 이벤트 전파가 필요한 키 이벤트인지 여부 확인
	 * @param {object} event
	 * @returns {boolean}
	 * @private
	 */
	function _isNeedToPropagate(event) {
		let keyCode = event.keyCode;
		return keyCode === KEY_CODE.ESC || keyCode === KEY_CODE.F10;
	}

	/**
	 * keydown 이벤트 발생 시 텍스트 편집기의 첫번째 문단 정보를 저장한다.
	 * (텍스트 편집기의 내용이 모두 삭제되는 경우 이전의 구조(p > span)을 복구하기 위한 처리)
	 * @private
	 */
	function _updateHeadParagraph() {
		let editor = _textEditor.getEditor(),
			paraList = editor.getElementsByTagName("P");

		if (paraList.length) {
			let childNode = paraList[0].firstChild;

			// p > span 구조인 경우에만 headPara 설정
			if (childNode && childNode.tagName === "SPAN") {
				_headPara = paraList[0].cloneNode();

				while (_headPara.firstChild) {
					_headPara.removeChild(_headPara.lastChild);
				}

				_headSpan = childNode.cloneNode();
				_headSpan.textContent = "";
			}
		}
	}

	/**
	 * keydown 이벤트 핸들러
	 * @param {object} event
	 * @private
	 */
	function _keyDown(event){
		_updateHeadParagraph();

		if (_isNeedToPropagate(event)) {
			return true;
		}

		event.stopImmediatePropagation();

		_setModifierKeys(event);

		if (_executeUndoRedoShortCut(event)) {
			event.preventDefault();
			return;
		}

		// contentEditable execCommand 동작 방지
		if (_isCommandShortCut(event)) {
			event.preventDefault();
		}

		_executeUpdateSelection(event);

		// 단축키 입력 시 ctrl, alt, shift 키를 누른 상태로 키 입력 시에는 keyup 이벤트에서 reset 처리 불가
		// ctrl, alt, shift 키가 눌린 상태로 keydown 이벤트가 발생 시에는 reset 처리 여부 확인하도록 코드 추가
		if (_modKeyInfo[MODIFIER_KEY_INDEX_MAP.ctrl] || (_modKeyInfo[MODIFIER_KEY_INDEX_MAP.alt] || _modKeyInfo[MODIFIER_KEY_INDEX_MAP.shift])) {
			if (_isCopyCutShorcut(event)) {
				let range = Utils.getRange();
				if (range) {
					_executeCommand(CMD_TYPE.RESET, {}, range);
				}
			}
		}

		_captureEditorOnKeydown(event);

		if (_executeShortCut(event)) {
			event.preventDefault();
			return false;
		}
	}

	/**
	 * keyup 이벤트 핸들러
	 * @param {object} event
	 * @private
	 */
	function _keyUp(event){
		event.stopImmediatePropagation();

		if (!_isCompositionStart) {
			let range = Utils.getRange();
			if (range) {
				_executeCommand(CMD_TYPE.RESET, {}, range);
			}
			_captureEditorOnKeyup(event);
		}
	}

	/**
	 * compositionstart 이벤트 핸들러
	 * @private
	 */
	function _compositionStart() {
		_isCompositionStart = true;
	}

	/**
	 * compositionend 이벤트 핸들러
	 * @private
	 */
	function _compositionEnd(event) {
		let range;
		if (_isCompositionStart) {
			range = Utils.getRange();
			if (range) {
				_executeCommand(CMD_TYPE.RESET, {}, range);
			}
			_captureEditorOnKeyup(event);
		}

		_isCompositionStart = false;
	}

	/**
	 * paste 이벤트 핸들러
	 * @param {object} event
	 * @private
	 */
	function _paste(event) {
		event.preventDefault();
		event.stopImmediatePropagation();

		let text = "";

		if (Config.browser.MSIE) {
			if (event.originalEvent) {
				text = event.originalEvent.view.clipboardData.getData("text");
			} else {
				text = window.clipboardData.getData("Text");
			}

		} else {
			text = (event.originalEvent || event).clipboardData.getData("text/plain");
		}

		if (text.length === 0) {
			return;
		}

		let selection = Utils.getSelection();

		if (selection) {
			let range = Utils.getRange(selection);

			if (range) {
				let textRangeState = Utils.getTextRangeState(range),
					currEditorState = Utils.captureEditorState(range),
					prevContents = Utils.getParagraphs(currEditorState[0]),
					prevRangeInfo = currEditorState[1],
					templatePara,
					contentParaList,
					combineResult,
					contents,
					value,
					rValue,
					cmd,
					rCmd;

				range = Utils.deleteSelectionRange(selection, range);

				if (textRangeState.sSpan) {
					templatePara = Utils.generateTemplateParagraph(textRangeState.sPara, textRangeState.sSpan);

				} else {
					templatePara = textRangeState.sPara;
				}

				contentParaList = Utils.generateParagraph(text, templatePara);

				combineResult = Utils.combineContents(contentParaList, range);
				contents = combineResult[0];
				range = combineResult[1];

				value = {"contents": contents, "needToRender": true};
				cmd = {"type": CMD_TYPE.CONTENT, "value": value, "range": range};

				rValue = {"contents": prevContents, "needToRender": true};
				rCmd = {"type": CMD_TYPE.CONTENT, "value": rValue, "range": prevRangeInfo};

				_execContentCommand(cmd, rCmd);
			}
		}
	}

	return {
		/**
		 * init
		 * @param {object} textEditor
		 * @param {object} commandExecutor
		 * @param {Element} container
		 */
		init: function (textEditor, commandExecutor, container) {
			_textEditor = textEditor;
			_commandExecutor = commandExecutor;

			this.bind(container);
		},

		/**
		 * bind key events
		 * @param {Element} container
		 */
		bind: function (container) {
			let editorWrap = container.firstChild,
				target = editorWrap.firstChild;

			target.addEventListener("compositionstart", _compositionStart);
			target.addEventListener("compositionend", _compositionEnd);
			target.addEventListener("keydown", _keyDown);
			target.addEventListener("keyup", _keyUp);
			target.addEventListener("paste", _paste);
		}
	};
}();

export default KeyHandler;