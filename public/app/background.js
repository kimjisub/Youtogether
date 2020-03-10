/*global chrome*/
/*global firebase*/

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: 'AIzaSyArj2mi2RRxE5cr63NJADkuBdUlERNaaiw',
	authDomain: 'youtogether-ac070.firebaseapp.com',
	databaseURL: 'https://youtogether-ac070.firebaseio.com',
	projectId: 'youtogether-ac070',
	storageBucket: 'youtogether-ac070.appspot.com',
	messagingSenderId: '539829445454',
	appId: '1:539829445454:web:f2bff792f0becf0e71741f'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
;(function() {
	const db = firebase.firestore()
	let tabState = {}
	let tabApi = {
		create: function(tab) {
			tabState[tab.id] = {
				mode: 0,
				roomId: '',
				videoView: null,
				onUrlChange: url => {
					console.log(tab.id, 'onUrlChange', url)
					this.detectVideoView(tab, () => {
						this.attatchListener(tab)
					})
					db.collection('Room')
						.doc(tabState[tab.id].roomId)
						.update({
							url
						})
				},
				playListener: function() {
					console.log(tab.id, 'play')
					db.collection('Room')
						.doc(tabState[tab.id].roomId)
						.update({
							playing: true,
							playTime: {
								currentTime: tabState[tab.id].videoView.currentTime,
								startAt: new Date().getTime()
							}
						})
				},
				pauseListener: function() {
					console.log(tab.id, 'pause')
					db.collection('Room')
						.doc(tabState[tab.id].roomId)
						.update({
							playing: true
						})
				}
			}
			tabState[tab.id].onUrlChange(tab.url)
		},
		get: function(tab) {
			return tabState[tab.id] || null
		},
		getOrCreate: function(tab) {
			let state = this.get(tab)
			if (!state) state = this.create(tab)
			console.log(tab.id, 'getOrCreate', state)
			return state
		},
		update: function(tab, state) {
			console.log(tab.id, 'update', state)
			tabState[tab.id] = state
		},
		remove: function(tab) {
			console.log(tab.id, 'remove')
			if (tabState[tab.id]) delete tabState[tab.id]
		},
		detectVideoView: function(tab, callback) {
			console.log(tab.id, 'detectVideoView')
			chrome.tabs.executeScript(
				tab.id,
				{
					code: `document.querySelector('.html5-main-video')`
				},
				result => {
					console.log(tab.id, 'detectVideoView', result)
					tabState[tab.id].videoView = result
					callback()
				}
			)
		},
		attatchListener: function(tab) {
			let state = tabState[tab.id]
			tab.videoView.addEventListener('play', state.playListener)
			tab.videoView.addEventListener('pause', state.pauseListener)
		}
	}

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.url) {
			if (tabState[tabId]) tabState[tabId].onUrlChange(changeInfo.url)
		}
	})

	window.tabApi = tabApi
})()
