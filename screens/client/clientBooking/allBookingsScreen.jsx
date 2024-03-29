import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Dimensions, ScrollView,ImageBackground,StatusBar } from 'react-native';

import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";
import {Button } from 'react-native-elements';
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import BookingCard from '../../../components/BookingCard';
import moment from 'moment';
import 'moment/locale/ar-dz';
import { useDispatch, useSelector } from 'react-redux';
import { getClientBookings, expiredbookings } from '../../../store/actions/bookingsActions';

import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import { LinearGradient } from 'expo-linear-gradient';

const screen = Dimensions.get("window");



  ///////////////////////////////////////////////////////////////////////
const AllBookingsScreen = (props) => {

  const client= useSelector(state=>state.clients.client);
  if(client[0] && client[0].lang){
    moment.locale("fr");
    LocaleConfig.locales['fr'] = {
      monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
      today: 'Aujourd\'hui'
    };
    LocaleConfig.defaultLocale = 'fr';
  }else{
    moment.locale("ar-dz");
    LocaleConfig.locales['ar'] = {
      monthNames: ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
      monthNamesShort: ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
      dayNames: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      dayNamesShort: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      today: 'اليوم'
    };
    LocaleConfig.defaultLocale = 'ar';
  }
  
const allBookings = useSelector(state => state.bookings.bookings);
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  
const tokens = useSelector(state=>state.tokens.clientTokens);
//Selected Date State
const [selectedDate , setSelectedDate] = useState(moment(moment().format("YYYY-MM-DD")).format());

//Selected Date French Text 
const [selectedDateText , setSelectedDateText] = useState(moment().format('LL'));

const [dayBookings , setDayBookings] = useState([]);

//calendar selected Date object
 const [selectedDay , setSelectedDay] = useState(moment().format('ddd')) ;

 const [isLoading , setLoading] = useState(true);
 const [isRefreshing, setIsRefreshing] = useState(false);
 //Error Handler
 const [error, setError] = useState();


const dispatch = useDispatch();

const days = allBookings.map(e=>e.bookingDate);
let mark = {};

days.forEach(day => {
 if ( ( moment().isSame(day,"day") || moment().isBefore(day,"day"))) {

    mark[day] = { 
        selected: true, 
        marked: true , 
        selectedColor: Colors.colorF5,
        textColor: Colors.primary,
        color : Colors.colorH1 ,
    };
  }

//  }else if (moment().format("ll") === moment(day).format("ll")){


//  }
 
 else {

    mark[day] = { 
        selected: true, 
        marked: false , 
        selectedColor:"#F4686A",
        text: {
            color: 'black',
            fontWeight: 'bold'
          }
    };

 }
 

});

mark[selectedDate.substring(0,10)] = { 
  selected: true, 
  marked: false , 
  selectedColor:Colors.blue,
  text: {
      color: 'black',
      fontWeight: 'bold'
    }
};

/**************************************************************************************** */
//get ALL CLIENT BOOKINGS
// const getAllClientBookings = useCallback(async ()=>{

//     try{
//         await dispatch(getClientBookings("+213553633809"));

//       }catch(err){
//           console.log(err);
//         throw err ;
//       }
  
  
//   },[dispatch]);
  


// //Dispatch and get the bookings 
// useEffect(()=>{
//             setLoading(true);
//             getAllClientBookings();
//             setLoading(false);
 
// },[getAllClientBookings])




/*************************************************************** */
// //Cancel EXPIRED BOOKINGS
const expired = useCallback(async ()=>{

  
  try{
    setError(false);
    setIsRefreshing(true);
      setLoading(true);
      await dispatch(expiredbookings(clientID,tokens));
      await dispatch(getClientBookings(clientID));
      setIsRefreshing(false);
     setLoading(false);

    }catch(err){
      
      setError(true);

      throw err ;
    }


},[dispatch,allBookings]);


useEffect(()=>{
  expired();
},[])


useEffect(()=>{

const willFocusSub= props.navigation.addListener(
  'willFocus',
  () => {
    expired();
  }
);
return ()=>{
  willFocusSub.remove();
};
},[expired]);



/**************************************************************************************** */


const selectedDateHandler = (date) => {
// console.log(allBookings[days.indexOf(date.dateString)])
const dayBooks = allBookings.filter(bookings => bookings.bookingDate === date.dateString );

setSelectedDateText(moment(date.dateString).format('LL'));
setDayBookings ([...dayBooks]);

setSelectedDay(moment(date.dateString).format('ddd'));
setSelectedDate(moment(date.dateString).format());
 

};

/**************************************************************************************** */
//TODAYS BOOKINGs




useEffect(()=>{
 
  const todaysBookings= async ()=>{
      setLoading(true);
      const dayBooks = await allBookings.filter(bookings => moment(bookings.bookingDate).isSame(selectedDate,"day"));

      await setDayBookings([...dayBooks]);
      setLoading(false);
  }

 //if((selectedDateText ===moment (new Date()).format("ll")  ))
  todaysBookings();
  
},[expired])


/***************************************************************************************************************************************************************************** */
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
                onPress={expired}
                linearGradientProps={{
                    colors: ['#fd6d57', '#fd9054'],
                    start: {x: 0, y: 0} ,
                    end:{x: 1, y: 0}
                  }}/>
          </ImageBackground>);
};



//IF IS LOADING
if (isLoading) {
    return (
      <ImageBackground style= {styles.centered} source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}}>
        <ActivityIndicator size="large" color= {Colors.primary} />

      </ImageBackground>
    );
}



    return(
        <View style = {styles.container}>

      

        <View style={{}}  >

            <Calendar
            style = {{borderBottomLeftRadius : screen.width/14.4,borderBottomRightRadius : screen.width/14.4,overflow : "hidden",paddingVertical : screen.width/12, marginBottom : screen.width/24}}
           theme={{
            // selectedDayTextColor: Colors.primary,

            calendarBackground: "#fff",
            textSectionTitleColor: Colors.blue,
            textSectionTitleDisabledColor: Colors.blue,
            todayTextColor: '#2d4150',
            dayTextColor: Colors.blue,
            textDisabledColor: '#d9d9d9',
            dotColor: Colors.blue,
            selectedDotColor: Colors.primary,
            arrowColor: Colors.blue,
            disabledArrowColor: '#d9e1e8',
            monthTextColor: Colors.blue,
            indicatorColor: Colors.primary,
            textDayFontFamily: 'poppins',
            textMonthFontFamily: 'poppins-bold',
            textDayHeaderFontFamily: 'poppins',
           
            
            
            }}
            current = {selectedDate.substring(0,10)}
             markedDates = {mark}
             onDayPress={(date)=>selectedDateHandler(date)}
             />

        </View>
            <View style = {{width  : "90%",alignSelf : "center"}}>
            <Text style = {{fontSize : screen.width/24 , fontFamily : "poppins-bold",color:Colors.blue}}>{selectedDateText}</Text>

            </View>
                <ScrollView refreshing={isRefreshing} style = {styles.cardsContainer}>

                {

                    dayBookings.map((booking , index)=>{
                      
                     
                        return(
                        <BookingCard
                            key = {index}
                            start = {booking.start}
                            end = {booking.end}
                            bookingDate = {booking.bookingDate}
                            status = {booking.status}
                            amount = {booking.amount}
                            day = {selectedDay}
                            date = {moment(booking.bookingDate).date()}
                            navigation = {props.navigation}
                            services = {booking.services}
                            detail= {true}
                            barberId = {booking.barberId}
                            clientId = {booking.clientId}
                            cancelDate = {booking.date}
                            id = {booking.id}
                            type = "all"
                            address = {booking.address}
                            duration = {booking.bookingDuration}
                            statusText={client[0] && client[0].lang?polylanfr.Status:polylanar.Status}
                            horairesText={client[0] && client[0].lang?polylanfr.Times:polylanar.Times}
                            priceText={client[0] && client[0].lang?polylanfr.Price:polylanar.Price}
                            dzdText={client[0] && client[0].lang?polylanfr.DZ:polylanar.DZ}
                         /> 

                    )})
                    
                 

                }
                     
                
                       
                       


                </ScrollView>

    </View>


    )


};



const styles= StyleSheet.create({
    container : {
      flex : 1 , 
      backgroundColor : "#F5f0EB",
      overflow : "hidden",

    },
    cardsContainer: { 
             width : "100%",  
 
         
   },
   //////////////////////////////////////////////////////
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


export default AllBookingsScreen;
