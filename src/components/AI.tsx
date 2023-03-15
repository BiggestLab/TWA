import React, { useState } from "react";
import {
  Card,
  FlexBoxCol
} from "./styled/styled";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

interface t2i {
  batch_count: number;
  cfg_scale: number;
  height: number;
  negative_prompt: string;
  prompt: string;
  sampler_index: string;
  seed: number;
  steps: number;
  width: number;
}

function mockApi(allValues: t2i) {
  console.log(allValues)
  fetch('https://biggestlab.ddns.net/sdapi/v1/txt2img', {
    method: 'post',
    body: JSON.stringify(allValues),
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function(response) {
    // set Toast style based on response.ok
    console.log('response', response)
    return response.json();
  }).then(function(data) {
    console.log('data', data)
    const img = document.getElementById('a') as HTMLInputElement | null;
    if (img !== null) img.src = "data:image/png;base64," + data.images[0];
  });
}


type PropsRadio = {
  id: keyof t2i;
  display: string;
  controls: Array<string>;
  allValues: t2i;
  setAllValues: React.Dispatch<React.SetStateAction<t2i>>;
}

type PropsSlider = {
  id: keyof t2i;
  display: string;
  min: number;
  max: number;
  step: number;
  allValues: t2i;
  setAllValues: React.Dispatch<React.SetStateAction<t2i>>;
}

type Props = {
  id: keyof t2i;
  display: string;
  allValues: t2i;
  setAllValues: React.Dispatch<React.SetStateAction<t2i>>;
}

const MUINumber = ({id, display, min, max, step, allValues, setAllValues}: PropsSlider /*allValues: object,*/ /*setAllValues: any*/) => {
  // console.log(allValues)
  return (
    <Box>
      <TextField
        size="small"
        type="number"
        label={display}
        variant="outlined"
        fullWidth={true}
        id={id}
        value={allValues[id]}
        inputProps={{
          min: min,
          max: max,
          step: step,
          // 'aria-labelledby': 'input-slider',
        }}
        onBlur={(e) => setAllValues({
          ...allValues,
          [id]: e.target.value === '' || Number(e.target.value) < min ? min : Number(e.target.value) > max ? max : Number(e.target.value)
        })}
        onChange={(e) => setAllValues({
          ...allValues,
          [id]: e.target.value === '' ? '' : Number(e.target.value)
        })}
      />
    </Box>
  )
};

const MUIRadio = ({id, display, controls, allValues, setAllValues}: PropsRadio /*allValues: object,*/ /*setAllValues: any*/) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllValues({
      ...allValues,
      [id]: (event.target as HTMLInputElement).value
    })
  };
  // console.log(allValues)
  return (
    <Box>
      <label htmlFor={id} id={id + '-label'}>{display}</label>
      <RadioGroup
        row
        aria-labelledby={id + '-label'}
        value={allValues[id]}
        name={id}
        onChange={handleChange}
      >
        {controls.map((c) => (
          <FormControlLabel key={c} value={c} control={<Radio />} label={c} />
        ))}
      </RadioGroup>
    </Box>
  )
};

const MUISlider = ({id, display, min, max, step, allValues, setAllValues}: PropsSlider) => {
  const handleStepsSlider = (event: Event, newValue: number | number[]) => {
    setAllValues({
      ...allValues,
      [id]: newValue
    })
  };

  const handleStepsInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllValues({
      ...allValues,
      [id]: event.target.value === '' ? '' : Number(event.target.value)
    })
  };

  const handleStepsBlur = () => {
    if (allValues[id] < min) {
      setAllValues({
        ...allValues,
        [id]: min
      });
    } else if (allValues[id] > max) {
      setAllValues({
        ...allValues,
        [id]: max
      });
    }
  };

  return (
    <Box>
      <label htmlFor={id}>{display}</label>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
        <Slider
          aria-label={display}
          getAriaLabel={() => display}
          value={typeof allValues[id] === 'number' ? Number(allValues[id]) : min}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          step={step}
          onChange={handleStepsSlider}
        />
        <TextField
          size="small"
          label={min + ' to ' + max}
          id={id}
          variant="outlined"
          sx={{ width: '7.5rem' }}
          value={allValues[id]}
          onChange={handleStepsInput}
          onBlur={handleStepsBlur}
          inputProps={{
            min: min,
            max: max,
            step: step,
            type: 'number'
          }}
        />
      </Box>
    </Box>
  )
};

const MUITextField = ({id, display, allValues, setAllValues}: Props /*allValues: object,*/ /*setAllValues: any*/) => {
  // console.log(allValues)
  return (
    <Box>
      <TextField
        size="small"
        label={display}
        variant="outlined"
        fullWidth={true}
        multiline={true}
        rows={2}
        id={id}
        value={allValues[id]}
        onChange={(e) => setAllValues({
          ...allValues,
          [id]: e.target.value
        })}
      />
    </Box>
  )
};


export function AI() {
  const [allValues, setAllValues] = useState<t2i>({
    batch_count: 1,
    cfg_scale: 7,
    height: 256,
    negative_prompt: '',
    prompt: '',
    sampler_index: 'Euler a',
    seed: -1,
    steps: 20,
    width: 256,
  });

  return (
    <div className="Container">
      <Card>
        <FlexBoxCol>
          <h2>txt2img</h2>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 }, width: '100%', mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <MUITextField
                id="prompt"
                display="Prompt"
                allValues={allValues}
                // updateAllValues={allValues => setAllValues(allValues)}
                setAllValues={setAllValues}
              />
              <MUITextField
                id="negative_prompt"
                display="Negative prompt"
                allValues={allValues}
                // updateAllValues={allValues => setAllValues(allValues)}
                setAllValues={setAllValues}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '37.5%' } }}>
              <Button
                fullWidth
                size={'large'}
                sx={{ height: { xs: '3.5rem', md: '100%' }, fontSize: { xs: '1.125rem', md: '1.25rem' } }}
                onClick={() => mockApi(allValues)}
                variant="contained"
              >
                Imagine
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 }, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { xs: '100%', md: '50%'} }}>
              <MUISlider
                id="steps"
                display="Sampling steps"
                min={1}
                max={150}
                step={1}
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUIRadio
                id="sampler_index"
                display="Sampling method"
                controls={
                  [
                    'Euler a',
                    'Euler',
                    'LMS',
                    'Heun'
                  ]
                }
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUISlider
                id="width"
                display="Width"
                min={64}
                max={512}
                step={64}
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUISlider
                id="height"
                display="Height"
                min={64}
                max={512}
                step={64}
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUISlider
                id="batch_count"
                display="Batch count"
                min={1}
                max={100}
                step={1}
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUISlider
                id="cfg_scale"
                display="CFG scale"
                min={1}
                max={30}
                step={.5}
                allValues={allValues}
                setAllValues={setAllValues}
              />
              <MUINumber
                id="seed"
                display="Seed"
                min={-1}
                max={9999999999}
                step={1}
                allValues={allValues}
                setAllValues={setAllValues}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%'} }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', background: 'rgba(255, 255, 255, .5)' }}>
                  <Box component="img" id="a" sx={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'contain' }} src={"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="} width="512" height="512" alt="" />
                </Box>
              </Box>
            </Box>
          </Box>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
