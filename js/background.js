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
			roomId: roomId,
			detatchFirestore: null
		}

		ytState[tab.id].detatchFirestore = fbApi.onSnapshot(ytState[tab.id], (curr, prev) => {
			if (!host) {
				ytApi.changeWithData(tab, curr, prev)
			}
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
		if (ytState[tab.id]) {
			if (ytState[tab.id].detatchFirestore) ytState[tab.id].detatchFirestore()
			delete ytState[tab.id]
		}
	},
	loadScript(tab, callback) {
		console.log(tab.id, 'loadScript')
		chrome.tabs.executeScript(
			tab.id,
			{
				code: `console.log('Script Loaded');let extensionId = '${chrome.runtime.id}'`
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
	scriptLoaded(tab) {
		console.log(tab.id, 'scriptLoaded')
		fbApi.get(ytState[tab.id], data => {
			if (!ytState[tab.id].host) {
				ytApi.changeVideo(tab, data.video)
			}
		})
	},
	urlChanged(tab, url, callback) {
		console.log(tab.id, 'urlChanged', url)
		if (url.includes('youtube.com/watch')) {
			fbApi.update(ytState[tab.id], {
				url
			})
			ytApi.loadScript(tab, () => {
				callback()
			})
		}
	},
	videoChanged(tab, changed) {
		console.log(tab.id, 'videoChanged', changed)
		if (ytState[tab.id]) fbApi.update(ytState[tab.id], { video: changed })
	},
	changeWithData(tab, curr, prev) {
		console.log(tab.id, 'changeWithData', curr, prev)
		if (prev == undefined || curr.url != prev.url) ytApi.changeUrl(tab, curr.url)
		if (prev == undefined || JSON.stringify(curr.video) != JSON.stringify(prev.video)) ytApi.changeVideo(tab, curr.video)
	},
	changeUrl(tab, url) {
		console.log(tab.id, 'changeUrl', url)
		chrome.tabs.update(tab.id, { url })
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
				video: {
					playing: false,
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
	get(state, callback) {
		if (state)
			db.collection('Room')
				.doc(state.roomId)
				.get()
				.then(doc => {
					callback(doc.data())
				})
		else callback(doc.data())
	},
	onSnapshotPrev: {},
	onSnapshot(state, callback) {
		return db
			.collection('Room')
			.doc(state.roomId)
			.onSnapshot(doc => {
				let currData = doc.data()
				let prevData = this.onSnapshotPrev[state.roomId]
				callback(currData, prevData)
				this.onSnapshotPrev[state.roomId] = currData
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
	if (request.scriptLoaded) ytApi.scriptLoaded(sender.tab)
})

window.ytApi = ytApi
