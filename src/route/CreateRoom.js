import React, { useState, useEffect } from 'react'
import './CreateRoom.scss'
import { firestore } from '../firebase'

function App(prop) {
	const fs = firestore()
	const [time, setTime] = useState(0)
	useEffect(() => {
		fs.collection('Room')
			.doc(prop.roomId)
			.onSnapshot(doc => {
				let data = (window.$data = doc.data())
				console.log('Room Data Changed: ', data)
			})
	})

	useEffect(() => {
		// eslint-disable-next-line no-undef
		chrome.tabs.executeScript({
			code: `let playListener = () => {
					console.log({
						playing: true,
						playTime: {
							currentTime: video.currentTime,
							startAt: new Date().getTime()
						}
					})
				};
		
				let pauseListener = () => {
					console.log({
						playing: false
					})
				};
				let video = document.querySelector('.html5-main-video');
				video.addEventListener('play', playListener);
				video.addEventListener('pause', pauseListener)
				`
		})

		return () => {
			// eslint-disable-next-line no-undef
			chrome.tabs.executeScript({
				code: `
					video.removeEventListener('play', playListener);
					video.removeEventListener('pause', pauseListener)
					`
			})
		}
	})

	return <div className="CreateRoom"></div>
}

export default App
