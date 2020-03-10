/* global extensionId */

console.log('script loaded')

function sendPlay() {
	console.log('sendPlay')
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: true,
			playTime: {
				currentTime: videoView.currentTime,
				startAt: new Date().getTime()
			}
		}
	})
}

function sendPause() {
	console.log('sendPause')
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: false,
			playTime: {
				currentTime: videoView.currentTime,
				startAt: new Date().getTime()
			}
		}
	})
}

let videoView
if (document.location.href.includes('youtube')) {
	videoView = document.querySelector('.html5-main-video')
	if (videoView) {
		videoView.addEventListener('play', sendPlay)
		videoView.addEventListener('pause', sendPause)
	}

	window.addEventListener('message', event => {
		if (event.data.changeVideo) {
			let changeVideo = event.data.changeVideo
			console.log(changeVideo)
			if (changeVideo) {
				if (changeVideo.url != document.location.href) document.location.href = changeVideo.url
				if (changeVideo.playing) videoView.play()
				else videoView.pause()

				let delayTime = (new Date().getTime() - changeVideo.playTime.startAt) / 1000
				videoView.currentTime = delayTime + changeVideo.playTime.currentTime
			}
		}
	})

	if (videoView.paused) sendPause()
	else sendPlay()
}
