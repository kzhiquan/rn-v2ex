import React from 'react';
import { View, Text,ListView,StyleSheet,Image, TouchableOpacity} from 'react-native'

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';


import AddAccount from './AddAccount'
import EditAccount from './EditAccount'

class Accounts extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } )
	    };
	    this.renderItem = this.renderItem.bind(this);
  	}

  	onPressButton(){
  		//console.log('this', this);
  		const { navigator } = this;
  		navigator.push({
  			component : EditAccount,
  			name : 'Edit An Account',
  			props: this
  		})
  	}

  	renderItem(account){
  		return (
	      <View style={styles.containerItem}>
	        <Image style={styles.itemHeader} source={{uri:'https://cdn.v2ex.co/avatar/8464/0d60/69099_normal.png'}} />
	        <View style={styles.itemBody}>
	          <Text>{account.name}</Text>
	        </View>
	        <TouchableOpacity onPress={this.onPressButton} currentAccount={account} {...this.props}>
				<Icon name="ios-cog" size={36} />
    		</TouchableOpacity>
	      </View>
  		);
  	}

	render() {
		const props = this.props;
		const { navigator, account } = this.props;
		var leftButtonConfig = {
			title: 'Add',
			handler: function onAdd() {
			  navigator.push({
			  	component: AddAccount,
			  	name: 'Add an Account',
			  	props : props
			  })
			}
		};

		var titleConfig = {
			title: 'Accounts',
		};

		
		let rows = [];
		for ( let name of Object.keys(account.accounts) ){
			rows.push({
				name : name,
				password : account.accounts[name]
			})
		}

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

export default Accounts;




