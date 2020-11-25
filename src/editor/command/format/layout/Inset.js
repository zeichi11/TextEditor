import AbstractForamat from '../AbstractForamat';
import { CMD_TYPE, CONSTANTS } from '../../../common/Constants';

class Inset extends AbstractForamat{
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
	 * @returns {object}
	 */
	getStyleInfo(value) {
		let key,
			prop,
			styleInfo = {};

		if (value) {
			for (key in value) {
				if (value.hasOwnProperty(key)) {
					switch (key) {
						case CONSTANTS.INSET_TOP:
							prop = "paddingTop";
							break;
						case CONSTANTS.INSET_LEFT:
							prop = "paddingLeft";
							break;
						case CONSTANTS.INSET_RIGHT:
							prop = "paddingRight";
							break;
						case CONSTANTS.INSET_BOTTOM:
							prop = "paddingBottom";
							break;
					}
					styleInfo[prop] = value[key] + "px";
				}
			}
		}

		return styleInfo;
	}

	/**
	 * Execute command.
	 * @override
	 * @param {object} value
	 */
	execute = value => {
		this.apply(CMD_TYPE.INSET, this.getStyleInfo(value));
	};
}

export default Inset;