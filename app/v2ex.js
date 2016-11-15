
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import { View, Text } from 'react-native'


import rootSaga from './sagas/index'
import App from './containers/App'
import LoadingView from './components/LoadingView';

/*const store = configureStore(undefined, ()=>{
	console.log('rehydration complete');

});

store.runSaga(rootSaga);*/


class V2ex extends React.Component{

	constructor(){
		super();
		this.state = {
			rehydrated : false,
		}
	}

	componentWillMount(){
		this.store = configureStore(undefined, ()=>{
			console.log('rehydration complete');
			this.setState({
				rehydrated : true,
			})
		});
		this.store.runSaga(rootSaga);
	}

	render(){

		if(!this.state.rehydrated){
			return <LoadingView />
		}

		return(
			<Provider store={this.store}>
				<App />
			</Provider>
		)
	}
}

export default V2ex;