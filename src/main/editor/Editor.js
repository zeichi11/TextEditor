import EditorView from './view/EditorView';
import KeyHandler from './event/KeyHandler';
import MouseHandler from './event/MouseHandler';
import CommandExecutor from './command/CommandExecutor';
import Document from './model/Document';
import UndoRedo from './command/UndoRedo';
import Config from './common/Config';
import Utils from './common/Utils';
import { MESSAGE } from './common/Constants';

class Editor {
	/**
	 * constructor
	 * @param {Element} containerEl
	 */
	constructor(containerEl) {
		try {
			this._editorView = new EditorView(containerEl);
			this._editorStateCache = null;

		} catch {
			console.error(MESSAGE.error.editorInitializeError);
			return;
		}

		Utils.init(this);
		UndoRedo.init(CommandExecutor);
		Config.browser = Utils.getBrowser();

		KeyHandler.init(this, CommandExecutor, containerEl);
		MouseHandler.init(this, CommandExecutor, Utils, containerEl);
	}

	/**
	 * open
	 * @param {object} docJson
	 * @param {object} rectInfo
	 * @param {Array} classList
	 * @param {object} marginInfo
	 * @param {boolean} hide
	 * @private
	 */
	open(docJson, rectInfo, classList, marginInfo, hide) {
		if (!docJson) {
			console.error(MESSAGE.error.openErrorEmptyDocJson);
		}

		if (rectInfo) {
			Document.setModel(docJson, rectInfo);
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
		let editorState,
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
		UndoRedo.clear();
		this._editorStateCache = null;
	}
}

export default Editor;
