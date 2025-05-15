import React, { useEffect, useState } from 'react'
import useStateContext from '../hooks/useStateContext';
import { createAPIEndpoint, ENDPOINTS } from '../api';
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { getFormattedTime } from '../helper';
import { useNavigate } from 'react-router-dom';
import { green } from '@mui/material/colors';
import Answer from './Answer';

export default function Result() {

  // make a post request to the web API with the question ids
  // return the questions and correct ans from the web API 

  const { context, setContext } = useStateContext();
  const [ score, setScore ] = useState(0);
  const [ questionAnswers, setQuestionAnswers ] = useState([]);
  const [ showAlert, setShowAlert ] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const ids = context.selectedOptions.map(x => x.questionId);

    createAPIEndpoint(ENDPOINTS.getAnswers)
      .post(ids)
      .then(res => {
        const qAndA = context.selectedOptions
          .map(x => ({
            ...x,
            ...(res.data.find(y => y.questionId == x.questionId))
          }));      
          setQuestionAnswers(qAndA);
          calculateScore(qAndA);
      })
      .catch(err => console.log(err));
  }, []);

  // reduce method will iterate through each q 
  const calculateScore = qAndA => {
    let tempScore = qAndA.reduce((accumulator, currentVal) => {
      return currentVal.answer == currentVal.selected? accumulator + 1 : accumulator; // if the q is equal to a, increment accum
    }, 0); // initial accumulator value will be 0
    setScore(tempScore);
  }

  const restartQuiz = () => {
    setContext({ // reset the quiz
      timeTaken:0,
      selectedOptions: []
    });
    navigate("/quiz")
  }

  const submitScore = () => {
    createAPIEndpoint(ENDPOINTS.participant)
    .put(context.participantId, {
      participantId: context.participantId,
      score: score,
      timeTaken: context.timeTaken
    })
    .then(res => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    })
    .catch(err => {console.log(err);
    })
  }

  return (
    <>
    <Card sx={{mt:5, display: 'flex', width: '100%', maxWidth: 640, mx:'auto'}}>
      <Box sx={{display:'flex', flexDirection:'column', flexGrow: 1}}>
        <CardContent sx={{flex: '1 0 auto', textAlign: 'center'}}>
          <Typography variant='h4'>Results: 
            <Typography variant='span' color={green[500]}>
              {score}
            </Typography>/5
          </Typography>
          <Typography variant='h6'>
            Time Taken: {getFormattedTime(context.timeTaken) + ' mins'} 
          </Typography>

          <Button variant="contained"
          sx={{mx: 1}}
          size="small"
          onClick={submitScore}>
            Submit
          </Button>

          <Button variant="contained"
          sx={{mx: 1}}
          size="small"
          onClick={restartQuiz}>
            Restart Quiz
          </Button>
          <Alert
          severity='success'
          variant='string'
          sx={{
            width: '60%',
            m: 'auto',
            visibility: showAlert ? 'visible' : 'hidden'
          }}>
            Score Updated
          </Alert>

        </CardContent>
      </Box>
    </Card>
    <Answer questionAnswers = {questionAnswers} />    
    </>
  )
}

