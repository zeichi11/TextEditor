

class Content {
	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		// this.apply(this.getStyleInfo(value));
		TextEditorView.renderContents(value, range);
	}
}

export default Content;