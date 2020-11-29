import Body from './Body';
import { DOC_EVENT } from '../common/Constants';
import EditorEventPublisher from '../EditorEventPublisher';

const Document = function () {
	let _body = null,
		_rectInfo = null;

	/**
	 * notify
	 * @param {string} type
	 * @param {object} value
	 * @private
	 */
	function _publish(type, value) {
		EditorEventPublisher.publish(type, value);
	}

	/**
	 * set model(private)
	 * @param {object} docJson
	 * @param {object} rectInfo
	 * @private
	 */
	function _setModel(docJson, rectInfo) {
		_body = new Body(docJson);
		_publish(DOC_EVENT.OPEN, _body);

		if (rectInfo) {
			_rectInfo = rectInfo;
			_publish(DOC_EVENT.RESIZE, rectInfo);
		}
	}

	return {
		/**
		 * set model(public)
		 * @param {object} docJson
		 * @param {object} rectInfo
		 */
		setModel: function (docJson, rectInfo) {
			_setModel(docJson, rectInfo);
		},

		/**
		 * notify
		 * @param {string} type
		 * @param {object} value
		 */
		publish: function (type, value) {
			_publish(type, value);
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
}();

export default Document;