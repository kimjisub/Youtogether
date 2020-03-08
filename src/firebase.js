import * as firebase from 'firebase'
let config = {
	apiKey: 'AIzaSyArj2mi2RRxE5cr63NJADkuBdUlERNaaiw',
	authDomain: 'youtogether-ac070.firebaseapp.com',
	databaseURL: 'https://youtogether-ac070.firebaseio.com',
	projectId: 'youtogether-ac070',
	storageBucket: 'youtogether-ac070.appspot.com',
	messagingSenderId: '539829445454',
	appId: '1:539829445454:web:f2bff792f0becf0e71741f'
}

export const firestore = () => {
	if (!firebase.apps.length) firebase.initializeApp(config)
	return firebase.firestore()
}
