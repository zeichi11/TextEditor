import AbstractContent from './AbstractContent';
import {CMD_TYPE} from "../../common/Constants";

class Delete extends AbstractContent {
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
	 * @param {object} range
	 */
	execute (value, range) { this.apply(CMD_TYPE.DELETE, {value, range}); }
}

export default Delete;