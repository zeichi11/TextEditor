import { NAMES, REGEX } from '../../common/Constants';
import TextStyleRenderer from 'TextStyleRenderer';

class TextRenderer {
	/*
	 * text layout DOM 구조
	 * <div class='editable_area' contenteditable='true'>
	 *      <p>
	 *               <span>text</span>
	 *               <span><br/></span> -> soft break
	 *      </p>
	 * </div>
	 *
	 * p : <p>
	 * run : <span>
	 */
	constructor() {
		this._textStyleRenderer = new TextStyleRenderer();
	}

	/**
	 * bodyPr 정보를 적용한다.
	 * @param {Element} div
	 * @param {object} bodyPr
	 * @private
	 */
	_applyBodyPr(div, bodyPr) {
		this._textStyleRenderer.applyBodyPr(div, bodyPr);
	}

	/**
	 * pPr 정보를 적용한다.
	 * @param {Element} p
	 * @param {object} pPr
	 * @private
	 */
	_applyPpr(p, pPr) {
		this._textStyleRenderer.applyPpr(p, pPr);
	}

	/**
	 * rPr 정보를 적용한다.
	 * @param {Element} span
	 * @param {object} rPr
	 * @private
	 */
	_applyRpr(span, rPr) {
		this._textStyleRenderer.applyRpr(span, rPr);
	}

	/**
	 * content를 textNode로 포함하는 span을 생성한다.
	 * @param content
	 * @returns {HTMLElement}
	 * @private
	 */
	_createSpan(content) {
		let span = document.createElement('SPAN');

		if (content !== undefined) {
			span.appendChild(document.createTextNode(content));
		}
		return span;
	}

	/**
	 * tab span을 생성한다.
	 * @returns {HTMLElement}
	 * @private
	 */
	_tab() {
		let ZERO_WIDTH_NO_BREAK_SPACE = 0xFEFF,
			TAB_SPAN_WIDTH = 25,    // TODO 폰트 사이즈에 따른 너비 계산 필요
			span = this._createSpan(String.fromCharCode(ZERO_WIDTH_NO_BREAK_SPACE));

		span.style.width = TAB_SPAN_WIDTH + 'px';
		return span;
	}

	/**
	 * soft break span 을 생성한다.
	 * @returns {HTMLElement}
	 * @private
	 */
	_softBreak() {
		let span = this._createSpan();
		span.appendChild(document.createElement('BR'));
		return span;
	}

	/**
	 * 전달반등 content
	 * @param {string} content
	 * @returns {HTMLElement}
	 * @private
	 */
	_content(content) {
		return this._createSpan(content);
	}

	// /**
	//  * run 단위 text을 span으로 생성한다.
	//  * @param {Object} p
	//  * @param {string} text
	//  * @param {object} rPr
	//  * @private
	//  */
	// _createContent(p, text, rPr, container) {
	//     let NEW_LINE_CHAR = ['\r\n', '\r', '\n'],
	//         i, j,
	//         span,
	//         contentLines,
	//         contents,
	//         lineFeed = function () {
	//             container.appendChild(p);
	//
	//             span = this._content("");
	//             this._applyRpr(span, rPr);
	//             p = _breakParagraph(p, span, container);
	//         };
	//
	//     if (NEW_LINE_CHAR.indexOf(text) > -1) {
	//         // span = this._softBreak();
	//         // p.appendChild(span);
	//         lineFeed();
	//
	//     } else {
	//         contentLines = text.split(REGEX.newLine);
	//         for (i = 0; i < contentLines.length; i++) {
	//             contentLines[i] = contentLines[i].replace(REGEX.newLine, "");
	//
	//             if (contentLines[i].length > 0 && contentLines[i] !== "") {
	//                 contents = contentLines[i].split('\t');
	//
	//                 for (j = 0; j < contents.length; j++) {
	//                     if (contents[j].length) {
	//                         span = this._content(contents[j]);
	//                     } else {
	//                         span = this._tab();
	//                     }
	//                 }
	//
	//                 this._applyRpr(span, rPr);
	//                 p.appendChild(span);
	//
	//             } else {
	//                 lineFeed();
	//             }
	//         }
	//     }
	// }

	/**
	 * run 단위 text을 span으로 생성한다.
	 * @param {Element} p
	 * @param {string} text
	 * @param {object} rPr
	 * @private
	 */
	_createContent(p, text, rPr) {
		let NEW_LINE_CHAR = ['\r\n', '\r', '\n'],
			i, j,
			span,
			contentLines,
			contents;

		if (NEW_LINE_CHAR.indexOf(text) > -1) {
			span = this._softBreak();

			this._applyRpr(span, rPr);
			p.appendChild(span);

		} else {
			contentLines = text.split(REGEX.newLine);
			for (i = 0; i < contentLines.length; i++) {
				contentLines[i] = contentLines[i].replace(REGEX.newLine, "");

				if (contentLines[i].length > 0 && contentLines[i] !== "") {
					contents = contentLines[i].split('\t');

					for (j = 0; j < contents.length; j++) {
						if (contents[j].length) {
							span = this._content(contents[j]);
						} else {
							span = this._tab();
						}
					}
				} else {
					span = this._softBreak();
				}

				this._applyRpr(span, rPr);
				p.appendChild(span);
			}
		}
	}

	/**
	 * run 단위 요소를 생성한다.
	 * @param {Array} runs
	 * @param {object} p
	 * @private
	 */
	_createRuns(runs, p) {
		let rPr,
			run,
			t,
			i;

		for (i = 0; i < runs.length; i++) {
			rPr = {};
			t = "";
			if (runs[i].hasOwnProperty('r')) {
				run = runs[i].r;
				if (run.hasOwnProperty('rPr')) {
					rPr = run.rPr;
				}
				if (run.hasOwnProperty('t')) {
					t = run.t;
				}
			}
			this._createContent(p, t, rPr);
		}
	}

	/**
	 * run 정보가 없는 paragraph를 생성한다.
	 * @param {object} p
	 * @private
	 */
	_createEmptyRuns(p) {
		this._createContent(p, "", {});
	}

	/**
	 * paragraph 요소를 생성한다.
	 * @param {object} ps
	 * @private
	 */
	_createParagraphs(ps) {
		let p,
			pTag,
			container = document.createElement('DIV'),
			i;
		for (i = 0; i < ps.length; i++) {
			p = ps[i];
			pTag = document.createElement('P');
			pTag.classList.add(NAMES.contentPara);

			if (p.hasOwnProperty('runs')) {
				if (p.runs.length) {
					this._createRuns(p.runs, pTag);
				} else {
					this._createEmptyRuns(pTag);
				}
			}
			this._applyPpr(pTag, p.pPr);

			container.appendChild(pTag);
		}

		return container.innerHTML;
	}

	/**
	 * txBody를 HTML element로 렌더링한다.
	 * @param {Array} ps
	 * @param {object} bodyPr
	 * @returns {*}
	 * @private
	 */
	_renderTxBody(ps, bodyPr) {
		let contentDiv = document.createElement('DIV'),
			layout = document.createElement('DIV');

		layout.classList.add(NAMES.textLayout);
		contentDiv.classList.add(NAMES.textContent);
		contentDiv.classList.add(NAMES.textBreakWord);

		// TODO 텍스트 박스 편집 기능 추가 후 처리
		// div.setAttribute('contenteditable', 'true');

		if (ps) {
			contentDiv.innerHTML = this._createParagraphs(ps);
		}
		layout.appendChild(contentDiv);

		if (bodyPr) {
			this._applyBodyPr(layout, bodyPr);
		}

		return layout;
	}

	/**
	 * ps 모델의 텍스트 라인이 paragraph가 아닌 run의 lineFeed 문자('\n')로 구분되어 있는 경우 paragraph 단위의 모델로 변환한다.
	 * @param {Array} ps
	 * @private
	 */
	_convertNewLineToParagraph(ps) {
		let newPs = [],
			p,
			pPr,
			runs,
			run,
			runName,
			rPr,
			nP,
			t,
			content = "",
			i, j, k,
			generateParaModel = function (pPr) {
				return {
					pPr: pPr,
					runs: []
				};
			};

		for (i = 0; i < ps.length; i++) {
			p = ps[i];
			pPr = p.pPr;
			runs = p.runs;

			if (!runs) {
				continue;
			}

			// paragraph 모델을 생성하고 lineFeed 문자가 있는 경우 앞의 text들을 run으로 생성하여 추가하고 새로운 paragraph 모델을 생성한다.
			nP = generateParaModel(pPr);

			for (j = 0; j < runs.length; j++) {
				if (Object.keys(runs[j]).length === 0) {
					continue;
				}

				// r, cr(carriage Return run), br(break line run)
				runName = Object.keys(runs[j])[0];
				run = runs[j][runName];

				if (run) {
					if (run.hasOwnProperty('rPr')) {
						rPr = run.rPr;
					}

					if (run.hasOwnProperty('t')) {
						t = run.t;
					} else {
						t = "";
					}

					if (t.length === 0) {
						nP.runs.push({
							r: {
								rPr: rPr,
								t: content
							}
						});
					} else {
						for (k = 0; k < t.length; k++) {
							if (t[k] === '\n') {
								if (content !== "") {
									nP.runs.push({
										r: {
											rPr: rPr,
											t: content
										}
									});
									content = "";
								}

								newPs.push(nP);
								nP = generateParaModel(pPr);

								continue;
							}

							content += t[k];

							// 문자열의 마지막 문자인 경우에도 run으로 추가
							if (k === t.length - 1) {
								nP.runs.push({
									r: {
										rPr: rPr,
										t: content
									}
								});
								content = "";
							}
						}
					}

					if (j === runs.length - 1) {
						newPs.push(nP);
					}
				}
			}
		}
		return newPs;
	}

	/**
	 * render text
	 * @param {Element} editor
	 * @param {Array} ps
	 * @param {object} bodyPr
	 */
	render(editor, ps, bodyPr) {
		let textDIV = this._renderTxBody(this._convertNewLineToParagraph(ps), bodyPr);
		editor.innerHTML = textDIV.innerHTML;
	}
}

export default TextRenderer;



