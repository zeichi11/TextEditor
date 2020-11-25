import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class FontName extends AbstractForamat{
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Return style object.
	 * @ovveride
	 * @param {string} value
	 * @returns {{fontFamily: string}}
	 */
	getStyleInfo(value) {
		return {"fontFamily": value};
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.FONT_NAME, this.getStyleInfo(value));
	}
}

export default FontName;