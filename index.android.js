/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   AppRegistry,
   Image,
   Platform,
   base64image,
   ToastAndroid,
   Dimensions,
   StyleSheet,
   Text,
   TouchableHighlight,
   View,
   UIManager
 } from 'react-native';
 import Camera from 'react-native-camera';
 import Clarifai from 'clarifai';
 import ImagePicker from 'react-native-image-picker';
 import { COLOR, Toolbar, ThemeProvider, ActionButton, Button, Card} from 'react-native-material-ui';

 var app = new Clarifai.App(
   'f9Yuf8R8ya_1uG45M8mseffbd2rajohrdBOw9Dgc',
   'dfXycYNdAE3XFOTZZgFuxMrPxihGhaFcmUsmuNbu'
 );

  const uiTheme = {
      palette: {
          primaryColor: COLOR.red500,
      },
      toolbar: {
          container: {
              height: 50,
          },
      },
  };

  var symptom= {
      cut: 'Apply bandaid to cut',
      bruise: 'Cover bruise'
   };



export default class pocketdocRN extends Component {
  constructor() {
    super();
    this.state = {
      imageSource:'https://s3.ca-central-1.amazonaws.com/pocket-doc/Logomakr_1KXbWa.png',
      data: '1. Take picture of wound',
      current: '2. Apply cure'
    }
      // Enable LayoutAnimation under Android
    if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {

        let source = 'data:image/jpeg;base64,' + response.data;
        this.setState({imageSource: source});

        console.log('uri:', ctx.state.imageSource)
        app.models.predict("Health", response.data).then(
          function(res){
            console.log('promise response:', JSON.stringify(res.data.outputs[0].data.concepts[0].name));
            console.log('promise response:', JSON.stringify(res.data.outputs[0].data.concepts[0].value));
            let myData = res.data.outputs[0].data.concepts[0].name;
            // console.log('mydata:', JSON.stringify(myData));

            ctx.setState({
               data: myData
            });

            if (ctx.state.data = 'cut') {
              ctx.setState({
                current: cure.symptom
              });
            }
            console.log('state:', JSON.stringify(ctx.state.data));

          },
          function(err){
            console.log('promise error:', err);
          }
        );
      }
    });
  }


  render() {
    ctx = this;
    console.log('render state:',this.state.imageSource);

    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <Toolbar style={styles.tool}
            leftElement="menu"
            centerElement="PocketDoc"
          />
          <View style={styles.incontainer}>
            <Card>
              <Image
                source={{uri: this.state.imageSource}}
                style={styles.image}
              />
            </Card>
          </View>
            <Card>
              <Text style={styles.response}>{this.state.data}</Text>
            </Card>
            <Card>
              <Text style={styles.response}>{this.state.current}</Text>
            </Card>
          <Button raised accent onPress={this.selectImage.bind(this)} text="Take picture" />
        </View>
    </ThemeProvider>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  response: {
    margin: 10,
    fontSize: 25,
    alignSelf: 'stretch'
  },
  image: {
    margin: 20,
    height:300,
    width: 300
  }
});

AppRegistry.registerComponent('pocketdocRN', () => pocketdocRN);
