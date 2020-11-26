import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class Bold extends AbstractForamat{
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
	 * @returns {{fontWeight: string}}
	 */
	getStyleInfo(value) {
		return {"fontWeight": value ? "bold" : "normal"};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute (value) {
		this.apply(CMD_TYPE.BOLD, this.getStyleInfo(value));
	}
}

export default Bold;