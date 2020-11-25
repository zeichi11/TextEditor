import Editor from 'src/editor/Editor';
import { CMD_TYPE } from 'common/Constants';

let EditorAPI = (() => {
	let _textEditor;

	return {
		init: function (container) {
			_textEditor = new Editor();
			_textEditor.init(container);
		},

		/**
		 * textEditor를 open 한다.
		 * @param {string} contents
		 * @param {object} textRect
		 * @param {Array} classList
		 * @param {object} marginInfo
		 * @param {boolean} hide
		 * @private
		 */
		open: function (contents, textRect, classList, marginInfo, hide) {
			_textEditor.open(contents, textRect, classList, marginInfo, hide);
		},

		/**
		 * textEditor를 종료한다.
		 * @private
		 */
		close: function () {
			_textEditor.close();
		},

		/**
		 * textEditor의 편집 command를 실행한다.
		 * @param {string} type
		 * @param {object} value
		 * @private
		 */
		execCommand: function (type, value) {
			_textEditor.execCommand(type, value);
		},

		/**
		 * bold를 설정한다.
		 * @param {object} value
		 */
		setBold: function (value) {
			this.execCommand(CMD_TYPE.BOLD, value);
		},

		/**
		 * italic을 설정한다.
		 * @param {object} value
		 */
		setItalic: function (value) {
			this.execCommand(CMD_TYPE.ITALIC, value);
		},

		/**
		 * underline을 설정한다.
		 * @param {object} value
		 */
		setUnderline: function (value) {
			this.execCommand(CMD_TYPE.UNDERLINE, value);
		},

		/**
		 * double underline을 설정한다.
		 * @param {object} value
		 */
		setDoubleUnderline: function (value) {
			this.execCommand(CMD_TYPE.DOUBLE_UNDERLINE, value);
		},

		/**
		 * strikethrough를 설정한다.
		 * @param {object} value
		 */
		setStrikethrough: function (value) {
			this.execCommand(CMD_TYPE.STRIKETHROUGH, value);
		},

		/**
		 * font 크기를 설정한다.
		 * @param {object} value
		 */
		setFontSize: function (value) {
			this.execCommand(CMD_TYPE.FONT_SIZE, value);
		},

		/**
		 * font name을 설정한다.
		 * @param {object} value
		 */
		setFontName: function (value) {
			this.execCommand(CMD_TYPE.FONT_NAME, value);
		},

		/**
		 * font 색상을 설정한다.
		 * @param {object} value
		 */
		setFontColor: function (value) {
			this.execCommand(CMD_TYPE.FONT_COLOR, value);
		},

		/**
		 * text-align을 center로 설정한다.
		 */
		justifyCenter: function () {
			this.execCommand(CMD_TYPE.ALIGN, Constants.constants.ALIGN_CENTER);
		},

		/**
		 * text-align을 left로 설정한다.
		 */
		justifyLeft: function () {
			this.execCommand(CMD_TYPE.ALIGN, Constants.constants.ALIGN_LEFT);
		},

		/**
		 * text-align을 right로 설정한다.
		 */
		justifyRight: function () {
			this.execCommand(CMD_TYPE.ALIGN, Constants.constants.ALIGN_RIGHT);
		},

		/**
		 * vertical-align을 top으로 설정한다.
		 */
		anchorTop: function () {
			this.execCommand(CMD_TYPE.ANCHOR, Constants.constants.ANCHOR_TOP);
		},

		/**
		 * vertical-align을 middle로 설정한다.
		 */
		anchorMiddle: function () {
			this.execCommand(CMD_TYPE.ANCHOR, Constants.constants.ANCHOR_MIDDLE);
		},

		/**
		 * vertical-align을 bottom으로 설정한다.
		 */
		anchorBottom: function () {
			this.execCommand(CMD_TYPE.ANCHOR, Constants.constants.ANCHOR_BOTTOM);
		},

		/**
		 * textEditor 여백을 설정한다.
		 * @param {number} top
		 * @param {number} left
		 * @param {number} right
		 * @param {number} bottom
		 */
		setInsetInfo: function (top, left, right, bottom) {
			this.execCommand(CMD_TYPE.INSET, {"top": top, "left": left, "right": right, "bottom": bottom});
		}
	};
})();

export default EditorAPI;