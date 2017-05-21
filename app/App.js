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

 var options = {
    title: 'Select an Image',
    storageOptions: {
      skipBackup: true,
    },
    maxWidth: 480
  };

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

  var symptom = {
      cut: 'Cure: Apply bandaid to cut',
      bruise: 'Cure: Cover bruise',
      puncture: 'Cure: wrap bandage around puncture, hold in place',
      shingles: 'Cure: Take Codeine for pain, rest in bed'
   };



export default class pocketdocRN extends Component {
  constructor() {
    super();
    this.state = {
      imageSource:'https://s3.ca-central-1.amazonaws.com/pocket-doc/Logomakr_1KXbWa.png',
      data: '1. Take picture of wound',
      cure: '2. Apply cure',
      accuracy: '0'
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

        // console.log('uri:', ctx.state.imageSource)
        app.models.predict("Health", response.data).then(
          function(res){
            console.log('promise response:', JSON.stringify(res.data.outputs[0].data.concepts));
            // console.log('promise response:', JSON.stringify(res.data.outputs[0].data.concepts[0].value));
            let myData = res.data.outputs[0].data.concepts[0].name;
            let myAccuracy = Math.floor(res.data.outputs[0].data.concepts[0].value*100);
            // console.log('mydata:', JSON.stringify(myData));


            ctx.setState({
               data: myData,
               accuracy: myAccuracy
            });
            // console.log('state:', JSON.stringify(ctx.state.data));
            // console.log(ctx.state.data.localeCompare('Bruise'));

            if (ctx.state.data.localeCompare('Cut') == 0) {
              ctx.setState({
                cure: symptom.cut
              });
            } else if (ctx.state.data.localeCompare('Bruise') == 0) {
              ctx.setState({
                cure: symptom.bruise
              });
            } else if (ctx.state.data.localeCompare('puncture') == 0) {
              ctx.setState({
                cure: symptom.puncture
              });
            } else if (ctx.state.data.localeCompare('shingles') == 0) {
              ctx.setState({
                cure: symptom.shingles
              });
            }
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
    // console.log('render state:',this.state.imageSource);
    // console.log('state in render:', JSON.stringify(this.state.data));
    // console.log('cure in render:', JSON.stringify(this.state.cure));

    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View>
          <Toolbar style={styles.tool}
            leftElement="menu"
            centerElement="PocketDoc"
          />
          <View>
              <Card>
              <Image
                source={{uri: this.state.imageSource}}
                style={styles.image}
              />
              </Card>
              <Card>
                <Text style={styles.response}>{ this.state.data != '1. Take picture of wound' ? "Symptom: " + ctx.state.data + ", " + this.state.accuracy + "% confidence" : this.state.data }
               </Text>
              </Card>
              <Card>
                <Text style={styles.response}>{this.state.cure}</Text>
              </Card>
              <Card>
                <Button raised accent onPress={this.selectImage.bind(this)} text="Take picture" />
              </Card>
          </View>

        </View>
    </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  response: {
    margin: 10,
    fontSize: 25,
    alignSelf: 'stretch'
  },
  image: {
    alignSelf: 'center',
    margin: 50,
    height:340,
    width: 340
  }
});

AppRegistry.registerComponent('pocketdocRN', () => pocketdocRN);
