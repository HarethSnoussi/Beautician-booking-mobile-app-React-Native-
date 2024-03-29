import React,{useState,useEffect,useCallback,useReducer} from 'react';
import {StyleSheet,View,AsyncStorage,Linking,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,ActivityIndicator,TouchableWithoutFeedback,Keyboard,Platform, ViewBase,StatusBar} from 'react-native';
import CustomInput from '../../../components/Input';
import {Button } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import {Ionicons,MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {useDispatch,useSelector} from "react-redux";
import * as authActions from '../../../store/actions/authActions';
import * as clientActions from '../../../store/actions/clientActions';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { currentToken, deleteToken } from '../../../store/actions/tokenActions';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';

const screen = Dimensions.get("window");


//UseReducer Input Management//////////////////////////////////////////////////////////////////////////////////
const Form_Input_Update = 'Form_Input_Update';
const formReducer=(state,action) =>{
    if(action.type === Form_Input_Update){
        const updatedValues = {
          ...state.inputValues,
          [action.inputID]:action.value
        };
        const updatedValidities = {
          ...state.inputValidities,
          [action.inputID]:action.isValid
        };
        let formIsValidUpdated = true;
        for(const key in updatedValidities){
          formIsValidUpdated = formIsValidUpdated && updatedValidities[key];
        }
        return{
          inputValues:updatedValues,
          inputValidities:updatedValidities,
          formIsValid:formIsValidUpdated
        };
    }
   
     return state;
    
};

const PlayerProfileScreen = props =>{

  
  const clientUID= props.navigation.dangerouslyGetParent().getParam('clientUID');
  const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');
  const myToken = useSelector(state=>state.tokens.currentToken);
  const [isLoading,setIsLoading]=useState(false);
  const [isLoadingImage,setIsLoadingImage]=useState(false);
  const dispatch = useDispatch();

  //get the client's data

  const client= useSelector(state=>state.clients.client);
  const [error, setError] = useState();

  const [isInfo,setIsInfo]= useState(true);
  const [isLocalisation,setIsLocalisation]= useState(false);

  /*
   *******Fetch One barber DATA
  */
 const getClient=useCallback(async()=>{
  try{
    setError(false);
    setIsLoading(true);
    await dispatch(clientActions.setClient(clientID));
    setIsLoading(false);

    }catch(err){
      setError(true);
      console.log(err);
    }
},[dispatch]);

  useEffect(()=>{
  getClient();
  },[getClient]);

  useEffect(()=>{

    const willFocusSub= props.navigation.addListener(
      'willFocus',
      () => {
        getClient();
      }
    );
    return ()=>{
      willFocusSub.remove();
    };
    },[getClient]);


  const URL = "https://tahfifaapp.com";
  const URLAbout = "https://tahfifaapp.com/qui-sommes-nous/";
  const url= ()=>{
    Linking.openURL(URL).catch((err) => {
      if(err){
        Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
    } 
    });
   };
   const url2= ()=>{
    Linking.openURL(URLAbout).catch((err) => {
      if(err){
        Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
    } 
    });
   };

  const info = ()=>{
    setIsInfo(true);
    setIsLocalisation(false);
  };
  const localisation = ()=>{
    setIsInfo(false);
    setIsLocalisation(true);
  };

  //States for complex information textInputs
 const [wilaya,setWilaya] = useState(client[0]!==null && client[0].wilaya?client[0].wilaya:null);

 const wilayas = ['Wilaya','Alger','Blida'];
 
 
 
 //picker only iOS function 
 const onPress = () =>{
   const wilayasIOS = ['Annuler','Alger','Blida'];    
   ActionSheetIOS.showActionSheetWithOptions(
     {
       options: wilayasIOS,
       cancelButtonIndex: 0
     },
     buttonIndex => {
       if (buttonIndex === 0) {
         // cancel action
       } else {
        setWilaya(wilayasIOS[buttonIndex]);
       } 
     }
   );  
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///ImagePicker

//state for image
const [pickedImage,setPickedImage]= useState(client[0]?client[0].image : undefined);


const verifyPermissions= async ()=>{
  const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
  if(result.status !== 'granted'){
      Alert.alert('Permissions insuffisantes!',
      'Vous devez accorder les autorisations de la caméra pour utiliser cette application.',
      [{text:client[0] && client[0].lang?polylanfr.Agree:polylanar.Agree}]);
      return false;
  }
  return true;
};

//////////////////////////****************************************************************************Image 1 
const takeImageHandler = async ()=>{

  try{
  const hasPermissions = await verifyPermissions();
  if(!hasPermissions){
      return;
  }
  let image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[60,60],
      quality:0.7,
      base64: true
  });
  
  if (!image.cancelled) {
    const imageSplit= image.uri.split('/');
    const imageName= imageSplit.pop();
    
    setPickedImage(imageName);
    
    setIsLoadingImage(true);
    await dispatch(clientActions.updateClientImage(clientID,image.base64,imageName));
    setIsLoadingImage(false);
    }
  }catch(err){
    console.log(err);
  Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
  }
};

  const takeLibraryHandler = async ()=>{

  try{
    const hasPermissions = await verifyPermissions();
    if(!hasPermissions){
        return;
    }

    let library = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing:true,
    aspect:[60,60],
    quality:0.7,
    base64: true
  });

  if (!library.cancelled) {
    const imageSplit= library.uri.split('/');
    const imageName= imageSplit.pop();
    
    setPickedImage(imageName);
    
    setIsLoadingImage(true);
    await dispatch(clientActions.updateClientImage(clientID,library.base64,imageName));
    setIsLoadingImage(false);
    }
  }catch(err){
    console.log(err);
    Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
    }
  
  };

    
    
    // logout handler
    const logout = async ()=>{
      await  dispatch(deleteToken(myToken));
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
    };
    const alertLogout = ()=>{
      Alert.alert(
        client[0] && client[0].lang?polylanfr.Warning:polylanar.Warning,
        client[0] && client[0].lang?polylanfr.DoYouWantToDisconnect:polylanar.DoYouWantToDisconnect,
       [{text:client[0] && client[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:logout},
        {text:client[0] && client[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
        return;
   };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
  const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      name:client[0]?client[0].name:'',
      surname:client[0]?client[0].surname:'',
      email:client[0]?client[0].email:'',
      address:client[0]?client[0].address:'',
      region:client[0]?client[0].region:''
    },
    inputValidities:{
      name:true,
      surname:true,
      email:true,
      address:true,
      region:true
    },
    formIsValid:true});
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
  disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  
  },[disaptchFormState]);

  

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update client's data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid && (wilaya!==null || wilaya!==wilayas[0])){
      
    try{
        setIsLoading(true);
         await dispatch(clientActions.updateClient(clientID,formState.inputValues.name,formState.inputValues.surname,
                                          formState.inputValues.email,formState.inputValues.address,wilaya,formState.inputValues.region));
        setIsLoading(false);                        
        Alert.alert(client[0] && client[0].lang?polylanfr.Congratulations:polylanar.Congratulations,client[0] && client[0].lang?polylanfr.SuccessfulDataSent:polylanar.SuccessfulDataSent,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
  
    }catch(err){
      console.log(err);
      Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
    }
    
    }else{
      Alert.alert(client[0] && client[0].lang?polylanfr.Error:polylanar.Error,client[0] && client[0].lang?polylanfr.EmptyFields:polylanar.EmptyFields,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
    }
  
  },[dispatch,clientID,formState,wilaya]);

  if(error){
      
    return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.activityIndicatorContainer}>
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

  if (isLoading) {

    return (
  
      <ImageBackground style= {styles.centered} source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color= {Colors.primary} />
      </ImageBackground>
  
    );
  }

  if(isLoadingImage){
    return <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.activityIndicatorContainer} >
            <StatusBar hidden />
            <ActivityIndicator size='large' color={Colors.primary} />
           </ImageBackground>
  };

  

  

    return(
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.firstCard}>
        <ImageBackground source={client[0] && client[0].sex==='Femme'?{uri:'http://95.111.243.233/assets/tahfifa/woman5.jpg'}:{uri:'http://95.111.243.233/assets/tahfifa/man1-1.jpg'}} style={styles.backgroundFirstCard} resizeMode='cover'>
          <View style={{width:'100%',height:'20%',alignItems:'flex-end',justifyContent:'center'}}>
           
        {!isLoading? <Button theme={{colors: {primary:'transparent'}}} icon={<Ionicons title = "check" name ='md-checkmark' color='#fff' size={screen.width/11.25} />} onPress={saveHandler}  buttonStyle={styles.buttonStyle2}/>:
                 <ActivityIndicator style={styles.buttonStyle2} color={Colors.primary}/>}
            
           
          </View>
        </ImageBackground>
     </View>
     <View style={styles.secondCard}>
          <View style={styles.secondCardContent}>
              <View style={styles.imageContainer}>
              {client[0] && pickedImage?<Image source={{uri:`http://95.111.243.233/profileImages/client/${pickedImage}`}} style={styles.image} />:client[0] && client[0].sex==='Homme'?
               <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.image} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.image} />}
              </View>
              <View style={styles.detailsContainer}>
                <View style={{width:'30%'}}>
                  <TouchableOpacity style={styles.iconFormCircle1} onPress={takeImageHandler}>
                    <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={screen.width/15.7} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconFormCircleGalery} onPress={takeLibraryHandler}>
                    <MaterialIcons title = "library" name ='photo-library' color='#FE457C' size={screen.width/15.7} />
                  </TouchableOpacity>
                </View>  
                <View style={{width:'70%'}}>
                  <Text style={styles.bnameText}>{client[0] && client[0].surname?client[0].surname: client[0] && client[0].lang?polylanfr.YourSurname:polylanar.Surname}</Text>
                  <Text style={styles.age}>{client[0] && client[0].wilaya?client[0].wilaya: client[0] && client[0].lang?polylanfr.City:polylanar.City}</Text>
                </View>
              </View>
          </View>
        </View>
        <View style={styles.menuContainer}>
             <TouchableOpacity onPress={info} style={{padding:screen.width/72,width:'50%',backgroundColor:isInfo?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isInfo?'#fff':'#fd6c57',fontFamily:'poppins'}}>{client[0] && client[0].lang?polylanfr.profileInfo:polylanar.profileInfo}</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={localisation} style={{padding:screen.width/72,width:'50%',backgroundColor:isLocalisation?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                 <Text style={{color:isLocalisation?'#fff':'#fd6c57',fontFamily:'poppins'}}>{client[0] && client[0].lang?polylanfr.MyAccount:polylanar.MyAccount}</Text>
             </TouchableOpacity>
        </View>
     {isInfo?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView keyboardVerticalOffset={screen.width/36} behavior={Platform.OS === "ios" ? "padding" : null}>
         
            <CustomInput
                id='name'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={screen.width/15.7} />}
                placeholder={client[0] && client[0].lang?polylanfr.Name:polylanar.Name}
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={client[0]?client[0].name:''}
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                minLength={3}
                autoCapitalize='sentences'
                backgroundColor='#fff'
                textColor={Colors.blue}
                shadowColorView='black'
                shadowOpacityView={0.5}
                shadowOffsetView={{width: 0, height:1}}
              
                elevationView={3}
                widthView='90%'
              />
           
            <CustomInput
              id='surname'
              rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={screen.width/15.7} />}
              placeholder={client[0] && client[0].lang?polylanfr.Surname:polylanar.Surname}
              keyboardType="default"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].surname:''}
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              minLength={3}
              autoCapitalize='sentences'
              backgroundColor='#fff'
              textColor={Colors.blue}
              shadowColorView='black'
              shadowOpacityView={0.5}
              shadowOffsetView={{width: 0, height:1}}
              elevationView={3}
              widthView='90%'
            />
          
            <CustomInput
                id='email'
                rightIcon={<MaterialIcons title = "email" name ='email' color='#323446' size={screen.width/15.7} />}
                placeholder={client[0] && client[0].lang?polylanfr.Email:polylanar.Email}
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={client[0]?client[0].email:''}
                initiallyValid={true}
                email
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                minLength={6}
                backgroundColor='#fff'
                textColor={Colors.blue}
                autoCapitalize='none'
                shadowColorView='black'
                shadowOpacityView={0.5}
                shadowOffsetView={{width: 0, height:1}}
                elevationView={3}
                widthView='90%'
              />
            <CustomInput
              id='address'
              rightIcon={<MaterialIcons title = "address" name ='map' color='#323446' size={screen.width/15.7} />}
              placeholder={client[0] && client[0].lang?polylanfr.Address:polylanar.Address}
              keyboardType="default"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].address:''}
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              minLength={12}
              autoCapitalize='sentences'
              shadowColorView='black'
              shadowOpacityView={0.5}
              shadowOffsetView={{width: 0, height:1}}
              elevationView={3}
              widthView='90%'
              backgroundColor='#fff'
              textColor={Colors.blue}
            />
          <View style={{ width:'90%',borderWidth:1,paddingLeft:screen.width/18,paddingRight:screen.width/32,borderRadius:screen.width/14.4,backgroundColor:'#fff',borderColor:wilaya!=='wilaya'?'#fff':Colors.primary,marginVertical:screen.width/72,height:screen.width/8,justifyContent:'center',shadowColor: 'black',shadowOpacity: 0.5,
                          shadowOffset: {width: 0, height:1},elevation: 3,overflow:Platform.OS==='ios'?'visible':'hidden',alignSelf:'center'}}>
            {Platform.OS === 'android' ? 
                      (<RNPickerSelect
                          value={wilaya}
                          useNativeAndroidPickerStyle={false}
                          style={{ inputIOS:{fontFamily:'poppins',fontSize:screen.width/30,color:'#fff'},inputAndroid: {
                            fontFamily:'poppins',
                            color:'#323446',
                            fontSize:screen.width/30
                          }}}
                          placeholder={{label:client[0] && client[0].lang?polylanfr.City:polylanar.City,value:null}}
                          onValueChange={itemValue => setWilaya(itemValue)}
                          doneText={client[0] && client[0].lang?polylanfr.Cancel:polylanar.Cancel}
                          items={[
                            { label: 'Alger', value: 'Alger'},
                            { label: 'Blida', value: 'Blida' }
                           ]}
                      />) :
                      (<TouchableOpacity onPress={onPress} style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/45,paddingRight:screen.width/30}}>
                      <Text  style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#323446',fontWeight:'500'}}>
                        {wilaya?wilaya:wilayas[0]}
                      </Text>
                      <Ionicons name="ios-arrow-down" size={screen.width/15} color="#323446" onPress={onPress} />
                      </TouchableOpacity>)} 
          </View>
          <CustomInput
            id='region'
            rightIcon={<MaterialIcons title="region" name ='home' color='#323446' size={screen.width/15.7} />}
            placeholder={client[0] && client[0].lang?polylanfr.Region:polylanar.Region}
            keyboardType="default"
            returnKeyType="next"
            minLength={3}
            autoCapitalize='sentences'
            onInputChange={inputChangeHandler}
            initialValue={client[0]?client[0].region:''}
            initiallyValid={true}
            required
            placeholderTextColor='rgba(50,52,70,0.4)'
            shadowColorView='black'
            shadowOpacityView={0.5}
            shadowOffsetView={{width: 0, height:1}}
            elevationView={3}
            widthView='90%'
            backgroundColor='#fff'
            textColor={Colors.blue}
          />
          
          </KeyboardAvoidingView>
     </ScrollView>):
     (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
         <View style={styles.noticeContainer}>
             <Text style={styles.noticeTitle}>{client[0] && client[0].lang?polylanfr.DoYouKnow:polylanar.DoYouKnow}</Text>
             <Text style={styles.noticeContent}>{client[0] && client[0].lang?polylanfr.DoYouKnowNotice:polylanar.DoYouKnowNotice} <Text onPress={url} style={{color:Colors.primary}}>tahfifaapp.com</Text></Text>
             <Text style={styles.tahfifaSignature} onPress={url2}>{client[0] && client[0].lang?polylanfr.TeamTahfifa:polylanar.TeamTahfifa}</Text>
         </View>
         <View style={styles.buttonContainer}>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={alertLogout}>
                    <View style={{paddingBottom:screen.width/72}}>
                      <MaterialCommunityIcons title = "logout" name ='logout' color='#FD6C57' size={screen.width/15.7} />
                    </View>
                    <View>
                      <Text style={styles.optionTitle}>{client[0] && client[0].lang?polylanfr.Disconnect:polylanar.Disconnect}</Text>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('PlayerSettings',{clientUID:clientUID,clientID:clientID})}>
                     <View style={{paddingBottom:screen.width/72}}>
                       <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={screen.width/15.7} />
                     </View>
                     <View>
                       <Text style={styles.optionTitle}>{client[0] && client[0].lang?polylanfr.Parameters:polylanar.Parameters}</Text>
                     </View>
                </TouchableOpacity>
              </View>
         </View>
       </ScrollView>)}
  </View>
  </TouchableWithoutFeedback>

     );    
};



const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    width:'100%',
    alignItems:'center'
   },
   firstCard:{
     width:'95%',
     height:'40%',
     borderTopLeftRadius:screen.width/12,
     borderTopRightRadius:screen.width/12,
     shadowColor: 'black',
     shadowOpacity: 0.5,
     shadowOffset: {width: 0, height:1},
     elevation: 5,
     backgroundColor:'red'
    },
    backgroundFirstCard:{
      width:'100%',
      height:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      borderTopLeftRadius:screen.width/12,
      borderTopRightRadius:screen.width/12, 
      overflow:'visible'
    },
    secondCard:{
      height:screen.width/4.5,
      width:'90%',
      backgroundColor:'white',
      borderRadius:screen.width/36,
      marginTop:-(screen.width/7.2), 
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 0, height:1},
      elevation: 5,
    },
    secondCardContent:{
      justifyContent:'space-around',
      flexDirection:'row'
    },
    imageContainer:{
      width:screen.width/4.5,
      height:screen.width/3.3
    },
    image:{
      width:'100%',
      height:'100%',
      borderRadius:screen.width/36,
      marginTop:-(screen.width/6)
    },
    detailsContainer:{
      marginTop:screen.width/72,
      width:'60%',
      flexDirection:'row',
      justifyContent:'space-between',
      marginLeft:-(screen.width/24)
    },
    bnameText:{
      fontFamily:'poppins-bold',
      color:'#323446',
      fontSize:screen.width/20
    },
    secondFirstCard:{
      width:'95%',
      height:'20%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'flex-end'
    },
    iconFormCircle1:{
      width:screen.width/9,
      height:screen.width/12,
      borderRadius:screen.width/18,
      justifyContent:'center',
      alignItems:'center'
    },
    buttonStyle2:{
      width:screen.width/7.2,
      height:screen.width/7.2,
      marginTop:screen.width/12,
    },
    iconFormCircleGalery:{
      width:screen.width/9,
      height:screen.width/12,
      borderRadius:screen.width/18,
      justifyContent:'center',
      alignItems:'center',
    },
    age:{
      fontFamily:'poppins',
      color:'grey',
      fontSize:screen.width/32.7
    },
    menuContainer:{
      marginTop:screen.width/14.4,
      width:'90%',
      backgroundColor:'#f9f9f9',
      borderRadius:screen.width/24,
      borderColor:'#fd6c57',
      borderWidth:1,
      flexDirection:'row',
      alignSelf:'center',
      overflow:'hidden'
    },
    scrollView:{
      width:'100%',
      marginVertical:screen.width/18
    },
    bnameAgeContainer:{
      flexDirection:'row',
      width:'90%',
      alignSelf:'center'
    },
   noticeContainer:{
     width:'90%',
     alignSelf:'center',
     marginBottom:screen.width/24,
     marginTop:screen.width/12
    },
    noticeTitle:{
      fontFamily:'poppins-bold',
      fontSize:screen.width/27.7,
      color:'#323446'
    },
    optionTitle:{
      fontFamily:'poppins-bold',
      fontSize:screen.width/32.7,
      color:'#323446'
    },
    noticeContent:{
      fontFamily:'poppins',
      fontSize:screen.width/30,
      color:'#323446'
    },
    tahfifaSignature:{
      fontFamily:'poppins',
      fontSize:screen.width/30,
      color:'#fd6c57',
      paddingTop:screen.width/72
    },
    buttonContainer:{
      width:'90%',
      alignSelf:'center',
      marginVertical:screen.width/72,
      flexDirection:'row'
    },
    cart:{
      width:'90%',
      height:'95%',
      alignItems:'center',
      justifyContent:'center',
      elevation: 2,
      overflow:'hidden',
      borderRadius:screen.width/36
    },
    cartContainer:{
      width:'50%',
      height:screen.width/3.6,
      alignItems:'center',
      justifyContent:'center',
      borderWidth:Platform.OS==='ios'? 1:null,
      borderRadius:Platform.OS==='ios'? screen.width/9:null,
      marginHorizontal:Platform.OS==='ios'? screen.width/120:null,
      borderColor:Platform.OS==='ios'? Colors.blue:undefined,
      borderStyle:Platform.OS==='ios'? 'dashed':undefined
      
    },  
  activityIndicatorContainer:{
      flex:1,
      resizeMode:'cover',
      width:'100%',
      height:'100%',
      justifyContent:'center',
     
    },
    labelButton:{
      color:'#FFF',
      fontFamily:'poppins',
      fontSize:screen.width/22.5,
      textTransform:null,
     },
     buttonStyle:{
      borderColor:'#fd6c57',
      width:'40%',
      borderRadius:screen.width/18,
      height:screen.width/8,
      alignSelf:'center',
      marginTop:screen.width/36
     },
     centered: {
      flex:1,
     alignItems:'center',
     justifyContent:'center',
     width:'100%',
     height:'100%',
     resizeMode:'cover'
    }

});

export default PlayerProfileScreen;