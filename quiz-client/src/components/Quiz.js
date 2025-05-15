import React, {  useEffect, useState } from 'react'
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../api'
import { Card, Typography, CardContent, List, ListItemButton, CardHeader, LinearProgress, Box, CardMedia } from '@mui/material'
import { getFormattedTime } from '../helper';
import useStateContext from '../hooks/useStateContext';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {

  const [qs, setQs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const {context, setContext} = useStateContext();
  const navigate = useNavigate();

  const maxQuestions = context.maxQuestions || 5; // default to 5 if not set

  let timer;

  // since the funciton is asynchronous, the previous increment operation mmight not be completed
  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken(prev => prev + 1); // a callback value that represents the previous value is incremented
    }, 1000);
  }
  
  // run this hook when the component loads
  useEffect(() => {
    setContext({ // reset the quiz
      timeTaken:0,
      selectedOptions: []
    });

    createAPIEndpoint(ENDPOINTS.question) // get ready to call questionsAPI on the server
    .fetch({params: { count:maxQuestions }}) // makes the API call, gets quiz data from server
    .then(res => { // runs after the data comes back from the server. res is response data from server
      setQs(res.data) // takes the questions res.data , and saves it into the React state varaible, qs.
      startTimer() // once the quiz loads, start timer      
    })
    .catch(err => {
      console.log(err);
    });

    // a cleanup function in React
    // "when this component is removed form the screen, stop the timer"
    return () => { clearInterval(timer) } // stops timer from running in the background
    // empty [] means: run this effect only once - when the component first appears. 
  }, []);
  
  // when a answer is selected this func is called
  const updateAnswer = (questionId, optionIndex) => {
    // ...spread operator to copy all items from context.selectedOptions and store it in temp
    // in React, avoid changing the original data directly(mutating), make a copy instead
    // (simply creating a new variable = to the array would only point to the same array)
    const temp = [...context.selectedOptions]; 
    temp.push({ // add a new obj to the end of temp list
      questionId,
      selected: optionIndex
    });

    // check if all qs have been completed
    if (questionIndex < maxQuestions - 1) {
      // update the context(the global state used for quiz ans)
      setContext({selectedOptions:[...temp]}); // takes the updated list of ans temp, create a copy of it and save it to context
      // move on to next question
      // React re-renders the component when the state changes
      setQuestionIndex(questionIndex + 1); 
    } 
    else {
      setContext({selectedOptions:[...temp], timeTaken});
      // navigate to result component
      navigate("/result");
    }
  }

  return (
    qs.length !== 0 ? 
    <Card
    sx={ {maxWidth:640, mx:'auto', mt:5, 
    '& .MuiCardHeader-action' :{m:0, alignSelf:'center'} } }>

      <CardHeader 
      title={'Question ' + (questionIndex + 1) + ' of ' + maxQuestions} 
      action={<Typography>{ getFormattedTime(timeTaken) }</Typography>} />      
      <Box>
        <LinearProgress variant='determinate' value={(questionIndex + 1) * 100 / maxQuestions} />
      </Box>

      {qs[questionIndex]?.imageName ? 
      <CardMedia 
        component="img" 
        image={BASE_URL + 'images/' + qs[questionIndex].imageName} 
        sx={{width:'auto', m:'10px auto'}}/>      
      : null}

      <CardContent>
        <Typography variant="h6">
          {qs[questionIndex].questionTitle}
        </Typography>
        <List>
          {qs[questionIndex].options.map((item, index) => 
          <ListItemButton key={index} onClick={() => updateAnswer(qs[questionIndex].questionId, index)}
          disableRipple>
            <div>
              <b>{String.fromCharCode(65 + index) + ") " }</b> {item}
            </div>

          </ListItemButton>
          )}
        </List>
      </CardContent>
    </Card>
    : null
  )
}
