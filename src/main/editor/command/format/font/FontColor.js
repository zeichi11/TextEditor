import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from "../../../common/Constants";

class FontColor extends AbstractFormat {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Return style object.
	 * @ovveride
	 * @param {string} value
	 * @returns {{color: string}}
	 */
	getStyleInfo(value) {
		return {"color": value};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.FONT_COLOR, this.getStyleInfo(value));
	}
}

export default FontColor;