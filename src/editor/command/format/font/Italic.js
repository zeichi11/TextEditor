import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class Italic extends AbstractForamat{
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
	 * @returns {{fontStyle: string}}
	 */
	getStyleInfo(value) {
		return {"fontStyle": value ? "italic" : "normal"};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.ITALIC, this.getStyleInfo(value));
	}
}

export default Italic;