import { CMD_TYPE } from "../common/Constants";
import Config from '../common/Config';
import Utils from '../common/Utils';

const MouseHandler = function () {
	let _textEditor = null,
		_commandExecutor = null,
		_utils;

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
	 * stop propagation
	 * @param event
	 * @private
	 */
	function _stopImmediatePropagation(event) {
		event.stopImmediatePropagation();
	}

	/**
	 * prevent default
	 * @param event
	 * @private
	 */
	function _preventDefault(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	/**
	 * mouseup 이벤트 핸들러
	 * @param {object} event
	 * @private
	 */
	function _mouseUp(event) {
		let range;
		event.stopImmediatePropagation();
		if (event.button === 0) {
			_textEditor.setEditorStateCache(null, null);

			range = Utils.getRange();
			if (range) {
				_executeCommand(CMD_TYPE.SELECTION, {"updateState": true}, range);
			}


		} else {
			event.preventDefault();
		}
	}

	return {
		/**
		 * init
		 * @param {object} textEditor
		 * @param {object} commandExecutor
		 * @param {object} Utils
		 * @param {Element} container
		 */
		init: function (textEditor, commandExecutor, Utils, container) {
			_textEditor = textEditor;
			_commandExecutor = commandExecutor;
			// _utils = Utils;
			this.bind(container);
		},

		/**
		 * bind mouse event
		 * @param {Element} container
		 */
		bind: function (container) {
			let editorWrap = container.firstChild,
				target = editorWrap.firstChild;

			target.addEventListener("mousedown", _stopImmediatePropagation);
			target.addEventListener("mousemove", _stopImmediatePropagation);
			target.addEventListener("mouseup", _mouseUp);
			target.addEventListener("selectstart", _stopImmediatePropagation);

			if (Config.browser.Firefox) {
				target.addEventListener("DOMMouseScroll", _stopImmediatePropagation);
			} else {
				target.addEventListener("mousewheel", _stopImmediatePropagation);
			}

			editorWrap.addEventListener("mousedown", _preventDefault);
			editorWrap.addEventListener("mouseup", _preventDefault);
		}
	};
}();

export default MouseHandler;