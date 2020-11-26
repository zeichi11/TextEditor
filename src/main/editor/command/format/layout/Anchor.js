import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE } from "../../../common/Constants";

class Anchor extends AbstractForamat{
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
	 * @returns {{verticalAlign: string}}
	 */
	getStyleInfo = value => ({"verticalAlign": String(value)});

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.ANCHOR, this.getStyleInfo(value));
	};
}

export default Anchor;