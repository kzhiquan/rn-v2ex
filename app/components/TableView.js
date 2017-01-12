import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ListView,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  Dimensions,
  View,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';



let canLoadMore;
let page = 1;
let loadMoreTime = 0;

class TableView extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 } ),
    };
    canLoadMore = false;
    page = 1;
    activityIndicatorTop = 300;
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { actions, payload, path } = this.props;
    actions.load(payload.list, path);
  }


  _onItemClick(Item){
    console.log('item', item, 'renderItem should be override');
    this.props.onClick();
  }


  renderItem(item, sectionID, rowID, highlightRow) {
      return (
        <TouchableOpacity onPress={this._onItemClick}>
          <View>
            <Text>{`item-${sectionID}-${rowID}-renderItem should be override`}</Text>
          </View>
        </TouchableOpacity>
      )
  }

  onRefresh(){
    canLoadMore = false;
    page = 1;
    const { actions, payload, path } = this.props;
    actions.refresh(payload.list, path, page);
  }

  renderFooter(){
    const { payload } = this.props;
    if(payload.isLoadingMore){
      return (
        <View style={styles.footerContainer} >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={styles.footerText}>
            数据加载中……
          </Text>
        </View>
      );
    }
  }

  onScroll(){
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }


  onEndReached() {
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;

      const { actions, payload, path } = this.props;
      page += 1;
      actions.loadMore(payload.list, path, page);
    }
  }

  _onLayout(event){
    //console.log('nativeEvent', event.nativeEvent.layout);
    let top = event.nativeEvent.layout.height/2 - 25;
    this.setState({activityIndicatorTop:top});
  }

  _activityIndicatorStyle(){
    //console.log('top', this.state.activityIndicatorTop);
    return [styles.front, {top:this.state.activityIndicatorTop}]
  }

  render() {
    //console.log('this.props:', this.props);
    return (
      <View 
        style={styles.container}
        onLayout={this._onLayout.bind(this)}>

        <ListView
          initialListSize = {5}
          dataSource={this.state.dataSource.cloneWithRows(this.props.payload.list)}
          renderRow={this.renderItem.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          onEndReached={this.onEndReached.bind(this)}
          onScroll={this.onScroll.bind(this)}
          onEndReachedThreshold={-20}
          enableEmptySections={true}
          removeClippedSubviews = {false}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          refreshControl={
            <RefreshControl
              refreshing={ this.props.payload.isRefreshing }
              onRefresh={() => this.onRefresh()}
              title="Loading..."
            />
          }
        />

        <ActivityIndicator
          animating={ this.props.payload.isLoading }
          style={this._activityIndicatorStyle()}
          size="large"
        />

      </View>
    );

  }
}

TableView.propTypes = {

  navigator : React.PropTypes.object,
  onClick : React.PropTypes.func,

  actions : React.PropTypes.shape({
    load : React.PropTypes.func,
    refresh : React.PropTypes.func,
    loadMore : React.PropTypes.func,
  }),

  payload : React.PropTypes.shape({
    isLoading : React.PropTypes.bool,
    isRefreshing : React.PropTypes.bool,
    isLoadingMore : React.PropTypes.bool,
    list : React.PropTypes.array,
  }),
  path : React.PropTypes.string,
};


const {height, width} = Dimensions.get('window');
let borderColor = '#B2B2B2';
let cellBorderColor = '#EAEAEC';
let noteTextColor = '#BBC5CD';
let backgroundColor = 'white';


const styles = StyleSheet.create({
 //common
  front:{
      position: 'absolute',
      top:300,
      left: (width-50)/2,
      width: 50,
      height:50,
      zIndex: 1,
  },

  //custom
  container : {
    flex : 1,
    backgroundColor : backgroundColor,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
  },

});

function activityIndicatorStyle(){

}


export default TableView;



