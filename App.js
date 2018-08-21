import React, { Component } from 'react';
import { Image, Dimensions, View, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Content, Card, CardItem, Text, Button, Left } from 'native-base';
import Moment from 'moment';
import HTML from 'react-native-render-html';
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      posts: [],
    };
  }

  componentDidMount() {
        fetch(`https://www.techomoro.com/wp-json/wp/v2/posts?_embed`)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            posts: responseJson,
          })
        })
        .catch((error) => {
          console.error(error);
        }); 
  }
  
  render() {
    if (this.state.isLoading == true) {
      return(
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
          <ActivityIndicator size="large" color="#1C97F7" />
        </View>
      )
    }
    else{
    Moment.locale('en');    
    return (
      <Container>

        <Header androidStatusBarColor="#004447" style={{ backgroundColor: '#006064' }}>
          <Body style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <Title>TECHOMORO</Title>
          </Body>
        </Header>

        <Content>
        {this.state.posts.map((item, index) => (
          <Card style={{flex: 0}} key = {item.id}>
            <CardItem>
              <Left>
                <Body>
                  <Text style = {{ fontSize: 24, fontWeight:'bold' }}>{item.title.rendered}</Text>
                  <Text note>Published on: {Moment(item.date).format('d MMM Y')}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              {item._embedded['wp:featuredmedia'].filter( element => element.id == item.featured_media).map((subitem, index) => (
                  <Image source={{uri: subitem.media_details.sizes.medium.source_url}} style={{height: 200, width: 200, flex: 1}} key = {item.id}/>
                  ))}
            </CardItem>
            <CardItem>
                <HTML html={item.content.rendered} imagesMaxWidth={Dimensions.get('window').width} />
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Text>Author:</Text>
                  {item._embedded.author.filter( element => element.id ==item.author).map((subitem, index) => (
                  <Text key = {item.id}>{subitem.name}</Text>
                  ))}
                </Button>
              </Left>
            </CardItem>
          </Card>
        ))}
        </Content>
      </Container>
    )
  }
  }
}