import React, { createContext, useState, useContext, useEffect } from 'react'

export const stateContext = createContext();

// init the context obj
const getFreshContext = () => {

  if (localStorage.getItem('context') === null) {
    localStorage.setItem('context', JSON.stringify({
      // return an obj with properties we want to save inside the context with their default values
      // values we want shared globally within the app    
        participantId: 0,
        timeTaken: 0,
        selectedOptions:[]
      }));
  }
  return JSON.parse(localStorage.getItem('context'));
}


// localStorage.getItem('key');
// localStorage.removeItem('key');


// create custom hook
export default function useStateContext() {
  // destructure everthing within the context api
  const { context, setContext } = useContext(stateContext);

  return {
    context,
    setContext: obj => { setContext({ ...context, ...obj }) },
    resetContext: () => {
      localStorage.removeItem('context'); // remove context from local storage
      const freshContext = getFreshContext(); // reinit local storage so it can be set without timing issues
      setContext(freshContext);
    }
  }
}

 


export function ContextProvider({ children }) {

  // save the data we want to share across these components
  const [context, setContext] = useState(getFreshContext());

  // this callback function will be invoked when the second param of this function is changed
  useEffect(() => {
    localStorage.setItem('context', JSON.stringify(context))
  }, [context]);

  return (
    <stateContext.Provider value={ { context, setContext } }>
      { children }
    </stateContext.Provider>
  )
}
