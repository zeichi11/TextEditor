import AbstractFormat from '../AbstractFormat';
import { CMD_TYPE } from '../../../common/Constants';

class Inset extends AbstractFormat {
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
		this.apply(CMD_TYPE.INSET, value);
	}
}

export default Inset;