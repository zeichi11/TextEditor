class Delete {
	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		// this.apply(this.getStyleInfo(value));
		TextEditorView.deleteContents(range);
	}
}

export default Delete;