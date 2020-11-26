const LayoutRenderer = {
	/**
	 * editor DOM 객체를 반환한다.
	 * @returns {Element}
	 */
	getEditorLayout: function() {
		return document.getElementsByClassName(TextEditorConst.name.editorWrap)[0];
	},

	/**
	 * styleInfo 내용을 적용한다.
	 * @param {object} styleInfo
	 */
	applyFormat: function(styleInfo) {
		var editor = this.getEditorLayout(),
			prop;

		for (prop in styleInfo) {
			if (styleInfo.hasOwnProperty(prop)) {
				editor.style[prop] = styleInfo[prop];
			}
		}
	}
};

export default LayoutRenderer;