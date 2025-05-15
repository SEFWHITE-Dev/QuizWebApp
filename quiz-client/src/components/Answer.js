import { Accordion, AccordionDetails, AccordionSummary, Box, CardMedia, List, ListItemButton, Typography } from '@mui/material'
import React from 'react'
import { BASE_URL } from '../api'
import { green, red } from '@mui/material/colors';
import { ExpandCircleDown } from '@mui/icons-material';
import useStateContext from '../hooks/useStateContext';

export default function Answer({questionAnswers}) {
  
  const { context } = useStateContext(); 
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const markAsCorrect = (qAndA, index) => {
    const selectedOptionObj = context.selectedOptions.find(opt => opt.questionId === qAndA.questionId);
    const selectedIndex = selectedOptionObj?.selected;

    if (qAndA.answer === index) {
      return { sx: { color: green[500] } }; 
    }
    if (selectedIndex === index) {
      return { sx: { color: red[500] } }; 
    }
    return {};
  }

  return (
    <Box sx={{mt : 5, width: '100%', maxWidth: 640, mx: 'auto'}}>
      {
        questionAnswers.map((item, j) => {
          const selectedOptionObj = context.selectedOptions.find(opt => opt.questionId === item.questionId);
          const selectedIndex = selectedOptionObj?.selected;

          return (
            <Accordion 
              disableGutters 
              key={j}
              expanded={expanded === j}
              onChange={handleChange(j)}>

              <AccordionSummary expandIcon={
                <ExpandCircleDown 
                  sx={{ 
                    color: 
                      selectedIndex == null 
                        ? 'inherit' 
                        : item.answer === selectedIndex 
                          ? green[500] 
                          : red[500] 
                  }}        
                />
              }>
                <Typography sx={{width: '90%', flexShrink: 0}}>
                  {item.questionTitle}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {item?.imageName ? 
                  <CardMedia 
                    component="img" 
                    image={BASE_URL + 'images/' + item.imageName} 
                    sx={{width:'auto', m:'10px auto'}}/>      
                  : null}

                <List>
                  {item.options.map((optionText, index) => 
                    <ListItemButton key={index} >
                      <Typography {...markAsCorrect(item, index)}>
                        <b>
                          {String.fromCharCode(65 + index) + ") " }
                        </b>
                        {optionText}
                      </Typography>
                    </ListItemButton>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          )
        })
      }
    </Box>
  )
}
