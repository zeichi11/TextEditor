import EditorApp from './EditorApp';
import Ui from './ui/Ui';

(function () {
	const WIDTH = 500;
	const HEIGHT = 500;
	const UI_HEIGHT = 50;
	let editor = document.createElement('DIV');
	let uiContainer = document.createElement('DIV');
	let container = document.createElement('DIV');

	const editorApp = new EditorApp(container);

	Ui.render(uiContainer);
	uiContainer.style.width = WIDTH + 'px';
	uiContainer.style.height = UI_HEIGHT + 'px';

	editor.appendChild(uiContainer);
	editor.appendChild(container);
	document.body.appendChild(editor);

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
		w: WIDTH,
		h: HEIGHT
	});
})();