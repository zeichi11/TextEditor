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
	 * Return style object.
	 * @ovveride
	 * @param {boolean} value
	 * @returns {{textDecoration: {type: string, value: *}}}
	 */
	getStyleInfo(value) {
		return {"textDecoration": {"type": "line-through", "value": value}};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute(value) {
		this.apply(CMD_TYPE.STRIKETHROUGH, this.getStyleInfo(value));
	}
}

export default StrikeThrough;