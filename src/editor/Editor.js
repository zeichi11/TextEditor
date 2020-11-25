import EditorView from 'view/EditorView';
import KeyHandler from 'event/KeyHandler';
import MouseHandler from 'event/MouseHandler';
import CommandExecutor from 'command/CommandExecutor';
import UndoRedo from 'command/UndoRedo';
import Document from 'model/Document';
import Utils from 'common/Utils';
import { MESSAGE } from 'common/Constants';

class TextEditor {
	/**
	 * constructor
	 * @param {Element} container
	 */
	constructor(container) {
		try {
			this._docModel = new Document();
			this._editorView = new EditorView(container, this._docModel);
			this._editorStateCache = null;

		} catch {
			console.error(MESSAGE.error.editorInitializeError);
			return;
		}

		CommandExecutor.init();
		UndoRedo.init(CommandExecutor);

		KeyHandler.init(this, CommandExecutor, container);
		MouseHandler.init(this, CommandExecutor, Utils, container);
	}

	/**
	 * open
	 * @param {object} docJson
	 * @param {object} textRect
	 * @param {Array} classList
	 * @param {object} marginInfo
	 * @param {boolean} hide
	 * @private
	 */
	open(docJson, textRect, classList, marginInfo, hide) {
		if (!docJson) {
			console.error(MESSAGE.error.openErrorEmptyDocJson);
		}

		if (textRect) {
			this._docModel.setModel(docJson);
		}
	}

	/**
	 * execute command
	 * @param {string} type
	 * @param {object} value
	 * @private
	 */
	execCommand(type, value) {
		CommandExecutor.execCommand(type, value);
	}

	/**
	 * editor의 현재 상태를 저장한다.
	 * @param {Element} contents
	 * @param {object} range
	 * @private
	 */
	setEditorStateCache(contents, range) {
		var editorState,
			selection;

		if (contents && range) {
			this._editorStateCache = [contents, range];

		} else {
			if (window.getSelection) {
				selection = window.getSelection();
				if (selection.getRangeAt && selection.rangeCount) {
					range = selection.getRangeAt(0);
					editorState = Utils.captureEditorState(range);

					if (editorState.length) {
						this._editorStateCache = [Utils.getParagraphs(editorState[0]), editorState[1]];
					}
				}
			}
		}
	}

	/**
	 * editorStateCache를 반환한다.
	 * @returns {*}
	 * @private
	 */
	getEditorStateCache() {
		return this._editorStateCache;
	}

	/**
	 * close
	 * @private
	 */
	close() {
		this._editorView.clear();
		this._editorView.hide();

		this._editorView.blur();
		TextUndoRedo.clear();
		this._editorStateCache = null;
	}

	/**
	 * close
	 * @private
	 */
	function _close() {
		TextEditorView.clear();
		TextEditorView.hide();
		TextEditorView.blur();
		TextUndoRedo.clear();
		_editorStateCache = null;
	}
}

export default TextEditor;
