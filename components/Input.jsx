import React, {useReducer,useEffect} from 'react';
import { StyleSheet, Text, View,Dimensions, } from 'react-native';
import { Input } from 'react-native-elements';
import Colors from "../constants/Colors";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const INPUT_UPDATE = 'INPUT_UPDATE';
const inputReducer = (state,action)=>{
     switch(action.type){
         case INPUT_UPDATE:
             return{
                 ...state,
                 value:action.value,
                 isValid:action.isValid
             };

         default:
             return state;
     }
};

const CustomInput = props =>{


    const [inputState,dispatchInputState] = useReducer(inputReducer,
        {
            value:props.initialValue ? props.initialValue : '',
            isValid:props.initiallyValid,
            touched:false
        });

    

        const inputChangeHandler= text=>{
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const phoneRegex = /(^([5-7]){1}[0-9]{8}$)/;
            let isValid = true;
            if (props.required && text.trim().length === 0) {
            isValid = false;
            }
            if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
            }
            if(props.phone && !phoneRegex.test(text)){
            isValid = false;
            }
            if (props.min != null && +text < props.min) {
            isValid = false;
            }
            if (props.max != null && +text > props.max) {
            isValid = false;
            }
            if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
            }
            if (props.maxLength != null && text.length > props.maxLength) {
                isValid = false;
            }

            dispatchInputState({type:INPUT_UPDATE,value:text,isValid:isValid})
        }

        //forward the value and the information whether it's valid or not to the parent
    const {onInputChange,id} = props;
    useEffect(()=>{
        
        onInputChange(id,inputState.value,inputState.isValid);
      
    },[inputState,onInputChange,id]);

       

    return(
        <View style={{width:props.widthView,borderWidth:1, borderRadius:screen.width/14.4,backgroundColor:props.backgroundColor,
        borderColor:!inputState.isValid?Colors.primary:props.backgroundColor,marginVertical:screen.width/72,
        height:screen.width/8,shadowColor:props.shadowColorView,shadowOpacity:props.shadowOpacityView,
        shadowOffset:props.shadowOffsetView, shadowRadius:props.shadowRadiusView,elevation: props.elevationView,alignSelf:'center'}}>
            <Input
                {...props}
                value={inputState.value}
                onChangeText={inputChangeHandler}
                placeholder={props.placeholder}
                inputContainerStyle={styles.input}
                placeholderTextColor={props.placeholderTextColor}
                inputStyle={{fontSize:screen.width/30,color:props.textColor}}
                errorMessage={props.errorMessage}
            />
        </View>
     );    
};


const styles= StyleSheet.create({
    
    input:{
        borderBottomWidth:0,
        paddingHorizontal:screen.width/36,
        paddingVertical:screen.width<399?null:screen.width>=400 && screen.width<=500?screen.width/60:screen.width/36,
      },
});

export default CustomInput;