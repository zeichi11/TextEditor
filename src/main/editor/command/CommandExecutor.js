import CommandFactory from './CommandFactory';
import UndoRedo from './UndoRedo';

class CommandExecutor {
	/**
	 * create command.
	 * @param {string} type
	 * @returns {*}
	 */
	static createCommand(type) {
		return CommandFactory.createCommand(type);
	}

	/**
	 * format command를 실행한다.
	 * @param {string} type
	 * @param {object} value
	 * @param {object} range
	 */
	static execCommand(type, value, range) {
		let command = this.createCommand(type);

		if (command) {
			command.execute(value, range);
		}
	}

	/**
	 * contentCommand를 실행한다.
	 * @param {object} cmd
	 * @param {object} rCmd
	 * @param {boolean} fromUndo
	 */
	static execContentCommand(cmd, rCmd, fromUndo) {
		if (!fromUndo) {
			UndoRedo.push(cmd, rCmd);
		}

		if ((cmd.value.hasOwnProperty("needToRender") && cmd.value.needToRender)) {
			this.execCommand(cmd.type, cmd.value, cmd.range);
		}
	}
}

export default CommandExecutor;