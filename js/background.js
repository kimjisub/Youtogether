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
					callback()
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
		db.collection('cities')
			.doc('SF')
			.onSnapshot(function(doc) {
				console.log('Current data: ', doc.data())
			})

		ytApi.urlChange(tab, tab.url, () => {})
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
	urlChange(tab, url, callback) {
		console.log(tab.id, 'urlChange', url)
		fbApi.update(ytState[tab.id], {
			url
		})
		ytApi.loadScript(tab, () => {
			callback()
		})
	},
	videoChange(tab, changed) {
		console.log(tab.id, 'videoChange', changed)
		if (ytState[tab.id]) fbApi.update(ytState[tab.id], changed)
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
	}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (ytState[tabId]) {
		if (changeInfo.url) ytApi.urlChange(tab, changeInfo.url)

		if (changeInfo.status == 'complete') ytApi.loadScript(tab)
	}
})
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.videoChange) ytApi.videoChange(sender.tab, request.videoChange)
})

window.ytApi = ytApi
