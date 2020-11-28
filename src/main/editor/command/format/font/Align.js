import AbstractFormat from '../AbstractFormat';
import {CMD_TYPE} from "../../../common/Constants";

class Align extends AbstractFormat {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Return style object.
	 * @ovveride
	 * @param {object} value
	 * @returns {{textAlign: string}}
	 */
	getStyleInfo(value) { return {"textAlign": String(value)} };

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.ALIGN, this.getStyleInfo(value));
	}
}

export default Align;