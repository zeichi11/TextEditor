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
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.FONT_SIZE, value);
	}
}

export default FontSize;