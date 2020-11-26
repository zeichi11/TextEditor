import BodyPr from 'BodyPr';
import Paragraph from 'Paragraph';

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
	get bodyPr() {
		return this.bodyPr;
	};

	/**
	 * Paragraph List를 반환한다.
	 * @returns {*}
	 */
	get ps() {
		return this.ps;
	};

	/**
	 * Textbody Properties를 설정한다.
	 * @param {object} bodyPr
	 */
	set bodyPr(bodyPr) {
		this.bodyPr = bodyPr;
	};

	/**
	 * Paragraph List를 설정한다.
	 * @param {Array} ps
	 */
	set ps(ps) {
		this.ps = ps;
	};
}

export default Body;