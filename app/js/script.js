/* global extensionId */

timeOffset = 0
function init() {
	srvTime((serverTime, timeOffset_) => {
		timeOffset = timeOffset_

		setTimeout(disableAutoPlay, 1000)

		chrome.runtime.sendMessage(extensionId, {
			scriptLoaded: true
		})
		console.log('───────────────────────────────')
		console.log('Script Loaded', extensionId)
		console.log('href', document.location.href)
		console.log('timeOffset', timeOffset)
		main()
	})
}

videoView = null
onPlayed = () => {
	played()
}
onPaused = () => {
	paused()
}
onMessage = event => {
	if (event.data.changeVideo) changeVideo(event.data.changeVideo)
	if (event.data.detatch) detatch()
}
function main() {
	if (document.location.href.includes('youtube.com')) {
		videoView = document.querySelector('.html5-main-video')
		if (videoView) {
			videoView.addEventListener('play', onPlayed)
			videoView.addEventListener('pause', onPaused)
		}

		if (videoView.paused) paused()
		else played()
	}

	window.addEventListener('message', onMessage)
}

function changeVideo(data) {
	console.log('changeVideo', data)
	if (data) {
		if (videoView) {
			if (data.playing) {
				let delayTime = (new Date().getTime() + timeOffset - data.startAt) / 1000
				play(data, delayTime + data.currentTime)
			} else pause(data, data.currentTime)
		}
	}
}

function detatch() {
	console.log('detatch')
	videoView.removeEventListener('play', onPlayed)
	videoView.removeEventListener('pause', onPaused)
	window.removeEventListener('message', onMessage)
}

function disableAutoPlay() {
	if (document.getElementById('toggle').attributes['aria-pressed'].value == 'true') document.getElementById('toggle').click()
}

function played() {
	console.log('Video Played', videoView.currentTime)
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: true,
			currentTime: videoView.currentTime,
			startAt: new Date().getTime() + timeOffset
		}
	})
}

function paused() {
	console.log('Video Paused', videoView.currentTime)
	chrome.runtime.sendMessage(extensionId, {
		videoChanged: {
			playing: false,
			currentTime: videoView.currentTime,
			startAt: 0
		}
	})
}

function play(currentTime) {
	console.log('Play Video', currentTime)
	videoView.currentTime = currentTime
	videoView.play()
}

function pause(currentTime) {
	console.log('Pause Video', currentTime)
	videoView.currentTime = currentTime
	videoView.pause()
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

init()
