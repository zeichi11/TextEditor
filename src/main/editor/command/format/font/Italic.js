import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from "../../../common/Constants";

class Italic extends AbstractFormat {
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
		this.apply(CMD_TYPE.ITALIC, value);
	}
}

export default Italic;