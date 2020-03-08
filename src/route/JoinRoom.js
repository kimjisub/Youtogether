import React, { Component } from 'react'
import './CreateRoom.scss'
import { firestore } from '../firebase'

class App extends Component {
	constructor({ match, location }) {
		super()

		this.fs = firestore()

		this.fs
			.collection('Room')
			.doc(match.params.roomId)
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
