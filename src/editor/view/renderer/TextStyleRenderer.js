import { STYLE_PROP } from '../../common/Constants';
import Utils from '../../common/Utils';

class TextStyleRenderer {
	/**
	 * rgba 값을 조합하여 rgba string으로 반환한다.
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 * @returns {string}
	 * @private
	 */
	_getRgbaString(r, g, b, a) {
		return "rgba(" + r + ", " + g + ", " + b + ", " + (a||1) + ")";
	}

	/**
	 * fillPr의 solidFill color 정보를 rgba로 변환하여 반환한다.
	 * @param {object} fillPr
	 * @private
	 */
	_getFillCLR(fillPr) {
		let DEFAULT_COLOR = "rgba(0,0,0,1)",
			solidFill,
			rgba;

		if (fillPr.hasOwnProperty(STYLE_PROP.SOLID_FILL)) {
			solidFill = fillPr[STYLE_PROP.SOLID_FILL];
			if (solidFill.hasOwnProperty("color")) {
				// rgba = DrawingUtils.getColorRgba(solidFill.color);
				return this._getRgbaString(rgba[0], rgba[1], rgba[2], rgba[3]);
			}
		}

		return DEFAULT_COLOR;
	}

	/**
	 * anchor에 맞는 vertical align 값을 반환한다.
	 * @param {number} anchor
	 * @returns {*}
	 * @private
	 */
	_getVerticalAlign(anchor) {
		let alignStyle = "";
		switch (anchor) {
			case STYLE_PROP.TEXT_ANCHOR_TOP:
				alignStyle = "top";
				break;
			case STYLE_PROP.TEXT_ANCHOR_CENTER:
				alignStyle = "middle";
				break;
			case STYLE_PROP.TEXT_ANCHOR_BOTTOM:
				alignStyle = "bottom";
				break;
			// case STYLE_PROP.TEXT_ANCHOR_JUSTIFY:
			//     alignStyle = "middle";
			//     break;
			// case STYLE_PROP.TEXT_ANCHOR_DISTRIBUTE:
			//     alignStyle = "middle";
			//     break;
			default:
				alignStyle = "top";
		}
		return alignStyle;
	}

	/**
	 * align에 맞는 style 값을 반환한다.
	 * @param {number} align
	 * @private
	 */
	_getAlign(align) {
		let alignStyle = "";
		switch (align) {
			case STYLE_PROP.ALIGN_LEFT:
				alignStyle = "left";
				break;
			case STYLE_PROP.ALIGN_CENTER:
				alignStyle = "center";
				break;
			case STYLE_PROP.ALIGN_RIGHT:
				alignStyle = "right";
				break;
			// case STYLE_PROP.ALIGN_JUSTIFY:
			//     alignStyle = "left";
			//     break;
			// case STYLE_PROP.ALIGN_JUSTIFY_LOW:
			//     alignStyle = "center";
			//     break;
			// case STYLE_PROP.ALIGN_DISTRIBUTED:
			//     alignStyle = "center";
			//     break;
			// case STYLE_PROP.ALIGN_THAI_DISTRIBUTE:
			//     alignStyle = "center";
			//     break;
			default:
				alignStyle = "left";
				break;
		}
		return alignStyle;
	}

	/**
	 * run font style 속성들을 css 객체로 반환한다.
	 * @param {object} rPr
	 * @private
	 */
	_getFontStyle(rPr) {
		let css = {},
			size = rPr.sz,
			name,
			bold = rPr.b,
			italic = rPr.i,
			underline = rPr.u,
			strike = rPr.strike,
			fillPr = rPr.fillPr;

		if (size !== undefined) {
			css["font-size"] = (size / 100) + "pt";
		}

		if (rPr.hasOwnProperty("ea")) {
			// locale에 따른 처리 여부 확인
			name = rPr.ea.typeface;
		}
		if (name !== undefined) {
			css["font-family"] = Utils.removeQuotationMarks(/*HtmlConverter.adjustFontFamily(name)*/name);
		}
		if (bold !== undefined) {
			css["font-weight"] = bold ? "bold" : "normal";
		}
		if (italic !== undefined) {
			css["font-style"] = italic ? "italic" : "normal";
		}
		if (strike !== undefined) {
			css["text-decoration"] = strike ? "line-through" : "none";
		}
		if (underline !== undefined) {
			if (strike !== undefined) {
				css["text-decoration"] = "underline line-through";
			} else {
				css["text-decoration"] = "underline";
			}

			if (underline === STYLE_PROP.FONT_STYLE_UNDERLINE_DOUBLE) {
				css["text-decoration-style"] = Constants.constants.DOUBLE;
			}
		}
		if (fillPr !== undefined) {
			css["color"] = this._getFillCLR(fillPr);
		}

		return css;
	}

	/**
	 * txBody style 속성들을 css 객체로 반환한다.
	 * @param {object} bodyPr
	 * @private
	 */
	_getTextBodyStyle(bodyPr) {
		let css = {},
			anchor = bodyPr.anchor, // vertical-align
			tIns = bodyPr.tIns,
			bIns = bodyPr.bIns,
			lIns = bodyPr.lIns,
			rIns = bodyPr.rIns;

		if (anchor !== undefined) {
			css["vertical-align"] = this._getVerticalAlign(anchor);
		}

		if (tIns !== undefined) {
			css["padding-top"] = Utils.emuToPx(tIns) + "px";
		}
		if (lIns !== undefined) {
			css["padding-left"] = Utils.emuToPx(lIns) + "px";
		}
		if (rIns !== undefined) {
			css["padding-right"] = Utils.emuToPx(rIns) + "px";
		}
		if (bIns !== undefined) {
			css["padding-bottom"] = Utils.emuToPx(bIns) + "px";
		}

		return css;
	}

	/**
	 * paragraph 속성들을 css 객체로 반환한다.
	 * @param {object} pPr
	 * @private
	 */
	_getParagraphStyle(pPr) {
		let css = {},
			marginL = pPr.marL,
			marginR = pPr.marR,
			align = pPr.algn;

		if (align !== undefined) {
			css["text-align"] = this._getAlign(align);
		}
		if (marginL !== undefined) {
			css["margin-left"] = Utils.emuToPx(marginL);
		}
		if (marginR !== undefined) {
			css["margin-right"] = Utils.emuToPx(marginR);
		}

		return css;
	}

	/**
	 * line spacing 속성값을 반환한다.
	 * @param pPr
	 * @param refHeight
	 * @returns {{"line-height": number}}
	 * @private
	 */
	_getLineSpacingPercent(pPr, refHeight) {
		let lnSpc = pPr.lnSpc || 1;
		if (lnSpc.hasOwnProperty("spcPct")) {
			return refHeight * (lnSpc.spcPct / 100000);
		}
	}

	/**
	 * rPr로부터 css 속성들을 만들어 반환한다.
	 * @param {object} rPr
	 * @private
	 */
	_getRunStyle(rPr) {
		return this._getFontStyle(rPr);
	}

	// /**
	//  *
	//  * @param hyperlink
	//  * @private
	//  */
	// function _applyHyperlink(hyperlink) {
	//
	// }

	/**
	 * txBody style 속성들을 설정한다.
	 * @param {Element} div
	 * @param {object} bodyPr
	 * @private
	 */
	_applyBodyPr(div, bodyPr) {
		let txBodyStyle = this._getTextBodyStyle(bodyPr);
		$(div).css(txBodyStyle);
	}

	/**
	 * paragraph style 속성들을 설정한다.
	 * @param {Element} p
	 * @param {object} pPr
	 */
	applyPpr(p, pPr) {
		if (pPr) {
			$(p).css(this._getParagraphStyle(pPr));
		}
		// set default line-height
		p.style.lineHeight = STYLE_PROP.DEFAULT_LINE_HEIGHT;
	}

	/**
	 * line spacing을 설정한다.
	 * @param {Element} p
	 * @param {object} pPr
	 * @param {number} refHeight
	 */
	applyLineSpacing(p, pPr, refHeight) {
		let lineSpacing = this._getLineSpacingPercent(pPr, refHeight);
		p.style.lineHeight = lineSpacing + "px";
	}

	/**
	 * run style 속성들을 설정한다.
	 * @param {Element} span
	 * @param {object} rPr
	 */
	applyRpr(span, rPr) {
		$(span).css(this._getRunStyle(rPr));
	}

	/**
	 * txBody style 속성들을 설정한다.
	 * @param div
	 * @param bodyPr
	 */
	applyBodyPr(div, bodyPr) {
		this._applyBodyPr(div, bodyPr);
	}
}

export default TextStyleRenderer;