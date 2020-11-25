import EditorAPI from './editor/EditorAPI';
import { $, jqurey } from 'jquery';

class EditorApp extends EditorAPI {
	constructor(container) {
		super();

		window.$ = $;
		window.jquery = jquery;

		this._container = container;
		this._initTextEditor();
	}

	/**
	 *
	 * @private
	 */
	_initTextEditor() {

	}

	/**
	 *
	 * @param {object} documentJson
	 */
	render(documentJson) {
		this.open(documentJson);
		this._container.appendChild();
	}
}