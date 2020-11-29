import BodyPr from './BodyPr';
import Paragraph from './Paragraph';

class Body {
	/**
	 * constructor
	 * @param {object} body
	 */
	constructor(body) {
		if (body) {
			this.bodyPr = body.bodyPr;
			this.ps = body.ps;
		}

		if (this.bodyPr === undefined) {
			this.bodyPr = {};
		}

		if (this.ps === undefined) {
			this.ps = [];
		}
	}

	/**
	 * Textbody Properties를 반환한다.
	 * @returns {*}
	 */
	getBodyPr() {
		return this.bodyPr;
	};

	/**
	 * Paragraph List를 반환한다.
	 * @returns {*}
	 */
	getPs() {
		return this.ps;
	};

	/**
	 * Textbody Properties를 설정한다.
	 * @param {object} bodyPr
	 */
	setBodyPr(bodyPr) {
		this.bodyPr = bodyPr;
	};

	/**
	 * Paragraph List를 설정한다.
	 * @param {Array} ps
	 */
	setPs(ps) {
		this.ps = ps;
	};
}

export default Body;