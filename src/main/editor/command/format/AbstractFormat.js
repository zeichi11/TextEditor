import Document from '../../model/Document';

class AbstractFormat {
	constructor() {
		if (new.target === AbstractFormat) {
			throw new Error("Cannot construct Abstract instances directly.");
		}

		if (this.execute === undefined) {
			throw new Error("Must override 'execute'");
		}
	}

	// TODO view에 직접 반영이 아닌 model -> view 반영 방안을 고민 필요
	/**
	 * Apply command to renderer.
	 * @param {string} type
	 * @param {object} styleInfo
	 */
	apply(type, styleInfo) { Document.publish(type, styleInfo); };
}

export default AbstractFormat;