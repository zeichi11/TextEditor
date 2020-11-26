class Selection {
	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		// this.apply(this.getStyleInfo(value));
		if (value.hasOwnProperty("updateState") && value.updateState) {
			if (range) {
				TextEditorView.updateSelectionInfo(range);
			}
		}
	}
}

export default Selection;