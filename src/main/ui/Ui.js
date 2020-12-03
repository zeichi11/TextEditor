import EditorAPI from '../editor/EditorAPI';

let Ui = function () {
	const BTN_CLASS = 'btn';
	const SEP_LINE_CLASS = 'sep_line';
	const COMBO_CLASS = 'combo';
	const INPUT_CLASS = 'input';
	const ON_CLASS = 'on';
	const BOLD = 'bold';
	const ITALIC = 'italic';
	const UNDERLINE = 'underline';
	const STRIKE = 'strikethrough';

	/**
	 * get state
	 * @param {Element} targetEl
	 * @returns {boolean}
	 * @private
	 */
	function _getState(targetEl) {
		let classList = targetEl.classList;
		if (classList.contains(BTN_CLASS)) {
			return classList.contains(ON_CLASS);
		} else {

		}
	}

	/**
	 * click event handler
	 * @param {Element} targetEl
	 * @private
	 */
	function _handleClick(targetEl) {
		let classList = targetEl.classList,
			state;

		if (classList.contains(BTN_CLASS)) {
			state = _getState(targetEl);

			if (classList.contains(BOLD)) {
				EditorAPI.setBold(!state);
			} else if (classList.contains(ITALIC)) {
				EditorAPI.setItalic(!state);
			} else if (classList.contains(UNDERLINE)) {
				EditorAPI.setUnderline(!state);
			} else if (classList.contains(STRIKE)) {
				EditorAPI.setStrikethrough(!state);
			}
		}
	}

	/**
	 * bind event handler
	 * @param {Element} targetEl
	 * @private
	 */
	function _bindEvent(targetEl) {
		targetEl.addEventListener('click', _handleClick);
	}

	/**
	 * create button
	 * @param {string} className
	 * @param {object} style
	 * @param {string} text
	 * @returns {Node}
	 * @private
	 */
	function _createBtn(className, style, text) {
		let btnEl = document.createElement('DIV'),
			btnSpanEl = document.createElement('SPAN'),
			btnText = document.createTextNode(text),
			keys = Object.keys(style),
			i;

		btnEl.classList.add(BTN_CLASS);
		btnEl.classList.add(className);

		for (i = 0; i < keys.length; i++) {
			btnSpanEl.style[keys[i]] = style[keys[i]];
		}

		btnSpanEl.appendChild(btnText);

		return btnEl.appendChild(btnSpanEl);
	}

	return {
		/**
		 * render
		 */
		render() {
			let	boldBtnEl = _createBtn(BOLD, {fontWeight: 'bold'}, 'B'),
				italicBtnEl = _createBtn(ITALIC, {fontStyle: 'italic'}, 'I'),
				underlineBtnEl = _createBtn(UNDERLINE, {textDecoration: 'underline'}, 'U'),
				strikeBtnEl = _createBtn(STRIKE, {textDecoration: 'line-through'}, 'S'),
				sepLine = document.createElement('DIV');

			sepLine.classList.add(SEP_LINE_CLASS);

			[boldBtnEl, italicBtnEl, underlineBtnEl, strikeBtnEl].every(function (el) {
				_bindEvent(el);
			});
		}
	};
};

export default Ui;