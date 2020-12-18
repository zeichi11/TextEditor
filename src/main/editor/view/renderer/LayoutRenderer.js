import AbstractRenderer from "./AbstractRenderer";

class LayoutRenderer extends AbstractRenderer {
	/**
	 * constructor
	 */
	constructor() {
		super();
	}

	/**
	 * styleInfo 내용을 적용한다.
	 * @param {string} type
	 * @param {object} value
	 */
	applyFormat(type, value) {
		let editor = this.getEditorLayout(),
			styleInfo = this.generateHtmlStyle(type, value),
			prop;

		for (prop in styleInfo) {
			if (styleInfo.hasOwnProperty(prop)) {
				editor.style[prop] = styleInfo[prop];
			}
		}
	}
}

export default LayoutRenderer;