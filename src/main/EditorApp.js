import EditorAPI from './editor/EditorAPI';

class EditorApp {
	/**
	 * constructor
	 * @param {Element} appContainerEl
	 */
	constructor(appContainerEl) {
		this._initTextEditor(appContainerEl);
	}

	/**
	 * init TextEditor
	 * @param {Element} appContainerEl
	 * @private
	 */
	_initTextEditor(appContainerEl) {
		let editorWrapEl = document.createElement("DIV");

		EditorAPI.init(editorWrapEl);
		appContainerEl.appendChild(editorWrapEl);
	}

	/**
	 * open (private)
	 * @param {object} documentJson
	 * @param {object} rectInfo
	 */
	_open(documentJson, rectInfo) {
		EditorAPI.open(documentJson, rectInfo);
	}

	/**
	 * open (public)
	 * @param {object} documentJson
	 * @param {object} rectInfo
	 */
	open(documentJson, rectInfo) {
		this._open(documentJson, rectInfo);
	};
}

export default EditorApp;