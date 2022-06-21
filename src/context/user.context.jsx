import { createContext, useEffect , useReducer} from "react";
import {createAction} from '../utils/reducers/reducer.utils.js'
import { onAuthStateChangedListener , createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";




//as the actual value you want to access
export const UserContext = createContext({
    currentUser: null,
    setcurrentUser: () => null,
});


export const USER_ACTION_TYPE = {
    SET_CURRENT_USER: 'SET_CURRENT_USER'
}


const userReducer = (state, action) =>{
    const {type, payload} = action;
   
    
    switch(type) {
        case USER_ACTION_TYPE.SET_CURRENT_USER:
            return{
                ...state,
                currentUser : payload
            }

        default:
            throw new Error(`Unhandled type ${type} in the userReducer`)
    }   
}


const INITIAL_STATE = {
    currentUser: null
}

export const UserProvider = ({children}) => {
//const [currentUser, setcurrentUser] = useState(null);
    const [{currentUser}, dispatch] = useReducer(userReducer, INITIAL_STATE);

    const setCurrentUser = (user) => {
        dispatch(createAction(USER_ACTION_TYPE.SET_CURRENT_USER, user));
    }
    const value = {currentUser, setCurrentUser};
    
    
    useEffect(() => {
      const stoplistening =  onAuthStateChangedListener((user) => {
          if (user) {
           createUserDocumentFromAuth(user);
          }
          setCurrentUser(user);
      })

      return stoplistening;
    }, [])





 return <UserContext.Provider value = {value}>{children}</UserContext.Provider>
}