import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TouchableOpacity, StatusBar,TouchableWithoutFeedback} from 'react-native';
import Colors from "../constants/Colors";
import { Button ,Overlay} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
const screen = Dimensions.get("window");
const NotifOverlay = props =>{


  
        return (
            <TouchableWithoutFeedback  style={{backgroundColor:"red"}} onPress = {props.close}>
          <Overlay 
        isVisible={props.isVisible}
        overlayStyle = {styles.overlayContainer}
        >
    <View style = {styles.contentContainer}>
                <View style = {styles.imageContainer}>
                <Image style={styles.image} source={require('../assets/pictures/sent.png')}/>
                </View>


                <View style = {styles.firstTextContainer}>
                <Text style = {{fontSize:screen.width/16,fontFamily:"poppins"}} >Mohamed Snoussi</Text>
                <Text style ={{letterSpacing:0.5,fontFamily:"poppins-bold",color:Colors.blue,fontSize:screen.width/28}} >vient de confirmer votre réservation</Text>
             
                </View>

                <View style = {styles.secondTextContainer}>
                
                <Text style = {{fontSize:screen.width/18,fontFamily:"poppins"}}>08:15 |  08:30</Text>
                </View>

                <View style = {styles.thirTextContainer}>

                <Text  style ={{fontFamily:"poppins",color:Colors.textGrey,fontSize:screen.width/28}} >20 Mars 2020</Text>
                <Text style ={{fontFamily:"poppins",color:Colors.textGrey,fontSize:screen.width/28}}>17 Rue Didouche Mourad - Blida </Text>
                </View>
     <View style = {styles.buttonsContainer}>


                <Button  
                title ="Mes Réservations" 
                buttonStyle = {styles.buttonStyle}
                titleStyle = {styles.buttonText}
                containerStyle = {{width:"60%",elevation:4}}
                onPress = {props.close}
                ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />
              
     </View>
    {/* <Text>avez vous réaliser le booking de  {props.booking.start + " "+props.booking.bookingDate}</Text>
    <Button title = "oui" onPress = {()=>props.toggleOverlay(props.booking.id,"réalisée")} />
              <Button title = "non" onPress = {()=>props.toggleOverlay(props.booking.id,"annulée")} /> */}
</View>
          </Overlay>
     
          </TouchableWithoutFeedback>
          
          );
    
    };
    
    
    const styles= StyleSheet.create({
    
      overlayContainer:
      {width :"100%",
    height :"100%",
    backgroundColor:"rgba(25,25,25,0.8)",
    overflow:"hidden",
    elevation:2,
    padding:0,
    justifyContent:"center",
    alignItems:"center"
  } ,
   contentContainer : 
      {
           width:"90%",
          height:"80%",
          backgroundColor:"#fff",
          justifyContent:"center",
          borderRadius:25
      },
      imageContainer : {
          height : "20%",
          marginBottom:"5%"
      },
      image:{
          height:"100%",
          width:"100%",
          resizeMode:"contain"
      },
      firstTextContainer : {
          alignSelf :"center",
          alignItems:"center",
          marginBottom:"10%",
          height:"10%",
          justifyContent:"space-between"
      },
      secondTextContainer :{
          alignSelf :"center",
          alignItems:"center"
      },
      thirTextContainer : {
          alignSelf :"center",
          alignItems:"center",
          height:"10%",
          marginBottom:"15%",
          justifyContent:"space-between"
      },
      buttonsContainer : {
          flexDirection:"row",
          justifyContent:"space-around"
      },
      buttonStyle : {
          borderRadius : 5,
          paddingHorizontal : "5%",
      
          borderRadius:25
  },
  buttonText :{
      color :"#fff",
      fontSize :screen.width/30,
      fontFamily:"poppins"
  }


   
  
  });


export default NotifOverlay;