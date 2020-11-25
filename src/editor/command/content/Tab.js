class Tab {
	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		// this.apply(this.getStyleInfo(value));
		TextEditorView.insertTab(value, range);
	}
}

export default Tab;