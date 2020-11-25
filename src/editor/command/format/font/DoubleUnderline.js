import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class DoubleUnderline extends AbstractForamat{
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
	 * @returns {{textDecoration: {type: string, value: *}, textDecorationStyle: string}}
	 */
	getStyleInfo(value) {
		return {
			"textDecoration": {"type": "underline", "value": value},
			"textDecorationStyle": value ? "double" : ""
		};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.DOUBLE_UNDERLINE, this.getStyleInfo(value));
	}
}

export default DoubleUnderline;