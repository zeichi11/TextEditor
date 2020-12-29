import { CMD_TYPE } from "../common/Constants";
import Bold from './format/font/Bold';
import Italic from './format/font/Italic';
import Underline from './format/font/Underline';
import FontColor from './format/font/FontColor';
import FontName from './format/font/FontName';
import FontSize from './format/font/FontSize';
import StrikeThrough from './format/font/Strike';
import Align from './format/font/Align';
import Anchor from './format/layout/Anchor';
import Inset from './format/layout/Inset';
import Content from './content/Content';
import Text from './content/Text';
import Delete from './content/Delete';
import Reset from './content/Reset';
import Selection from './content/Selection';
import Tab from './content/Tab';

const CommandFactory = {
	/**
	 * create command
	 * @param {string} type
	 * @returns {*}
	 */
	createCommand: function (type) {
		let command;
		switch (type) {
			case CMD_TYPE.BOLD:
				command = new Bold();
				break;
			case CMD_TYPE.ITALIC:
				command = new Italic();
				break;
			case CMD_TYPE.UNDERLINE:
				command = new Underline();
				break;
			// case TextEditorConst.cmdType.DOUBLE_UNDERLINE:
			// 	command = new DoubleUnderline();
			// 	break;
			case CMD_TYPE.FONT_COLOR:
				command = new FontColor();
				break;
			case CMD_TYPE.FONT_NAME:
				command = new FontName();
				break;
			case CMD_TYPE.FONT_SIZE:
				command = new FontSize();
				break;
			case CMD_TYPE.STRIKETHROUGH:
				command = new StrikeThrough();
				break;
			case CMD_TYPE.ALIGN:
				command = new Align();
				break;
			case CMD_TYPE.ANCHOR:
				command = new Anchor();
				break;
			case CMD_TYPE.INSET:
				command = new Inset();
				break;

			case CMD_TYPE.CONTENT:
				command = new Content();
				break;
			case CMD_TYPE.TEXT:
				command = new Text();
				break;
			case CMD_TYPE.DELETE:
				command = new Delete();
				break;
			case CMD_TYPE.RESET:
				command = new Reset();
				break;
			case CMD_TYPE.SELECTION:
				command = new Selection();
				break;
			case CMD_TYPE.TAB:
				command = new Tab();
				break;
		}

		return command;
	}
};

export default CommandFactory;