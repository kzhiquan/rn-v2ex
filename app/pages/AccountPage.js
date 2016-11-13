import React from 'react';
import { View, Text,ListView,StyleSheet,Image, TouchableOpacity} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';


import AddAccountContainer from '../containers/AddAccountContainer'
import EditAccountContainer from '../containers/EditAccountContainer'

class AccountPage extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
	    };
	    this.renderItem = this.renderItem.bind(this);
  	}

  	componentDidMount(){
		const { navigator, account } = this.props;
		if(account.accounts.size == 0){
			navigator.push({
				component : AddAccountContainer,
				name : "And An Account"
			});
		}
	}

  	onPressButton(){
  		console.log('this:', this);
  		const { navigator, currentAccount, accountActions } = this;
  		console.log('currentAccount', currentAccount, 'navigator', navigator, 'accountActions', accountActions);
  		accountActions.editAccountPageInit(currentAccount);
  		navigator.push({
  			component : EditAccountContainer,
  			name : 'Edit An Account'
  		})
  	}

  	renderItem(account){
  		//console.log('account', account);
  		const { navigator, accountActions } = this.props;
  		return (
	      <View style={styles.containerItem}>
	        <Image style={styles.itemHeader} source={{uri:account.avatar_url}} />
	        <View style={styles.itemBody}>
	          <Text>{account.name}</Text>
	        </View>
	        <TouchableOpacity onPress={this.onPressButton} currentAccount={account} navigator={navigator} accountActions={accountActions}>
				<Icon name="ios-cog" size={36} />
    		</TouchableOpacity>
	      </View>
  		);
  	}

	render() {
		//console.log('render account', this.props);
		const props = this.props;
		const { navigator, account } = this.props;
		var leftButtonConfig = {
			title: 'Add',
			handler: function onAdd() {
			  navigator.push({
			  	component: AddAccountContainer,
			  	name: 'Add an Account'
			  })
			}
		};

		var titleConfig = {
			title: 'Accounts',
		};

		
		let rows = Array.from(account.accounts.values());

		//console.log('rows:', rows);

		return (
			<View>
				<NavigationBar
        			title={titleConfig}
        			leftButton={leftButtonConfig}/>

				<ListView
					dataSource={this.state.dataSource.cloneWithRows(rows)}
					renderRow={this.renderItem}
					enableEmptySections={true}
				/>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	containerItem:{
	    flex:1,
	    flexDirection:'row',
	    borderBottomWidth:1,
	    padding:5,
    	justifyContent: 'space-between'
	},
	itemHeader:{
	    width:36,
	    height:36
	},
	itemBody:{
		width: 200,
		marginTop: 10
	},
	itemFooter:{
		marginRight:0
	}
});

export default AccountPage;




