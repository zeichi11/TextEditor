import Body from 'Body';
import { DOC_EVENT } from "../common/Constants";

const Document = function () {
	let _body = null,
		_observers = [];

	/**
	 * add observer
	 * @param {function} observer
	 */
	function _addObserver(observer) {
		_observers.push(observer);
	}

	/**
	 * notify
	 * @param {string} type
	 * @param {object} value
	 * @private
	 */
	function _notifyObservers(type, value) {
		_observers.forEach(function (observer) {
			observer(type, value);
		});
	}

	/**
	 * set model(private)
	 * @param {object} docJson
	 * @private
	 */
	function _setModel(docJson) {
		_body = new Body(docJson);
		_notifyObservers(DOC_EVENT.OPEN, _body);
	}

	return {
		/**
		 * set model(public)
		 * @param docJson
		 */
		setModel: function (docJson) {
			_setModel(docJson);
		},

		/**
		 * add observer
		 * @param {function} observer
		 */
		addObserver: function (observer) {
			_addObserver(observer);
		},

		/**
		 * notify
		 * @param {string} type
		 * @param {object} value
		 */
		notify: function (type, value) {
			_notifyObservers(type, value);
		},

		/**
		 * convert Document to JSON
		 * @returns {*|string|String}
		 */
		toJSON: function () {
			return _body.toJSON();
		},

		/**
		 * return Body
		 * @returns {Body}
		 */
		getBody: function () {
			return _body;
		}
	}
};

export default Document;