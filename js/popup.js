let background = chrome.extension.getBackgroundPage()
let ytApi = background.ytApi

let tab
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	tab = tabs[0]
	console.log('tab', tab)

	updateUI()

	document.getElementById('createRoom').onclick = () => {
		ytApi.create(tab, () => {
			updateUI()
		})
	}
	document.getElementById('joinRoom').onclick = () => {
		let roomId = document.getElementById('roomId').value
		ytApi.join(tab, roomId, () => {
			updateUI()
		})
	}
})

function updateUI() {
	let state = ytApi.get(tab)
	if (state) {
		document.getElementById('start').classList.add('hidden')
		document.getElementById('room').classList.remove('hidden')
		console.log('state', state)
	} else {
		document.getElementById('start').classList.remove('hidden')
		document.getElementById('room').classList.add('hidden')
	}
}
