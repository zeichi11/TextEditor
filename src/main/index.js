import EditorApp from './EditorApp';

(function () {
	const container = document.createElement('DIV');
	const editorApp = new EditorApp(container);
	document.body.appendChild(container);

	editorApp.open({
		ps: [
			{
				pPr: {},
				runs: [
					{
						r: {
							rPr: {},
							t: 'content'
						}
					}
				]
			}
		]
	}, {
		x: 0,
		y: 0,
		w: 500,
		h: 500
	});
})();