const CMD_TYPE = {
		RESET: "reset",
		CONTENT: "content",
		TEXT: "text",
		SELECTION: "selection",
		BOLD: "bold",
		ITALIC: "italic",
		UNDERLINE: "underline",
		DOUBLE_UNDERLINE: "dblUnderline",
		STRIKETHROUGH: "strikethrough",
		FONT_SIZE: "fontSize",
		FONT_NAME: "fontName",
		FONT_COLOR: "fontColor",
		ALIGN: "Align",
		ANCHOR: "Anchor",
		INSET: "Inset"
	},
	DOC_EVENT = {
		OPEN: "open"
	},
	NAMES = {
		editorWrap: 'editor_wrap',
		editorWrapClass: '.editor_wrap',
		editor: 'editor',
		editorClass: '.editor',
		contentPara: "content_para",
		contentParaClass: ".content_para",
		textLayoutWrap: "text_layout_wrap",
		textLayoutWrapClass: ".text_layout_wrap",
		textLayout: "text_layout",
		textLayoutClass: ".text_layout",
	},
	CONSTANTS = {
		NODE_TYPE_TEXT: window.Node.TEXT_NODE,
		SELECTION_TYPE_RANGE: "Range",
		SELECTION_TYPE_CARET: "Caret",

		ALIGN_LEFT: 'left',
		ALIGN_RIGHT: 'right',
		ALIGN_CENTER: 'center',
		ANCHOR_TOP: 'top',
		ANCHOR_BOTTOM: 'bottom',
		ANCHOR_MIDDLE: 'middle',
		INSET_TOP: 'top',
		INSET_LEFT: 'left',
		INSET_RIGHT: 'right',
		INSET_BOTTOM: 'bottom'
	},
	KEY_CODE = {
		ENTER: 13,
		CTRL: 17,
		ALT: 18,
		TAB: 9,
		CAPS_LOCK: 20,
		ESC: 27,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		INSERT: 45,
		DELETE: 46,
		BACK_SPACE: 8,
		SHIFT: 16,
		DIVIDE_NUMPD: 111,
		F1: 112,
		F2: 113,
		F4: 115,
		F10: 121,
		F11: 122,
		F12: 123,
		LEFT_WINDOW: 91,
		RIGHT_WINDOW: 92,
		SELECT_KEY: 93,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		NUM_0: 48,
		NUM_5: 53,
		NUMPAD_5: 101,
		A: 65,
		B: 66,
		C: 67,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		X: 88,
		Y: 89,
		Z: 90,
		COLON: 186,
		EQUAL: 187,
		EQUAL2: 229,
		PLUS: 187,
		MINUS: 189,
		MULTIPLE: 56,
		DIVIDE: 191,
		PLUS_NUMPAD: 107,
		MINUS_NUMPAD: 109,
		PLUS_FF: 61, // firefox
		MINUS_FF: 173, // firefox
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		SPACE: 32,
		PLACEHOLDER: 229, // some browsers send this keyCode to the input field as some kind of placeholder for a combined character.
		META: 91,
		FORWARD_SLASH: 191,
		COMMA: 188,
	},
	MODIFIER_KEYS = {
		ctrl: 0,
		alt: 1,
		shift: 2
	},
	MESSAGE = {
		error: {
			openErrorEmptyDocJson: 'Editor open error. : docJson is empty',
			editorInitializeError: 'Editor initialize error.'
		}
	},
	STYLE_PROP = {
		ALIGN_LEFT: "l",
		ALIGN_CENTER: "ctr",
		ALIGN_RIGHT: "r",
		ALIGN_JUSTIFY: "just",
		ALIGN_JUSTIFY_LOW: "justLow",
		ALIGN_DISTRIBUTED: "dist",
		ALIGN_THAI_DISTRIBUTE: "thaiDist",

		TEXT_ANCHOR_TOP: "t",
		TEXT_ANCHOR_CENTER: "ctr",
		TEXT_ANCHOR_BOTTOM: "b",
		TEXT_ANCHOR_JUSTIFY: "just", // justified
		TEXT_ANCHOR_DISTRIBUTE: "dist", // distributed

		TEXT_VERT_OVERFLOW_TYPE_OVERFLOW: "overflow",
		TEXT_VERT_OVERFLOW_TYPE_ELLIPSIS: "ellipsis",
		TEXT_VERT_OVERFLOW_TYPE_CLIP: "clip",

		FONT_STYLE_UNDERLINE_DOUBLE: "dbl",

		DEFAULT_TOP_BOTTOM_INS: 46990,
		DEFAULT_LEFT_RIGHT_INS: 90170,

		DEFAULT_TOP_BOTTOM_COMMENT_INS: 19050,
		DEFAULT_LEFT_RIGHT_COMMENT_INS: 28575,

		NO_FILL: "noFill",
		SOLID_FILL: "solidFill",
		GRAD_FILL: "gradFill",
		BLIP_FILL: "blipFill",
		PATT_FILL: "pattFill",
		GRP_FILL: "grpFill",

		DEFAULT_LINE_HEIGHT: 1.6
	},
	REGEX = {
		newLine: /(?:\r\n|\r|\n)/g
	};

export { CMD_TYPE, DOC_EVENT, NAMES, CONSTANTS, KEY_CODE, MODIFIER_KEYS, MESSAGE, STYLE_PROP, REGEX };