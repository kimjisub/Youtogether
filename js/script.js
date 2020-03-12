/* global extensionId */

let timeOffset = 0
function init() {
	if (document.getElementById('toggle').attributes['aria-pressed'].value == 'true') document.getElementById('toggle').click()
	srvTime((serverTime, timeOffset_) => {
		timeOffset = timeOffset_
		console.log('timeOffset', timeOffset)
		chrome.runtime.sendMessage(extensionId, {
			scriptLoaded: true
		})
	})
}

function sendPlay() {
	console.log('sendPlay')
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: true,
			currentTime: videoView.currentTime,
			startAt: new Date().getTime() + timeOffset
		}
	})
}

function sendPause() {
	console.log('sendPause')
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: false,
			currentTime: videoView.currentTime,
			startAt: 0
		}
	})
}

var xmlHttp
function srvTime(callback) {
	xmlHttp = new XMLHttpRequest()
	xmlHttp.onload = () => {
		let serverTime = new Date(xmlHttp.getResponseHeader('Date')).getTime()
		let localTime = new Date().getTime()
		let timeOffset = serverTime - localTime
		callback(serverTime, timeOffset)
	}
	xmlHttp.open('HEAD', window.location.href.toString(), true)
	xmlHttp.setRequestHeader('Content-Type', 'text/html')
	xmlHttp.send('')
}

let videoView
if (document.location.href.includes('youtube')) {
	videoView = document.querySelector('.html5-main-video')
	if (videoView) {
		videoView.addEventListener('play', sendPlay)
		videoView.addEventListener('pause', sendPause)
	}

	if (videoView.paused) sendPause()
	else sendPlay()
}

window.addEventListener('message', event => {
	if (event.data.changeVideo) {
		let changeVideo = event.data.changeVideo
		console.log(changeVideo)
		if (changeVideo) {
			if (videoView) {
				if (changeVideo.playing) {
					let delayTime = (new Date().getTime() + timeOffset - changeVideo.startAt) / 1000
					videoView.currentTime = delayTime + changeVideo.currentTime

					videoView.play()
				} else {
					videoView.currentTime = changeVideo.currentTime
					videoView.pause()
				}
			}
		}
	}
})

init()
