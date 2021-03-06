import AbstractContent from './AbstractContent';
import {CMD_TYPE} from "../../common/Constants";

class Text extends AbstractContent {
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
	execute (value, range) { this.apply(CMD_TYPE.TEXT, {value, range}); }

	// /**
	//  * Execute command.
	//  * @override
	//  * @param {object} value
	//  * @param {object} range
	//  */
	// execute (value, range) {
	// 	// this.apply(this.getStyleInfo(value));
	// 	TextEditorView.insertText(value, range);
	// }
}

export default Text;