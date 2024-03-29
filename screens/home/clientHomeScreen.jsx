import React ,{useEffect, useState,useCallback,useRef}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar,ActivityIndicator,ScrollView, TouchableOpacity,LogBox } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Badge} from 'react-native-elements'
import polylanar from "../../lang/ar";
import polylanfr from "../../lang/fr";
import { LinearGradient } from 'expo-linear-gradient';

import {Ionicons,  MaterialIcons,Foundation} from "@expo/vector-icons";
import {Button ,Overlay} from 'react-native-elements';
import { useDispatch,useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/clientActions';
import Colors from "../../constants/Colors.js";

import TopBarbersCard from '../../components/TopBarbersCard.jsx';


import { getBarbers} from '../../store/actions/listActions';
import { getClientBookings, sendNotification } from '../../store/actions/bookingsActions.js';

import { expiredbookings } from '../../store/actions/bookingsActions.js';
import { getReviews } from '../../store/actions/reviewsActions';
import { addtoken ,currentToken,getTokens } from '../../store/actions/tokenActions';
import SentOverlay from '../../components/SentOverlay';
import NotifOverlay from '../../components/NotifOverlay';

const screen = Dimensions.get("window");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
LogBox.ignoreAllLogs();

const ClientHomeScreen = props =>{

  // OVerlay after booking Sent

const [sentVisible,setSentVisible] = useState(false);


const allBookings = useSelector(state => state.bookings.bookings);
  //Get ALL Barbers AND SAloons from the store to display three of them
  const allBarbers = useSelector(state => state.lists.barbers) ;


  const allSaloons = useSelector(state => state.lists.saloons) ;
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  
const stepThreeCpt = props.navigation.dangerouslyGetParent().getParam('stepThreeCpt');  

const client= useSelector(state=>state.clients.client);
const tokens = useSelector(state=>state.tokens.clientTokens);



// await dispatch(addtoken({expoToken:"HI",clientId:"557115451"}));
const [isLoading , setLoading] = useState(false);
const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
const [error, setError] = useState();
const dispatch = useDispatch ();

/************************************************************************************************** */
//Notifications 
const [expoPushToken, setExpoPushToken] = useState('');
// const [notification, setNotification] = useState(false);
const [notificationData,setNotificationData]= useState([]);
const [notificationsList,setNotificationsList] = useState([]);

const notificationListener = useRef();
const [visible, setVisible] = useState(false);
const responseListener = useRef();





   /*
   *******Fetch One client DATA
  */
 const getClient=useCallback(async()=>{
  try{
    setIsRefreshing(true);
    setLoading(true);
    await dispatch(getTokens(clientID));
    await dispatch(clientActions.setClient(clientID));
    setIsRefreshing(false);
   setLoading(false);

    }catch(err){
      setError(true);

      console.log(err);
    }
},[dispatch]);

  useEffect(()=>{

  getClient();

  },[getClient]);


  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getClient);
    return ()=>{
      willFocusSub.remove();
    };
  },[getClient]);

/********************************************************************** */
const getAllBarbers = useCallback(async (sex)=>{
  try{
    setError(false);
    setIsRefreshing(true);
    setLoading(true);
    await  dispatch(getBarbers(sex));
    await dispatch(getReviews(clientID));
    await dispatch(getClientBookings(clientID));
    await dispatch(expiredbookings(clientID,tokens));
    setIsRefreshing(false);
    setLoading(false);
  
    // await dispatch(expiredbookings("+213553633809"));
    }
    catch(err){
     
      setError(true);
      throw err ;
    }

},[dispatch,setError]);


useEffect (()=>{
  
if(client.length !== 0)
{
  getAllBarbers(client[0].sex);

}

},[dispatch,getAllBarbers,client]);

useEffect(()=>{
  const willFocusSub= props.navigation.addListener(
    'willFocus',
    () => {
     if(client.length!==0){
      getAllBarbers(client[0].sex);}
     
    }
  );
  return ()=>{
    willFocusSub.remove();
  };
  },[getAllBarbers,client]);



/********************************************************************** */

/************NOTIFICATION ***********************************/

useEffect(() => {

  if(client.length !== 0 )
  {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
  }
  




}, [client,tokens]);

useEffect(()=>{

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)


  notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
    // setNotification(notification);
   
    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    setNotificationData(notificationsList);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(async (notification) => {
 
    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    Notifications.dismissAllNotificationsAsync();
    notificationsList.push(notification.notification);
    setNotificationData(notificationsList);
  });



return () => {
  Notifications.removeNotificationSubscription(notificationListener);
  Notifications.removeNotificationSubscription(responseListener);
};



},[])






 //Overlay Handelr
 const sentOverlayHandler = ()=>{
     
  setSentVisible((previous) => !previous);
 
 }




async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  
    let finalStatus = existingStatus;
   
    if (existingStatus !== 'granted') {
      console.log(' push notification!');
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
     
      console.log('Failed to get push token for push notification!');
      return;
    }

      token = await (await Notifications.getExpoPushTokenAsync()).data;
      
      let  tokenIndex;
     
      if(tokens.length>0){
     
       tokenIndex = await tokens.findIndex(
        t => t.clientId === clientID && t.expoToken === token
      );
    
    }
if(clientID !== undefined )
{        if(tokenIndex < 0 || tokens.length ===0 ) {
         
            await dispatch(addtoken({expoToken:token , clientId : clientID}))
        }
}
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // console.log(token);
  dispatch(currentToken({token}))
  return token;
}



const notificationDataHandler = (list,sender) =>{

   setNotificationData(previous=>previous.filter(e=>e.request.identifier !== list))
   
    toggleOverlay();
    Notifications.dismissNotificationAsync(list);
    // Notifications.dismissAllNotificationsAsync();
  

  }
 


/************NOTIFICATION END ***********************************/
/**************OVERLAYS************************** */
useEffect(()=>{

  if(stepThreeCpt != undefined){

        setSentVisible(true);

  }


},[stepThreeCpt]);

const toggleOverlay = () => {

  setVisible(!visible);
  
};


/************************************************************************************************** */
/********************************************************************** */
if(error){
      
  return ( <ImageBackground  source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={{resizeMode:'cover',
  width:'100%', height:'100%',flex :1,justifyContent :"center"}}>
            <StatusBar hidden />
              <View style={{marginBottom:screen.width/36,alignSelf:'center'}}>
                <Text style={styles.noServicesText}>{polylanfr.WeakInternet}</Text>
              </View>
              <Button
                theme={{colors: {primary:'#fd6c57'}}} 
                title={polylanfr.Repeat}
                titleStyle={styles.labelButton}
                buttonStyle={styles.buttonStyle}
                ViewComponent={LinearGradient}
                onPress={getClient}
                linearGradientProps={{
                    colors: ['#fd6d57', '#fd9054'],
                    start: {x: 0, y: 0} ,
                    end:{x: 1, y: 0}
                  }}/>
          </ImageBackground>);
};


if (isLoading || allBarbers.length === 0 || client.length === 0 ) {



  return (

    <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.centered}>
                  <StatusBar hidden/>
                  <ActivityIndicator size='large' color={Colors.primary} />
              </ImageBackground>

  );
}
//***************************************************************************



    return(

      <View style ={styles.container}>
    
      <StatusBar hidden />
   
      <ScrollView refreshing={isRefreshing} >

            <ImageBackground source = {client[0].sex ==="Femme"? {uri:'http://95.111.243.233/assets/tahfifa/woman3.png'} :{uri:'http://95.111.243.233/assets/tahfifa/barber4.png'} } style = {styles.firstImage}  resizeMode ="stretch" imageStyle ={styles.image} >

        
            <View style = {styles.firstTitle}>  
         { <Text style = {styles.titleText}>{client[0] && client[0].lang?polylanfr.YourWellBeingStartFromHere:polylanar.YourWellBeingStartFromHere}
</Text> }
    

<View>
{ notificationData.length >0 && notificationData.map((item,index)=>{

  const e = Platform.OS === "ios" ? item.request.content.data.body : item.request.content.data ;
 if ( e.body !== undefined)
 { return(

  <NotifOverlay 
      key={index}
      close={()=>notificationDataHandler(item.request.identifier,"self")} 
      isVisible = {true} 
      start={e.start}
      end = {e.end}
      address = {e.address}
      bookingDate = {e.bookingDate}
      body = {e.body}
      type = {e.type}
      name = {e.name}
      surname = {e.surname}
      />


)}

})
  
}
 
    </View>
<View>
<SentOverlay   
          isVisible = {sentVisible} 
          sentOverlayHandler = {sentOverlayHandler}
          url ={{uri:'http://95.111.243.233/assets/tahfifa/sentGreen.png'}}
          title = "Merci !"
          body = "Votre réservation a été envoyée avec succès"
          buttonTitle = "Fermer"
          overlayType  ="success"
          />
</View>
          
          
            </View>
       
            </ImageBackground>


          <View style = {styles.textTopBarbers}>
                { client[0].sex ==="Homme" ? <Text style = {styles.bestText}>{client[0] && client[0].lang?polylanfr.BestBarbers:polylanar.BestBarbers}</Text> : <Text style = {styles.bestText}>{client[0] && client[0].lang?polylanfr.BestFemaleBarbers:polylanar.BestFemaleBarbers}</Text> }
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : client[0].sex ==="Homme" ? "coiffeurs" : "coiffeuses",clientID,overCpt : allBookings.length})} >
                <Text style = {styles.showAll}>
                {client[0] && client[0].lang?polylanfr.DisplayAll:polylanar.DisplayAllOfThem}
                </Text>
                </TouchableOpacity>
              </View>
              { 
           allBarbers.length > 0 ?
          <ScrollView refreshing={isRefreshing} style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false} >


           
         {allBarbers.slice(0,5).map((barber , index)=> {
         
         return(
            <TopBarbersCard 
            key = {index} 
             name = {barber.name}
             surname = {barber.surname}
             phone = {barber.phone}
             region = {barber.region}
             wilaya = {barber.wilaya}
             mark = {barber.mark}
             buttonTitle={client[0] && client[0].lang?polylanfr.Book:polylanar.Book}
             image={barber.image!==null?barber.image:'unknown.jpg'}
             navigateToBarberProfil={()=>props.navigation.navigate("Barber",{barberId : barber.id,clientID:clientID,overCpt:allBookings.length})}
             navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID,name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya,image:barber.image,overCpt : allBookings.length})}
            />
           )})
            }

          </ScrollView>
           
           :

           <View style = {styles.unAvailable}>  
         {  client[0].sex ==="Homme" ?
           <Text>
              Aucun Coiffeur Disponible !

           </Text> :

           <Text>
              Aucun Coiffeuse Disponible !

           </Text>
           }
           </View>
          
        
        }
         
</ScrollView>
</View>
   
     );    

    
};

ClientHomeScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
    headerStyle:{
        backgroundColor: 'white'
    },
    headerBackTitle : " ",
    headerTitle: () => (
      <Image 
      resizeMode="cover"
      style={{
        width:150,
        height:40,
        resizeMode:'contain',
        alignSelf: 'center'}}
      
      />
    )};
}


const styles= StyleSheet.create({
  container : {
      flex : 1,
      backgroundColor : "#fff"
  },
  /////////////////////////////////////////////
  firstImage : {
    width : screen.width,
    height : screen.height * 0.35 ,
    overflow : "hidden",
   
  } ,
  image : {
    height : "100%",
    width : "100%",
   
   
},

unAvailable : {
  height : "5%",
  width : "90%",
  alignSelf : "center",
  justifyContent : "center"

},
////////////////////////////////////////////////////////
 textTopBarbers : {
   flexDirection : "row",
   justifyContent : "space-between",
    marginTop : screen.width/24,
    marginHorizontal : screen.width/24,
   
    alignItems :"center"
 },
 topSalons : {
  width : "100%",
  height : screen.height * 0.4 ,

},
topBarbers : {
 
  width : "100%",
  height : screen.height * 0.5 ,
 
},
bestText :{
  fontSize : screen.width/24,
  fontFamily : "poppins-bold",
  color:Colors.blue
},
showAll : {
  fontFamily : "poppins",
  color : Colors.primary,
  fontSize :screen.width/30

},
titleText : {
    fontFamily :"poppins-bold",
    fontSize :screen.width/24,
    color : "#FFF"

},
///////////////////////////////////////////////////

 /////////////////////////////////////////////////
 searchBar :{
  width : "80%" , 
  alignSelf : "center",
  borderRadius : screen.width/18 , 
  backgroundColor : "rgba(52, 52, 52, 0)" ,
  marginTop : screen.width/24,
  borderTopWidth : 0 , 
  borderBottomWidth : 0 
  },

  firstTitle : {
 
    alignSelf : "center",
    alignItems : "center",
  borderRadius : screen.width/24,
  marginTop : screen.width/10.3,
  justifyContent : "center",
 

  },
  centered: {
    flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:'100%',
   height:'100%',
   resizeMode:'cover'
  },
  buttonStyle:{
    borderColor:'#fd6c57',
    width:'40%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    marginTop:screen.width/36,
    alignSelf :"center"
    
   },
   labelButton:{
    color:'#FFF',
    fontFamily:'poppins',
    fontSize:screen.width/22.5,
    textTransform:null,
    
  
    
   },
   

});





export default ClientHomeScreen ;
