import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from "../../../common/Constants";

class Underline extends AbstractFormat {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Execute command.
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.UNDERLINE, value);
	}
}

export default Underline;