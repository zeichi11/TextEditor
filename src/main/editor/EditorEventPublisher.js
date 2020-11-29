const EditorEventPublisher = function () {
	let _subscribers = [];

	return {
		/**
		 * register subscribers
		 * @param {object} subscriber
		 */
		register: function (subscriber) {
			let index = _subscribers.indexOf(subscriber);
			if (index === -1) {
				_subscribers.push(subscriber);
			}
		},

		/**
		 * Publish Document Events
		 * @param {string} type
		 * @param {object} value
		 */
		publish: function (type, value) {
			_subscribers.every(function (subscriber) {
				subscriber.notify(type, value);
			});
		}
	}
}();

export default EditorEventPublisher;