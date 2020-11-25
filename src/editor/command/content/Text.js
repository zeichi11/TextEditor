class Text {
	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		// this.apply(this.getStyleInfo(value));
		TextEditorView.insertText(value, range);
	}
}

export default Text;