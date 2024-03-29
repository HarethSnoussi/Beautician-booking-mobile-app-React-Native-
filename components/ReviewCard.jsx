import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TextInput, KeyboardAvoidingView,ActivityIndicator, Alert} from 'react-native';
import { Button , Rating, Overlay, AirbnbRating,Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import { useDispatch } from 'react-redux';
import { addreview, updateReview } from '../store/actions/reviewsActions';
import { TouchableOpacity } from 'react-native-gesture-handler';



const screen = Dimensions.get("window");
const ReviewCard = props =>{
  let cardContainerStyle = styles.cardContainer;
  let titleStyle = styles.title;
  let adressStyle = styles.adress;

  if(screen.width > 500 ) {
    cardContainerStyle = styles.cardContainerBig;
    titleStyle = styles.titleBig;
    adressStyle = styles.adressBig;
  }
  const [visible, setVisible] = useState(false);
  const [mark , setMark] =useState(2.5);
  const [comment,setComment] = useState("");

const dispatch = useDispatch();

const toggleOverlay = async ()=>{

const barberReview = await props.allReviews.filter(review=>review.clientId === props.clientId && review.barberId === props.barberId) ;



if(barberReview.length > 0){
  setComment(barberReview[0].comment);
  setMark(barberReview[0].mark);
}
setVisible (previous => !previous);
}


const ratingMark  = (mark)=>{
setMark(mark);
} ;

const closeOverlay = () =>{

setVisible(false);
setComment("");
setMark(2.5);

}



const submitReview = async ()=>{


const barberReview = await props.allReviews.filter(review=>{ return ( review.clientId === props.clientId && review.barberId === props.barberId)}) ;



if(barberReview.length === 0){
  try {
    await dispatch (addreview({clientId : props.clientId,barberId : props.barberId , comment :comment,mark : mark }))
    setVisible (previous => !previous);
    Alert.alert(
      props.feedbackSent,
      props.feedbackSentWithSuccess,
      [
        { text: props.OK, onPress: () =>{} }
      ],
      { cancelable: false }
    );
    
  } catch (error) {
    Alert.alert(
      props.feedbackNoSent,
      props.failedToSend,
      [
        { text: props.OK, onPress: () =>{} }
      ],
      { cancelable: false }
    );
  }
 
}

else {
try {
  await dispatch (updateReview({clientId : props.clientId,barberId : props.barberId , comment :comment,mark : mark }))
  setVisible (previous => !previous);
  Alert.alert(
    props.feedbackSent,
    props.feedbackSentWithSuccess,
    [
      { text: props.OK, onPress: () =>{} }
    ],
    { cancelable: false }
  );
} catch (error) {
  Alert.alert(
    props.feedbackNoSent,
    props.failedToSend,
    [
      { text: props.OK, onPress: () =>{} }
    ],
    { cancelable: false }
  );
}
 



}


};
    return(
       
        <View  style = {styles.cardContainer}>
      


      <Overlay isVisible={visible} onBackdropPress={closeOverlay} overlayStyle = {styles.overlayContainer}>
     
      <View style = {{flex : 1}}>
   
     <View style = {styles.overlayText}>
            <Text style ={{fontFamily : "poppins-bold",fontSize : screen.width/26,color : "#525252"}}>{props.writeAcomment}</Text>

     </View>
     <KeyboardAvoidingView behavior = "padding" style = {{height : "65%"}}   keyboardVerticalOffset={5}>
     <View style = {styles.ratingContainer} >
    <View>
     <Rating
      onFinishRating={mark =>ratingMark(mark)}
      style={{marginRight : "5%"}}
      fractions = {1}
      style = {styles.rating}
      ratingColor = "#FE9654"          
      ratingBackgroundColor={'#323446'}
      tintColor='#fff' 
      type='custom'
      imageSize = {screen.width * 0.08}
      startingValue = {mark}
      minValue = {0.5}
      />
      </View>
    <View style = {{paddingTop : screen.width/72}}>
     <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/24,color : Colors.secondary}}>{mark}/5</Text>
     </View>

     </View>


     <View style = {styles.commentContainer}>
      
     <TextInput
        placeholder={props.placeholderTextInput}
        autoCorrect = {false}
        multiline = {true}
        numberOfLines = {5}
        maxLength = {150}
        style ={{ textAlignVertical: 'top'}}
        onChangeText={text => setComment(text)}
        value = {comment}
        returnKeyType="send"
        textBreakStrategy = "balanced"
        />

     </View>
     </KeyboardAvoidingView>
     <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center" }} 
                   title = {props.sendText}
                   titleStyle = {{fontFamily : "poppins-bold",fontSize : screen.width/26}}
                   buttonStyle = {{borderRadius : screen.width/24}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                 onPress ={submitReview}
            
                   />

     </View>
    
      </Overlay>

        <View   style = {styles.cardImage}> 
        <TouchableOpacity onPress = {props.profile} >
        <Image source = {{uri:`http://95.111.243.233/profileImages/barber/${props.image}`}} style = {styles.image}  />
</TouchableOpacity>
        </View>

        <View style = {styles.cardText}>

        <View>
              <View style= {styles.name}>
                <Text  onPress = {props.profile} style = {{fontFamily : "poppins-bold", fontSize : screen.width/26}} >{props.name + " " + props.surname}</Text>
                <TouchableOpacity style = {{flexDirection : "row"}} onPress = {toggleOverlay}>
             
                <EvilIcons name="pencil" size={24} color="#9d9da1"  />
                <Text style = {{fontFamily : "poppins", color : "#9d9da1",fontSize : screen.width/30}}>{props.feedbackTitle}</Text>
                </TouchableOpacity>
              </View>
              <Text  onPress = {props.profile}  style = {{fontFamily : "poppins", color : "#9d9da1",fontSize : screen.width/30}} >
              {props.region + "-" + props.wilaya}
              </Text>
       </View>

              <View style= {styles.extra}>
              <View  style= {styles.extraHours}>
              <TouchableOpacity onPress = {props.profile} style = {{flexDirection : "row"}}>
            
              <Rating
                type='star'
                ratingCount={5}
                imageSize={screen.width/24}
                startingValue = {props.mark === null ? 2.5 : props.mark}
                style = {styles.rating}
                ratingColor = "#FE9654"          
                type='custom'
                readonly = {true}
                ratingBackgroundColor={'#323446'}
              tintColor='#fff' 
               
                  />
                    <Text>{props.mark === null ? 2.5 : props.mark}</Text>
                  </TouchableOpacity>
           
               
                </View>
               
                <Button  
                title ={props.buttonTitle} 
                buttonStyle = {{borderRadius : screen.width/65,paddingHorizontal : "5%"}}
                titleStyle = {{color :"#fff",fontSize : screen.width/30}}
                onPress = {props.navigate}
                containerStyle = {{width : "40%"}}
                linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />
              
              </View>

          
          </View>

    </View>


     );    
};


const styles= StyleSheet.create({
    container : {
            flex: 1 ,
            justifyContent : "flex-end",
          backgroundColor : "#fff"

    },

    searchBar :{
      width : "80%" , 
      alignSelf : "center",
      borderRadius : screen.width/18 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginBottom : screen.width/24 ,
      borderTopWidth : 0 , 
      borderBottomWidth : 0 
      },
      firstImage : {
        width : screen.width,
        height : screen.height * 0.20 ,
        overflow : "hidden",
      } ,
    
///////////////////////////////////////////////////////
cardContainer : {
  width : "97%",
  backgroundColor : "#fff",
  height : screen.height * 0.178,
  flexDirection : "row",
  justifyContent : "space-around",
  borderBottomWidth : 0.3,
  overflow : "hidden",
  alignSelf : "flex-end",
    
},
cardImage : {
    width : "28%",
    height : "80%",
    alignSelf : "center",
    overflow : "hidden",
  
    
},
image : {
  height : "100%",
  width : "100%",
   borderRadius : screen.width/14.4,
 
  

},
cardText : {

    width : "60%",
    height : "100%",
    alignSelf : "center",
    justifyContent : "space-around",
    overflow : "hidden",
 

},
name : {
    flexDirection : "row",
    justifyContent : "space-between",
    

},
extra : {
  flexDirection : "row",
  justifyContent : "space-between",


},
extraHours : {

 

},
extraButton : {
overflow : "hidden",
borderRadius : screen.width/14.4,


},
rating :{

alignSelf : "flex-start",
marginRight : screen.width/51.4

},

/***********************************************************************/
 //Overlay Style
 
overlayContainer : {
    height:"70%",
    width : "90%",
    borderRadius : screen.width/14.4,
   
    justifyContent : "space-around",
    overflow : "hidden"
},
overlayText : {
    height : "15%",
    width : "90%",
    alignItems : "center",
    alignSelf : "center",
    justifyContent : "center",
    borderBottomWidth : 0.3
},
ratingContainer : {
  height : "20%",

  justifyContent : "center",
  flexDirection : "row",
  alignItems : "center",
  

},
commentContainer:{
 backgroundColor : "#f9f9f9",
 borderRadius : screen.width/24,
 height : "60%",
 justifyContent : "flex-start",
 shadowColor: '#000',
 shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.5,
 shadowRadius: screen.width/180,
 elevation: 2,
 padding : "5%",
 width : "95%",
 alignSelf : "center",
 marginTop : "3%"



}
   

});


export default ReviewCard;