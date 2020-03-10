/*global firebase*/
const db = firebase.firestore()
let ytState = {}
let ytApi = {
	create(tab, callback) {
		console.log(tab.id, 'create')
		fbApi.create(roomId => {
			ytApi.join(
				tab,
				roomId,
				() => {
					callback(roomId)
				},
				true
			)
		})
	},
	join(tab, roomId, callback, host = false) {
		console.log(tab.id, 'join', roomId)
		ytState[tab.id] = {
			host,
			mode: 0,
			roomId: roomId
		}

		fbApi.onSnapshot(ytState[tab.id], data => {
			if (!host) ytApi.changeVideo(tab, data)
		})

		ytApi.urlChanged(tab, tab.url, () => {})

		callback()
	},
	get(tab) {
		console.log(tab.id, 'get')
		return ytState[tab.id] || null
	},
	update(tab, state) {
		console.log(tab.id, 'update', state)
		ytState[tab.id] = state
	},
	remove(tab) {
		console.log(tab.id, 'remove')
		if (ytState[tab.id]) delete ytState[tab.id]
	},
	loadScript(tab, callback) {
		console.log(tab.id, 'loadScript')
		chrome.tabs.executeScript(
			tab.id,
			{
				code: `let extensionId = '${chrome.runtime.id}'`
			},
			() => {
				chrome.tabs.executeScript(
					tab.id,
					{
						file: `js/script.js`
					},
					() => {
						callback()
					}
				)
			}
		)
	},
	urlChanged(tab, url, callback) {
		console.log(tab.id, 'urlChanged', url)
		fbApi.update(ytState[tab.id], {
			url
		})
		ytApi.loadScript(tab, () => {
			callback()
		})
	},
	videoChanged(tab, changed) {
		console.log(tab.id, 'videoChanged', changed)
		if (ytState[tab.id]) fbApi.update(ytState[tab.id], changed)
	},
	changeVideo(tab, data) {
		console.log(tab.id, 'changeVideo', data)
		chrome.tabs.executeScript(tab.id, {
			code: `window.postMessage(${JSON.stringify({ changeVideo: data })}, '*')`
		})
		//window.postMessage({ changeVideo: data }, '*')
		//chrome.tabs.sendMessage(tab.id, { changeVideo: data })
	}
}

let fbApi = {
	//createRoom((roomId) => {})
	create(callback) {
		console.log('FireStore', 'create')
		db.collection('Room')
			.add({
				url: '',
				playing: false,
				playTime: {
					currentTime: 0,
					startAt: 0
				}
			})
			.then(docRef => {
				callback(docRef.id)
			})
			.catch(err => {
				alert(err)
			})
	},
	update(state, data) {
		console.log('FireStore', 'update', state.roomId, data)
		if (state.host)
			db.collection('Room')
				.doc(state.roomId)
				.update(data)
	},
	onSnapshot(state, callback) {
		db.collection('Room')
			.doc(state.roomId)
			.onSnapshot(doc => {
				callback(doc.data())
			})
	}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (ytState[tabId]) {
		if (changeInfo.url) ytApi.urlChanged(tab, changeInfo.url, () => {})

		if (changeInfo.status == 'complete') ytApi.loadScript(tab, () => {})
	}
})
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.videoChanged) ytApi.videoChanged(sender.tab, request.videoChanged)
})

window.ytApi = ytApi
