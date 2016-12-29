import React from 'react';
import { View, Text,ListView,StyleSheet,Image, TouchableOpacity, ActivityIndicator} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';


import AddAccountContainer from '../../containers/auth/AddAccountContainer'
import EditAccountContainer from '../../containers/auth/EditAccountContainer'

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
		if(Object.values(account.accounts).length == 0){
			navigator.push({
				component : AddAccountContainer,
				name : "And An Account"
			});
		}
	}

  	onAccountEdit(){
  		const { navigator, account, accountActions } = this;
  		accountActions.editAccountPageInit(account);
  		navigator.push({
  			component : EditAccountContainer,
  			name : 'Edit An Account'
  		})
  	}

  	onAccountChange(){
  		const { account, accountActions } = this;

  		//console.log('account', account);

  		accountActions.changeUserStart(account);
  	}

  	renderItem(account){
  		//console.log('account', account);
  		const { navigator, accountActions, auth, authActions } = this.props;
  		let isCurrentAccount = false;
  		if( auth.user && auth.user.name === account.name){
  			isCurrentAccount = true;
  		}
  		return (
	  		<TouchableOpacity onPress={this.onAccountChange} account={account} accountActions={accountActions}>
		      <View style={styles.containerItem}>
		        <Image style={styles.itemHeader} source={{uri:account.avatar_url}} />
		        <View style={styles.itemBody}>
		          <Text>{account.name}</Text>
		        </View>
		        {isCurrentAccount ? (<View style={styles.itemCurrentAccount}><Text style={{color:'red'}}>正在使用</Text></View>) : null }
		        <TouchableOpacity onPress={this.onAccountEdit} account={account} navigator={navigator} accountActions={accountActions}>
					<Icon name="ios-cog" size={36} />
	    		</TouchableOpacity>
		      </View>
		    </TouchableOpacity>
  		);
  	}

	render() {
		const props = this.props;
		const { navigator, account } = this.props;
		var rightButtonConfig = {
			title: 'Add',
			handler: function onAdd() {
			  navigator.push({
			  	component: AddAccountContainer,
			  	name: 'Add an Account'
			  })
			}
		};

		var leftButtonConfig = {
			title: 'Back',
			handler: function onBack() {
			  navigator.pop();
			}
		};

		var titleConfig = {
			title: 'Accounts',
		};

		
		//let rows = Array.from(account.accounts.values());
		let rows = Object.values(account.accounts);

		//console.log('rows:', rows);

		return (
			<View style={{flex:1}}>
				<NavigationBar
        			title={titleConfig}
        			leftButton={leftButtonConfig}
        			rightButton={rightButtonConfig}/>

				<ListView
					initialListSize = {5}
					dataSource={this.state.dataSource.cloneWithRows(rows)}
					renderRow={this.renderItem}
					enableEmptySections={true}
					removeClippedSubviews = {false}
				/>
				<ActivityIndicator
			        animating={account.isChanging}
			        style={styles.front}
			        size="large"
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
	itemCurrentAccount:{
		marginTop : 10
	},
	itemFooter:{
		marginRight:0
	},
	front:{
		position: 'absolute',
		top:300,
		left: (375-50)/2,
        width: 50,
        height:50,
        zIndex: 1
	},
	back:{
		width: 100,
        height: 100,
        backgroundColor: 'blue',
        zIndex: 0
	}
});

export default AccountPage;




