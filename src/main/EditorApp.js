import EditorAPI from './editor/EditorAPI';
import { $, jqurey } from 'jquery';

class EditorApp extends EditorAPI {
	/**
	 * constructor
	 * @param {Element} appContainer
	 */
	constructor(appContainer) {
		super();

		window.$ = $;
		window.jquery = jquery;

		this._initTextEditor(appContainer)
	}

	/**
	 * init TextEditor
	 * @param {Element} appContainer
	 * @private
	 */
	_initTextEditor(appContainer) {
		let editorWrap = document.createElement("DIV"),
			innerContainer = document.createElement("DIV");

		EditorAPI.init(editorWrap);

		innerContainer.appendChild(editorWrap);
		appContainer.appendChild(innerContainer);
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
	 */
	open(documentJson) {
		this._open(documentJson);
	};
}
