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
				playTime: {
					currentTime: videoView.currentTime,
					startAt: time.getTime()
				}
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
				playTime: {
					currentTime: videoView.currentTime,
					startAt: time.getTime()
				}
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
			if (changeVideo.url != document.location.href) document.location.href = changeVideo.url
			if (videoView) {
				if (changeVideo.playing) videoView.play()
				else videoView.pause()

				srvTime(time => {
					let delayTime = (time.getTime() - changeVideo.playTime.startAt) / 1000
					videoView.currentTime = delayTime + changeVideo.playTime.currentTime
				})
			}
		}
	}
})

init()
