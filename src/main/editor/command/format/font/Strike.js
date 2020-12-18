import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from "../../../common/Constants";

class StrikeThrough extends AbstractFormat {
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
		this.apply(CMD_TYPE.STRIKETHROUGH, value);
	}
}

export default StrikeThrough;