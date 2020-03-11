/* global extensionId */

function init() {
	chrome.runtime.sendMessage(extensionId, {
		scriptLoaded: true
	})
}

function sendPlay() {
	console.log('sendPlay')
	srvTime(time => {
		chrome.runtime.sendMessage(extensionId, {
			videoChanged: {
				playing: true,
				currentTime: videoView.currentTime,
				startAt: time.getTime()
			}
		})
	})
}

function sendPause() {
	console.log('sendPause')
	srvTime(time => {
		chrome.runtime.sendMessage(extensionId, {
			videoChanged: {
				playing: false,
				currentTime: videoView.currentTime,
				startAt: 0
			}
		})
	})
}

var xmlHttp
function srvTime(callback) {
	callback(new Date())
	return
	xmlHttp = new XMLHttpRequest()
	xmlHttp.onload = () => {
		callback(new Date(xmlHttp.getResponseHeader('Date')))
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
					srvTime(time => {
						let delayTime = (time.getTime() - changeVideo.startAt) / 1000
						videoView.currentTime = delayTime + changeVideo.currentTime
					})
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
