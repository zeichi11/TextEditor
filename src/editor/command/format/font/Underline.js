import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class Underline extends AbstractForamat{
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
		return {
			"textDecoration": {"type": "underline", "value": value},
			"textDecorationStyle": "solid"
		};
	}

	/**
	 * Execute command.
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.UNDERLINE, this.getStyleInfo(value));
	}
}

export default Underline;