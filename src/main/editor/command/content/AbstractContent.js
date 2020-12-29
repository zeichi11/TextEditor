import Document from '../../model/Document';

class AbstractContent {
	constructor() {
		if (new.target === AbstractContent) {
			throw new Error("Cannot construct Abstract instances directly.");
		}

		if (this.apply === undefined) {
			throw new Error("Must override 'execute'");
		}
	}

	// TODO view에 직접 반영이 아닌 model -> view 반영 방안을 고민 필요
	/**
	 * Apply command to renderer.
	 * @param {string} type
	 * @param {object} value
	 */
	apply(type, value) { Document.publish(type, value); };
}

export default AbstractContent;