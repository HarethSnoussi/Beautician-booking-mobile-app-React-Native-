import React,{useState,useReducer,useCallback,useEffect} from 'react';
import {StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActivityIndicator,Platform,StatusBar} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";
import Colors from '../../../constants/Colors';
import {useSelector,useDispatch} from 'react-redux';
import CustomInput from '../../../components/Input';
import * as clientActions from '../../../store/actions/clientActions';
import * as authActions from '../../../store/actions/authActions';
import * as Crypto from 'expo-crypto';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

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


const PlayerSettingsScreen = props =>{

  //use Dispatch to dispatch our action
  const dispatch= useDispatch();
  const clientUID= props.navigation.getParam('clientUID');
  const clientID=props.navigation.getParam('clientID');

  const [isPhone,setIsPhone]= useState(true);
  const [isPassword,setIsPassword]= useState(false);
  const [isLang,setIsLang]= useState(false);
  const [isAccount,setIsAccount]= useState(false);
  let isArabic;
  const [isEye,setIsEye]=useState(false);
  const [error,setError]=useState(false);
  const [isLoadingState,setIsLoadingState]= useState(false);

  const getClient=useCallback(async()=>{
    try{
      setError(false);
      setIsLoadingState(true);
      await dispatch(clientActions.setClient(clientID));
      setIsLoadingState(false);
      }catch(err){
        setError(true);
        throw err; 
      }
  },[dispatch,setError]);
  
    useEffect(()=>{
    getClient();
    
    },[dispatch,getClient,setError]);


      const eye=()=>{
        setIsEye(prevValue=>!prevValue);
      };
  

      const phone = ()=>{
        setIsPhone(true);
        setIsPassword(false);
        setIsLang(false);
        setIsAccount(false);
      };
      const password = ()=>{
        setIsPhone(false);
        setIsPassword(true);
        setIsLang(false);
        setIsAccount(false);
      };
      const lang= ()=>{
        setIsLang(true);
        setIsPhone(false);
        setIsPassword(false);
        setIsAccount(false);
      };
    
      const account= ()=>{
        setIsAccount(true);
        setIsLang(false);
        setIsPhone(false);
        setIsPassword(false);
      };

  //get the client's data
  const client= useSelector(state=>state.clients.client);
  console.log(client);

  const arabic= async()=>{
     console.log(client[0].lang);
     try{
        if(client[0].lang){
           isArabic = false;
        }else{
          isArabic = true;
       }
        setIsLoadingState(true);
        setError(false);
       
        
        await dispatch(clientActions.updateClientLang(clientID,isArabic));
        setIsLoadingState(false); 
                               
        Alert.alert(client && client[0].lang?polylanar.Congratulations:polylanfr.Congratulations,client && client[0].lang?polylanar.SuccessLanguageMessage:polylanfr.SuccessLanguageMessage,[{text:client && client[0].lang?polylanar.OK:polylanfr.OK}]);
  
    }catch(err){
      console.log(err);
      setError(true);
      if(error){
        Alert.alert(client && client[0].lang?polylanfr.Oups:polylanar.Oups,client && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
       }
       throw err;
    }
  };

  const alertEditLang = ()=>{
    Alert.alert(
      client && client[0].lang?polylanfr.Warning:polylanar.Warning,
      client && client[0].lang?polylanfr.DoYouWantToChangeYourLanguage:polylanar.DoYouWantToChangeYourLanguage,
     [{text:client && client[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:arabic},
      {text:client && client[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
      return;
  };

   
  //State for update loading 
  const [isLoading,setIsLoading]= useState(false);
  const [isLoadingPassword,setIsLoadingPassword]=useState(false);
  const prefix='+213';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////Input Management
const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    phone:client[0]?client[0].phone:'',
    password:''
  },
  inputValidities:{
   phone:true,
   password:false
  },
  formIsValid:false});

const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});

},[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update client's phone after pressing in edit text
const editPhone=async()=>{
  if(formState.inputValidities.phone){
      try{
          if(prefix+formState.inputValues.phone === client[0].phone){
            Alert.alert(client && client[0].lang?polylanfr.Error:polylanar.Error,client && client[0].lang?polylanfr.SameNumberMessage:polylanar.SameNumberMessage,[{text:client && client[0].lang?polylanfr.Repeat:polylanar.Repeat}]);
            return;
          }
          setIsLoading(true);
          await dispatch(clientActions.updateClientPhone(formState.inputValues.phone,prefix+formState.inputValues.phone,
                                                 clientID));
          await dispatch(authActions.updateUserPhoneFRB(prefix+formState.inputValues.phone,clientUID));                                       
          setIsLoading(false);
          dispatch(authActions.logout());
          AsyncStorage.clear();
          Alert.alert(client && client[0].lang?polylanfr.Congratulations:polylanar.Congratulations,client && client[0].lang?polylanfr.SameNumberMessage:polylanar.SameNumberMessage,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
          props.navigation.navigate('Auth');                        
          
    
      }catch(err){
        console.log(err);
        Alert.alert(client && client[0].lang?polylanfr.Oups:polylanar.Oups,client && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
      }
      
      }else{
        Alert.alert(client && client[0].lang?polylanfr.Error:polylanar.Error,client && client[0].lang?polylanfr.EmptyField:polylanar.EmptyField,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
      }

};

const alertEditPhone = ()=>{
  Alert.alert(
    client && client[0].lang?polylanfr.Warning:polylanar.Warning,
    client && client[0].lang?polylanfr.DoYouWantToChangeYourPhone:polylanar.DoYouWantToChangeYourPhone,
   [{text:client && client[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:editPhone},
    {text:client && client[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
    return;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update client's password after pressing in edit text
const editPassword=async()=>{
  if(formState.inputValidities.password){
      try{
          
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            formState.inputValues.password
          );
          if(hashedPassword === client[0].password){
            Alert.alert(client && client[0].lang?polylanfr.Error:polylanar.Error,client && client[0].lang?polylanfr.SamePassword:polylanar.SamePassword,[{text:client && client[0].lang?polylanfr.Repeat:polylanar.Repeat}]);
            return;
          }
          setIsLoadingPassword(true);
          await dispatch(clientActions.updateClientPassword(clientID,hashedPassword));                                   
          setIsLoadingPassword(false);
          dispatch(authActions.logout());
          AsyncStorage.clear();
          props.navigation.navigate('Auth');                        
          Alert.alert(client && client[0].lang?polylanfr.Congratulations:polylanar.Congratulations,client && client[0].lang?polylanfr.SuccessNewPasswordMessage:polylanar.SuccessNewPasswordMessage,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
    
      }catch(err){
        console.log(err);
        Alert.alert(client && client[0].lang?polylanfr.Oups:polylanar.Oups,client && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
      }
      
      }else{
        Alert.alert(client && client[0].lang?polylanfr.Error:polylanar.Error,client && client[0].lang?polylanfr.EmptyField:polylanar.EmptyField,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
      }

};
  
const alertEditPassword = ()=>{
  Alert.alert(
    client && client[0].lang?polylanfr.Warning:polylanar.Warning,
    client && client[0].lang?polylanfr.ChangeYourPassword:polylanar.ChangeYourPassword,
   [{text:client && client[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:editPassword},
    {text:client && client[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
    return;
};

const deleteAccount= async()=>{
  try{
    
    setError(false);
     dispatch(clientActions.deleteClient(clientID));
     dispatch(authActions.deleteUser(clientUID)); 
     dispatch(authActions.logout());
     
     AsyncStorage.clear();
     props.navigation.navigate('Auth');
  }catch(err){
   console.log(err);
   setError(true);
   if(error){
    Alert.alert(client && client[0].lang?polylanfr.Oups:polylanar.Oups,client && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client && client[0].lang?polylanfr.OK:polylanar.OK}]);
   }
   throw err;
  }
};

const alertDelete = ()=>{
  Alert.alert(
    client && client[0].lang?polylanfr.Warning:polylanar.Warning,
    client && client[0].lang?polylanfr.DoYouWantToDeleteYourAccount:polylanar.DoYouWantToDeleteYourAccount,
   [{text:client && client[0].lang?polylanfr.Yes:polylanar.Yes, style:'destructive', onPress:deleteAccount},
    {text:client && client[0].lang?polylanfr.No:polylanar.No, style:'cancel'}]);
    return;
};


if(error){
      
  return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.coverTwo}>
              <View style={{marginBottom:10,alignSelf:'center'}}>
              <StatusBar hidden />
                <Text style={styles.noServicesText}>{client && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet}</Text>
              </View>
              <Button
                theme={{colors: {primary:'#fd6c57'}}} 
                title={client && client[0].lang?polylanfr.Repeat:polylanar.Repeat}
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
if(isLoadingState || client===undefined){
      
  return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.coverTwo}>
              <StatusBar hidden />
              <ActivityIndicator size='large' color={Colors.primary} />
           </ImageBackground>)
};

    return(
      <TouchableWithoutFeedback onPress = {()=>Keyboard.dismiss()}>
      <View style={styles.container}>
      <StatusBar hidden />
         <View style={styles.firstCard}>
          <ImageBackground source={client[0].sex==='Femme'?{uri:'http://95.111.243.233/assets/tahfifa/woman5.jpg'}:{uri:'http://95.111.243.233/assets/tahfifa/man1-1.jpg'}} style={styles.backgroundFirstCard} resizeMode='cover'/>
         </View>
         <View style={styles.menuContainer}>
              <TouchableOpacity onPress={phone} style={{padding:screen.width/72,width:'25%',backgroundColor:isPhone?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isPhone?'#fff':'#fd6c57',fontFamily:'poppins',fontSize:screen.width/30}}>
                  {client && client[0].lang? polylanfr.Phone:polylanar.Phone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={password} style={{borderRightWidth:1,borderRightColor:'#fd6c57',borderLeftWidth:1,borderLeftColor:'#fd6c57',padding:screen.width/72,width:'25%',backgroundColor:isPassword?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isPassword?'#fff':'#fd6c57',fontFamily:'poppins',fontSize:screen.width/36}}>
                    {client && client[0].lang?polylanfr.Password:polylanar.Password}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={lang} style={{padding:screen.width/72,width:'25%',backgroundColor:isLang?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#fd6c57'}}>
                  <Text style={{color:isLang?'#fff':'#fd6c57',fontFamily:'poppins',fontSize:screen.width/30}}>
                    {client && client[0].lang?polylanfr.Languages:polylanar.Languages}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={account} style={{padding:screen.width/72,width:'25%',backgroundColor:isAccount?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isAccount?'#fff':'#fd6c57',fontFamily:'poppins',fontSize:screen.width/30}}>
                  {client && client[0].lang?polylanfr.Account:polylanar.MyAccount}
                  </Text>
              </TouchableOpacity>
        </View>
        {isPhone?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={screen.width/36} behavior={Platform.OS === "ios" ? "padding" : null}>
          <CustomInput
              id='phone'
              rightIcon={<MaterialIcons title="phone" name ='phone' color='#323446' size={screen.width/15.7} />}
              leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:screen.width/72,marginRight:screen.width/72}}><Image source={{uri:'http://95.111.243.233/assets/tahfifa/algeriaFlag.png'}} style={{width:screen.width/15,height:screen.width/12.85,marginRight:screen.width/72}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
              placeholder='555555555'
              keyboardType="phone-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].id:''}
              initiallyValid={true}
              phone
              required
              inputStyle={{fontSize:screen.width/24}}
              placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
              backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
              textColor={Colors.blue}
              widthView='80%'
              shadowColorView='black'
              shadowOpacityView={0.5}
              shadowOffsetView={{width: 0, height:1}}
              elevationView={3}
              />
              <View style={styles.buttonContainer}>
              {!isLoading ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={client && client[0].lang?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={alertEditPhone}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isPassword?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={screen.width/36} behavior={Platform.OS === "ios" ? "padding" : null}>
                <CustomInput
                id='password'
                rightIcon={<MaterialCommunityIcons title="lock" onPress={eye} name ={!isEye?'eye':'eye-off'} color={Platform.OS==='android'?'#323446':'#fff'} size={screen.width/15.7} />}
                placeholder={client && client[0].lang?polylanfr.NewPassword:polylanar.NewPassword}
                keyboardType="default"
                returnKeyType="next"
                secureTextEntry={!isEye?true:false}
                minLength={6}
                autoCapitalize='none'
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={true}
                required
                placeholderTextColor={Platform.OS==='android'?'rgba(50,52,70,0.4)':'#f9f9f9'}
                inputStyle={{fontSize:screen.width/24}}
                widthView='80%'
                backgroundColor={Platform.OS==='android'?'#fff':Colors.blue}
                shadowColorView='black'
                shadowOpacityView={0.5}
                shadowOffsetView={{width: 0, height:1}}
                elevationView={3}
              />
              <View style={styles.buttonContainer}>
              {!isLoadingPassword ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={client && client[0].lang?polylanfr.Register:polylanar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={alertEditPassword}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isLang?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={screen.width/36} behavior={Platform.OS === "ios" ? "padding" : null}>
            <View style={styles.langContainer}>
              {client && client[0].lang?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:screen.width/24,color:Platform.OS==='android'?Colors.blue:'#fff'}}>Français</Text>
                <Image source={{uri:'http://95.111.243.233/assets/tahfifa/france.png'}} style={{width:screen.width/15,height:screen.width/15}}/>
              </View>):(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:screen.width/24,color:Platform.OS==='android'?Colors.blue:'#fff'}}>العربية</Text>
                <Image source={{uri:'http://95.111.243.233/assets/tahfifa/algeria.png'}} style={{width:screen.width/15,height:screen.width/15}}/>
              </View>)}
            </View>
            <View style={styles.buttonContainer}>
           
               <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={client && client[0].lang?polylanfr.Change:polylanar.Change}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                    onPress={alertEditLang}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isAccount?(<ScrollView style={styles.scrollViewAccount} showsVerticalScrollIndicator={false}>
          <View style={styles.noticeContainer}>
             <Text style={styles.noticeTitle}>{client && client[0].lang?polylanfr.Notice:polylanar.Notice}</Text>
             <Text style={styles.noticeContent}>{client && client[0].lang?polylanfr.NoticeMessage:polylanar.NoticeMessage}</Text>
             <Text style={styles.tahfifaSignature}>{client && client[0].lang?polylanfr.TeamTahfifa:polylanar.TeamTahfifa}</Text>
         </View>
            <View style={styles.buttonContainer}>
               <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={client && client[0].lang?polylanfr.DeleteMyAccount:polylanar.DeleteMyAccount}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyleDelete}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                    onPress={alertDelete}
                />
           </View>
        </ScrollView>):undefined}
      </View>
      </TouchableWithoutFeedback>
     );    
};

PlayerSettingsScreen.navigationOptions= navData => {
    
     return {
      title:'Paramètres',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontFamily:'poppins-bold',
        marginTop:screen.width/72,
      },
      
     
     };
 
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
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: screen.width/36,
    elevation: 5,
    backgroundColor:'red'
   },
   backgroundFirstCard:{
     width:'100%',
     height:'100%',
     alignItems:'center',
   },
  menuContainer:{
    marginTop:screen.width/14.4,
    width:'90%',
    backgroundColor:'#f9f9f9',
    borderRadius:screen.width/72,
    borderColor:'#fd6c57',
    borderWidth:1,
    flexDirection:'row',
    alignSelf:'center',
    overflow:'hidden'
  },
  langContainer:{
    width:'80%',
    borderWidth:1,
    borderRadius:screen.width/18,
    backgroundColor:Platform.OS==='android'?'#fff':Colors.blue,
    borderColor:Platform.OS==='android'?'#fff':Colors.blue,
    marginVertical:screen.width/72,
    alignSelf:'center',
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: screen.width/36,
    elevation: 3,
    overflow:'hidden',
    
  },
  langRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    paddingVertical:screen.width/36,
    paddingHorizontal:screen.width/24,
    alignItems:'center'
  },
  scrollView:{
    width:'100%',
    marginTop:screen.width/4.5
  },
  scrollViewAccount:{
    width:'100%',
    marginTop:screen.width/7.2
  },
  buttonContainer:{
    width:'90%',
    alignSelf:'center',
    marginVertical:screen.width/18,
  },
 labelButton:{
  color:'#FFF',
  fontFamily:'poppins',
  fontSize:screen.width/22.5,
  textTransform:null,
 },
 buttonStyle:{
  borderColor:'#fd6c57',
  width:'50%',
  borderRadius:screen.width/18,
  height:screen.width/9,
  alignSelf:'center'
 },
 buttonStyleDelete:{
  borderColor:'#fd6c57',
  width:'80%',
  borderRadius:screen.width/18,
  height:screen.width/9,
  alignSelf:'center',
  marginTop:screen.width/18
 },
 phoneNumber:{
 color:Platform.OS==='android'?'#323446':'#fff',
 fontSize:screen.width/30
},
coverTwo:{
  flex:1,
  justifyContent:'center',
  width:'100%',
  height:'100%',
  resizeMode:'cover'
},
noServicesText:{
  fontFamily:'poppins',
  fontSize:screen.width/25.7,
  color:Colors.blue
},
noticeContainer:{
  width:'75%',
  alignSelf:'center',
 },
 noticeTitle:{
   fontFamily:'poppins-bold',
   fontSize:screen.width/27.7,
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
});

export default PlayerSettingsScreen;