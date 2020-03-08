import React, { useState, useEffect } from 'react'
import './CreateRoom.scss'
import { firestore } from '../firebase'

function component(prop) {
	useEffect(() => {
		this.fs = firestore()

		this.fs
			.collection('Room')
			.doc(prop.roomId)
			.onSnapshot(doc => {
				let data = (window.$data = doc.data())
				console.log('Room Data Changed: ', data)
			})
	})

	return <div className="JoinRoom"></div>
}

export default component
