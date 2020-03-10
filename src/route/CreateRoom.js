/*global chrome*/
import React, { useState, useEffect } from 'react'
import './CreateRoom.scss'
import { firestore } from '../firebase'

function App(prop) {
	const fs = firestore()
	// const [playTime, setPlayTime] = useState({ currentTime: 0, startAt: 0 })
	// const [playing, setPlaying] = useState(false)

	// useEffect(() => {
	// 	fs.collection('Room')
	// 		.doc(prop.roomId)
	// 		.onSnapshot(doc => {
	// 			let data = (window.$data = doc.data())
	// 			console.log('Room Data Changed: ', data)
	// 		})
	// })

	return <div className="CreateRoom">{/* {playTime.currentTime}
			<br />
			{playTime.startAt}
			<br />
			{playing} */}</div>
}

export default App
