import EditorAPI from '../editor/EditorAPI';
// import UiStyle from './Ui.css';
import './Ui.css';

let Ui = function () {
	const UI_CONTAINER = 'ui_container';
	const BTN_CLASS = 'btn';
	const BTN_ICON_CLASS = 'btn_icon';
	const SEP_LINE_CLASS = 'sep_line';
	const ON_CLASS = 'on';

	const COMBO_CLASS = 'combo';
	const COMBO_BTN_CLASS = 'combo_btn';
	const COMBO_INPUT_CLASS = 'combo_input';

	const INPUT_CLASS = 'input';

	const BOLD = 'bold';
	const ITALIC = 'italic';
	const UNDERLINE = 'underline';
	const STRIKE = 'strikethrough';
	const FONT = 'font';

	// const BTN_CLASS = UiStyle['btn'];
	// const SEP_LINE_CLASS = UiStyle['sep_line'];
	// const COMBO_CLASS = UiStyle['combo'];
	// const INPUT_CLASS = UiStyle['input'];
	// const ON_CLASS = UiStyle['on'];
	// const BOLD = UiStyle['bold'];
	// const ITALIC = UiStyle['italic'];
	// const UNDERLINE = UiStyle['underline'];
	// const STRIKE = UiStyle['strike_through'];

	/**
	 * get state
	 * @param {EventTarget} targetEl
	 * @returns {boolean}
	 * @private
	 */
	function _getState(targetEl) {
		let classList = targetEl.classList;
		if (classList.contains(BTN_CLASS)) {
			return classList.contains(ON_CLASS);
		}
	}

	/**
	 * click event handler
	 * @param {Event} event
	 * @private
	 */
	function _handleClick(event) {
		event.stopPropagation();

		let targetEl = event.currentTarget,
			classList = targetEl.classList,
			state;

		if (classList.contains(BTN_CLASS)) {
			state = _getState(targetEl);

			if (!state) {
				classList.add(ON_CLASS);
			} else {
				classList.remove(ON_CLASS);
			}

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
	 * @param {string} title
	 * @param {string} text
	 * @returns {Node}
	 * @private
	 */
	function _createBtn(className, style, title, text) {
		let btnEl = document.createElement('DIV'),
			btnIconEl = document.createElement('DIV'),
			btnSpanEl = document.createElement('SPAN'),
			btnText = document.createTextNode(text),
			keys = Object.keys(style),
			i;

		btnEl.setAttribute('title', title);
		btnEl.classList.add(BTN_CLASS);
		btnEl.classList.add(className);
		btnIconEl.classList.add(BTN_ICON_CLASS);

		for (i = 0; i < keys.length; i++) {
			btnSpanEl.style[keys[i]] = style[keys[i]];
		}

		btnSpanEl.appendChild(btnText);
		btnIconEl.appendChild(btnSpanEl);
		btnEl.appendChild(btnIconEl);

		return btnEl;
	}

	/**
	 * create combobox
	 * @param {string} className
	 * @param {object} style
	 * @param {string} title
	 * @private
	 */
	function _createCombo(className, style, title) {
		let comboEl = document.createElement('DIV'),
			inputAnchorEl = document.createElement('A'),
			btnAnchorEl = document.createElement('A'),
			inputEl = document.createElement('INPUT');

		comboEl.setAttribute('title', title);
		comboEl.classList.add(COMBO_CLASS);

		inputAnchorEl.classList.add(COMBO_INPUT_CLASS);
		btnAnchorEl.classList.add(COMBO_BTN_CLASS);

		inputAnchorEl.appendChild(inputEl);
		comboEl.appendChild(inputAnchorEl);
		comboEl.appendChild(btnAnchorEl);

		return comboEl;
	}

	return {
		/**
		 * render
		 */
		render(uiContainerEl) {
			let	boldBtnEl = _createBtn(BOLD, {fontWeight: 'bold'}, BOLD, 'B'),
				italicBtnEl = _createBtn(ITALIC, {fontStyle: 'italic'}, ITALIC, 'I'),
				underlineBtnEl = _createBtn(UNDERLINE, {textDecoration: 'underline'}, UNDERLINE, 'U'),
				strikeBtnEl = _createBtn(STRIKE, {textDecoration: 'line-through'}, STRIKE, 'S'),
				// fontComboEl = _createCombo(FONT, {}, ''),
				sepLine = document.createElement('DIV');

			sepLine.classList.add(SEP_LINE_CLASS);


			[/*fontComboEl, */boldBtnEl, italicBtnEl, underlineBtnEl, strikeBtnEl].forEach(function (el) {
				_bindEvent(el);
				uiContainerEl.appendChild(el);
			});

			uiContainerEl.classList.add(UI_CONTAINER);
		}
	};
}();

export default Ui;