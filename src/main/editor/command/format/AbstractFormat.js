import Document from '../../model/Document';

class AbstractFormat {
	/**
	 * constructor
	 */
	constructor() {
		if (new.target === AbstractFormat) {
			throw new Error("Cannot construct Abstract instances directly.");
		}

		if (this.execute === undefined) {
			throw new Error("Must override 'execute'");
		}
	}

	/**
	 * Apply command to renderer.
	 * @param {string} type
	 * @param {object} styleInfo
	 */
	apply(type, styleInfo) { Document.publish(type, styleInfo); };
}

export default AbstractFormat;