export const GET_REVIEWS = "GET_REVIEWS"; 
export const ADD_REVIEW = "ADD_REVIEW"; 
export const UPDATE_REVIEW = "UPDATE_REVIEW"; 
export const SET_FEEDBACKS= "SET_FEEDBACKS";



export const getReviews = (clientId)=>{

    return async (dispatch) =>{
        try {

            const arr = await fetch(`http://95.111.243.233:3000/client/barbersfeedbacks/${clientId}`);
            const resData = await arr.json ();


            dispatch({type : GET_REVIEWS , reviews : resData});
            
          
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };


        };



        export const updateReview = (review)=>{

            return async (dispatch) =>{
                try {
        
                    const response = await fetch(`http://95.111.243.233:3000/client/updatefeedback`,
                    {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                      body : JSON.stringify({review})
                      }
                    
                    );
         
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                      }
        
                    dispatch({type : UPDATE_REVIEW , review});
                   
                 
                }
                
                catch (error) {
                    throw error ;
                    // console.log("There is an Error");
                }
        
                        
                    };
        
        
                };



                
        export const addreview = (review)=>{
            return async (dispatch) =>{
                try {
                   

                    const response = await fetch(`http://95.111.243.233:3000/client/addreview`,
                     {
                        method : "POST",
                        headers: {
                           'Content-Type': 'application/json'
                         },
                       body : JSON.stringify(review)
                       }
                    
                    );
         
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                      }
                else{
                  
                    dispatch({type : ADD_REVIEW , review : review});
                
                }
                   
                 
                }
                
                catch (error) {
                    throw error ;
                    // console.log("There is an Error");
                }
        
                        
                    };
        
        
                };

                export const setFeedbacks= barber_id => {
                    return async dispatch=>{
                        try{
                
                            const response= await fetch(`http://95.111.243.233:3000/feedback/${barber_id}`);
                
                            if(!response.ok){
                             throw new Error('Oups! Une erreur est survenue.');
                             }
                 
                            const resData= await response.json();
                            
                           
                            dispatch({type:SET_FEEDBACKS,feedbackData:resData});
                      
                       }catch(err){
                           console.log(err);
                       }
                
                    };
                
                };