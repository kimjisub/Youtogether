import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './MainPage.scss'
import { firestore } from '../firebase'

function App(prop) {
	const fs = firestore()

	function createRoom() {
		fs.collection('Room')
			.add({
				url: '',
				playing: false,
				playTime: {
					currentTime: 0,
					startAt: 0
				}
			})
			.then(docRef => {
				prop.onCreated(docRef.id)
			})
			.catch(err => {
				alert(err)
			})
	}

	return (
		<div className="MainPage">
			<Button
				raised
				ripple
				onClick={() => {
					createRoom()
				}}>
				새로 만들기
			</Button>
		</div>
	)
}

export default App
