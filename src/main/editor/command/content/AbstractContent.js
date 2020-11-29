import EditorView from '../../view/EditorView';

class AbstractContent {
	constructor() {
		if (new.target === AbstractContent) {
			throw new Error("Cannot construct Abstract instances directly.");
		}

		// if (this.hasOwnProperty("getStyleInfo")) {
		// 	throw new Error("Must override 'getStyleInfo'");
		// }

		if (this.hasOwnProperty("execute")) {
			throw new Error("Must override 'execute'");
		}
	}

	// /**
	//  * Return style object.
	//  */
	// getStyleInfo = () => {throw new Error("Must override 'getStyleInfo'");};
	//
	// /**
	//  * Execute command.
	//  */
	// execute = () => {throw new Error("Must override 'execute'");};

	// TODO view에 직접 반영이 아닌 model -> view 반영 방안을 고민 필요
	/**
	 * Apply command to renderer.
	 * @param {object} styleInfo
	 */
	apply = (styleInfo) => { EditorView.apply(styleInfo); };
}

export default AbstractContent;