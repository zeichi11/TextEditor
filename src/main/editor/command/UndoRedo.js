const UndoRedo = function () {
	const BUFFER_LENGTH = 10;
	let _commandExecutor,
		_undoBuffer = [],
		_redoBuffer = [];

	return {
		/**
		 * init
		 * @param {object} commandExecutor
		 */
		init: function (commandExecutor) {
			_commandExecutor = commandExecutor;
		},

		/**
		 * undobuffer에 cmd 객체 추가
		 * @param {object} cmd
		 * @param {object} rCmd
		 */
		push: function (cmd, rCmd) {
			if (_undoBuffer.length >= BUFFER_LENGTH) {
				_undoBuffer.shift();
			}

			_undoBuffer.push({"cmd": cmd, "rCmd": rCmd});
			_redoBuffer = [];
		},

		/**
		 * undo
		 */
		undo: function () {
			let cmdObj = _undoBuffer.pop(),
				cmd;

			if (cmdObj) {
				cmd = cmdObj.rCmd;
				_commandExecutor.execCommand(cmd.type, cmd.value, cmd.range);
				_redoBuffer.push(cmdObj);
			}
		},

		/**
		 * redo
		 */
		redo: function () {
			let cmdObj = _redoBuffer.pop(),
				cmd;

			if (cmdObj) {
				cmd = cmdObj.cmd;
				_commandExecutor.execCommand(cmd.type, cmd.value, cmd.range);
				_undoBuffer.push(cmdObj);
			}
		},

		/**
		 * undo 가능 여부 반환
		 * @returns {*}
		 */
		isUndoable: function () {
			return _undoBuffer.length;
		},

		/**
		 * redo 가능 여부 반환
		 * @returns {*}
		 */
		isRedoable: function () {
			return _redoBuffer.length;
		},

		/**
		 * clear
		 */
		clear: function () {
			_undoBuffer = [];
			_redoBuffer = [];
		}
	};
}();

export default UndoRedo;



//
//
//
//
//
//
//
//
// class UndoRedo {
//
// 	static get BUFFER_LENGTH() {
// 		return 10;
// 	}
//
// 	constructor(commandExecutor) {
// 		this._commandExecutor = commandExecutor;
// 		this._undoBuffer = [];
// 		this._redoBuffer = [];
// 	}
//
// 	/**
// 	 * undobuffer에 cmd 객체 추가
// 	 * @param {object} cmd
// 	 * @param {object} rCmd
// 	 */
// 	push(cmd, rCmd) {
// 		if (this._undoBuffer.length >= UndoRedo.BUFFER_LENGTH) {
// 			this._undoBuffer.shift();
// 		}
//
// 		this._undoBuffer.push({"cmd": cmd, "rCmd": rCmd});
// 		this._redoBuffer = [];
// 	}
//
// 	/**
// 	 * undo
// 	 */
// 	undo() {
// 		let cmdObj = this._undoBuffer.pop(),
// 			cmd;
//
// 		if (cmdObj) {
// 			cmd = cmdObj.rCmd;
// 			_commandExecutor.execCommand(cmd.type, cmd.value, cmd.range);
// 			this._redoBuffer.push(cmdObj);
// 		}
// 	}
//
// 	/**
// 	 * redo
// 	 */
// 	redo() {
// 		let cmdObj = this._redoBuffer.pop(),
// 			cmd;
//
// 		if (cmdObj) {
// 			cmd = cmdObj.cmd;
// 			_commandExecutor.execCommand(cmd.type, cmd.value, cmd.range);
// 			this._undoBuffer.push(cmdObj);
// 		}
// 	}
//
// 	/**
// 	 * undo 가능 여부 반환
// 	 * @returns {*}
// 	 */
// 	isUndoable() {
// 		return this._undoBuffer.length;
// 	}
//
// 	/**
// 	 * redo 가능 여부 반환
// 	 * @returns {*}
// 	 */
// 	isRedoable() {
// 		return this._redoBuffer.length;
// 	}
//
// 	/**
// 	 * clear
// 	 */
// 	clear: function () {
// 		this._undoBuffer = [];
// 		this._redoBuffer = [];
// 	}
// }
