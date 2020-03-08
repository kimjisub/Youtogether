import React, { Component } from 'react'
import './CreateRoom.scss'
import { firestore } from '../firebase'

class App extends Component {
	constructor(props) {
		super(props)

		this.fs = firestore()

		const video = document.querySelector('.html5-main-video')
		video.addEventListener('play', () => {
			console.log({
				playing: true,
				playTime: {
					currentTime: video.currentTime,
					startAt: new Date().getTime()
				}
			})
		})
		video.addEventListener('pause', () => {
			console.log({
				playing: false
			})
		})

		this.fs
			.collection('Room')
			.doc(props.roomId)
			.onSnapshot(doc => {
				let data = (window.$data = doc.data())
				console.log('Room Data Changed: ', data)
			})
	}

	render() {
		return <div className="Calculator-Ratio"></div>
	}
}

export default App
