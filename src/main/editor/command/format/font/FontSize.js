import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from "../../../common/Constants";

class FontSize extends AbstractFormat {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Return style object.
	 * @ovveride
	 * @override
	 * @param {boolean} value
	 * @returns {{fontSize: string}}
	 */
	getStyleInfo(value) {
		return {"fontSize": value + "pt"};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.FONT_SIZE, this.getStyleInfo(value));
	}
}

export default FontSize;