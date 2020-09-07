import React from 'react';
import { StyleSheet, Text, View,Dimensions,ImageBackground } from 'react-native';
import Colors from "../constants/Colors";


//responsivity (Dimensions get method)
const height = Dimensions.get('window').height;



const ServiceCart = props =>{
     const isImage= {barbe:require('../assets/images/beard.jpeg'),hair:require('../assets/images/hairstyle.png')}; 
    
   

    return(
        <View style={styles.serviceContainer}>
          <View style={styles.backgroundContainer}>
            <ImageBackground style={styles.background} resizeMode='cover' source={isImage.hair}>
                    <View style={styles.firstRow}>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{'Service '+props.number}</Text>
                        </View>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{props.minute+' min'}</Text>
                        </View>
                    </View>
                    <View style={styles.secondRow}>
                          <Text style={styles.textPrice}>{props.price+' دج'}</Text>
                    </View>
            </ImageBackground>
          </View>
         
           <View style={styles.iconsContainer}>
               <View>
                   <Text style={styles.serviceName}>{props.name}</Text>
               </View>
           </View>
       </View>
     );    
};


const styles= StyleSheet.create({

  serviceContainer:{
    overflow:'hidden',
    shadowOpacity:1,
    shadowRadius:10,
    shadowColor:"#323446",
    elevation:5,
    alignSelf:'center',
    flexDirection:'row',
    width:'90%',
    marginVertical:10,
    borderRadius:10,
    height:height*0.15
  },
  backgroundContainer:{
    width:'65%',
    height:'100%',
    backgroundColor:'#f9f9f9'
  },
  background:{
    width:'100%',
    height:'100%',
    justifyContent:'space-between'
  },
  firstRow:{
    width:'90%',
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:5
  },
  serviceNumberContainer:{
    backgroundColor:'rgba(0,0,0,0.5)',
    paddingVertical:3,
    paddingHorizontal:10,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
  },
  number:{
    fontSize:9,
    fontFamily:'poppins',
    color:'#fff'
  },
  secondRow:{
    backgroundColor:'#fff',
    width:'50%',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'flex-end',
    borderTopRightRadius:30,
    borderTopLeftRadius:30
  },
  textPrice:{
    fontSize:18,
    color:Colors.primary,
    fontFamily:'poppins-bold'
  },
  serviceName:{
    color:Colors.blue,
    fontFamily:'poppins-bold',
    fontSize:12,
    alignSelf:'center'
  },
  iconsRow:{
    flexDirection:'row',
    justifyContent:'space-around',
    width:'100%'
  },
  iconsContainer:{
    width:'35%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
    paddingVertical:10,
    paddingHorizontal:10
  },
 
});

export default ServiceCart;