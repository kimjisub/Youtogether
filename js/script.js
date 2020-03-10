/* global extensionId */
let sendPlay = () => {
	console.log('sendPlay')
	chrome.runtime.sendMessage(extensionId, {
		videoChange: {
			playing: true,
			playTime: {
				currentTime: videoView.currentTime,
				startAt: new Date().getTime()
			}
		}
	})
}

let sendPause = () => {
	console.log('sendPause')
	chrome.runtime.sendMessage(extensionId, {
		videoChange: {
			playing: false
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
	// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// 	console.log(request, sender)
	// })
	if (videoView.paused) sendPause()
	else sendPlay()
}
