import AbstractContent from './AbstractContent';
import {CMD_TYPE} from "../../common/Constants";

class Selection extends AbstractContent {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 * @param {object} range
	 */
	execute (value, range) {
		if (value.hasOwnProperty("updateState") && value.updateState) {
			if (range) {
				this.apply(CMD_TYPE.SELECTION, {value, range});
			}
		}
	}

	// /**
	//  * Execute command.
	//  * @override
	//  * @param {object} value
	//  * @param {object} range
	//  */
	// execute (value, range) {
	// 	// this.apply(this.getStyleInfo(value));
	// 	if (value.hasOwnProperty("updateState") && value.updateState) {
	// 		if (range) {
	// 			TextEditorView.updateSelectionInfo(range);
	// 		}
	// 	}
	// }
}

export default Selection;