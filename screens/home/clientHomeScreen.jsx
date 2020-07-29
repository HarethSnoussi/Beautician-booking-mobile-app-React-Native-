import React ,{useEffect, useState,useCallback}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar,ActivityIndicator } from 'react-native';

import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar ,Avatar,Rating, AirbnbRating,Button } from 'react-native-elements';

import { SwitchActions } from 'react-navigation';
import { useDispatch,useSelector } from 'react-redux';

import * as clientActions from '../../store/actions/clientActions';
import Colors from "../../constants/Colors.js";
import TopSalonsCard from '../../components/TopSalonsCard';
import TopBarbersCard from '../../components/TopBarbersCard.jsx';
import { getServices } from '../../store/actions/servicesActions.js';
import { getBarbers } from '../../store/actions/listActions';

import { expiredbookings } from '../../store/actions/bookingsActions.js';
const screen = Dimensions.get("window");


const ClientHomeScreen = props =>{
  console.disableYellowBox = true;
  
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  
// console.log(clientID);
const [isLoading , setLoading] = useState(false);

const dispatch = useDispatch ();

/********************************************************************** */
   /*
   *******Fetch One barber DATA
  */
 const getClient=useCallback(async()=>{
  try{
    await dispatch(clientActions.setClient(clientID));
    }catch(err){
      console.log(err);
    }
},[dispatch]);

  useEffect(()=>{
  setLoading(true);

  getClient();

  setLoading(false);
  },[getClient]);


  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getClient);
    return ()=>{
      willFocusSub.remove();
    };
  },[getClient]);

/********************************************************************** */
const getAllBarbers = useCallback(async ()=>{
  try{
    await  dispatch(getBarbers());
    }
    catch(err){
      throw err ;
    }
},[dispatch]);


useEffect (()=>{
setLoading(true);
getAllBarbers();
setLoading(false);

},[dispatch,getAllBarbers]);
/********************************************************************** */

if (isLoading) {
    
  return (

    <View style= {styles.centered}>

      <ActivityIndicator size="large" color= {Colors.primary} />

    </View>

  );
}

//***************************************************************************

    return(

      <View style ={styles.container}>
      <StatusBar hidden />
      
      <ScrollView >
            <ImageBackground source = {require("../../assets/pictures/barber4.png")} style = {styles.firstImage}  resizeMode ="stretch" imageStyle ={styles.image} >
{/*            
           <SearchBar placeholder=" Recherche salon , coiffeur"
        containerStyle = {styles.searchBar}
        inputContainerStyle = {{
                borderRadius : 25,
                backgroundColor :"white"
        }}
        lightTheme = {true} /> */}
            <View style = {styles.firstTitle}>  
            <Text style = {styles.titleText}>Trouver Votre Coiffeur</Text>
            </View>
       
            </ImageBackground>




          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Salons
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "Tous les salons"})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                
                </Text>
                </TouchableOpacity>
              </View>

          <ScrollView style ={styles.topSalons} horizontal showsHorizontalScrollIndicator  = {false}>

              <TopSalonsCard />

             <TopSalonsCard />
             <TopSalonsCard />


          </ScrollView>

          
        


          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Coiffeurs
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "Tous les coiffeurs "})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                
                </Text>
                </TouchableOpacity>
              </View>
          <ScrollView  style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false}>
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />

          </ScrollView>
         
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
      backgroundColor : "#ffffff"
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
////////////////////////////////////////////////////////
 textTopBarbers : {
   flexDirection : "row",
   justifyContent : "space-between",
    marginTop : 15,
    marginHorizontal : 15,
   
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
  fontSize : 18,
  fontFamily : "poppins-bold"

},
showAll : {
  fontFamily : "poppins",
  color : "#9d9da1"

},
titleText : {
    fontFamily :"poppins-bold",
    fontSize : 20,
    color : "#FFF"

},
///////////////////////////////////////////////////

 /////////////////////////////////////////////////
 searchBar :{
  width : "80%" , 
  alignSelf : "center",
  borderRadius : 20 , 
  backgroundColor : "rgba(52, 52, 52, 0)" ,
  marginTop : 15,
  borderTopWidth : 0 , 
  borderBottomWidth : 0 
  },

  firstTitle : {
    width : "80%" , 
    alignSelf : "center",
    alignItems : "center",
  borderRadius : 15,
  marginTop : 15,

  }
   

});

export default ClientHomeScreen;