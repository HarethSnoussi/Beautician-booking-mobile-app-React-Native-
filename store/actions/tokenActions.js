export const GET_TOKENS = "GET_TOKENS"; 
export const ADD_TOKEN = "ADD_TOKEN";
export const DELETE_TOKEN = "DELETE_TOKEN";

export const CURRENT_TOKEN = "CURRENT_TOKEN";



export const deleteToken = (mytoken)=>{

    return async (dispatch) =>{
        try {

            const response = await fetch(`http://95.111.243.233:3000/client/deletetoken/${mytoken.token}`,{
                method:'DELETE'});
 
             if(!response.ok){
                 throw new Error('Oups! Une erreur est survenue.');
             }

            dispatch({type : DELETE_TOKEN , mytoken});
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };


        };

export const currentToken = (token)=>{

    return async (dispatch) =>{
        try {
            dispatch({type : CURRENT_TOKEN , token});
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };


        };



export const getTokens = (clientId)=>{

    return async (dispatch) =>{
        try {

            const arr = await fetch(`http://95.111.243.233:3000/client/clienttokens/${clientId}`);
            const resData = await arr.json ();
 

            dispatch({type : GET_TOKENS , tokens : resData});
            
          
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };


        };



        export const addtoken = (token)=>{
            return async (dispatch) =>{
                try {
                   

                    const response = await fetch(`http://95.111.243.233:3000/client/addtoken`,
                     {
                        method : "POST",
                        headers: {
                           'Content-Type': 'application/json'
                         },
                       body : JSON.stringify(token)
                       }
                    
                    );
         
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                      }
                else{
                  
                    dispatch({type : ADD_TOKEN , token});
                
                }
                   
                 
                }
                
                catch (error) {
                    throw error ;
                    // console.log("There is an Error");
                }
        
                        
                    };
        
        
                };