import React, { useState } from 'react';
import { PanelProps, } from '@grafana/data';
import { SimpleOptions } from 'types';



// import { css, cx } from 'emotion';
// import { stylesFactory, useTheme } from '@grafana/ui';

import { Canvas } from 'CanvasObjects/Canvas';
import { DropdownUI } from 'UIElement/Dropdown';
import { calcDropdownOptions } from 'CanvasObjects/Calculation';
import { dropdownOptions } from 'UIElement/DropdownOptions';
import 'Style/SimplePanel.css';
import {handler} from 'Process/Handler';

const levelOptions = ["Overview", "Namespace", "Service", "Pod", "Container"];
const metricOptions = ["CPU Nutzung", "Speicher Nutzung", "CPU Limits", "Memory Limits", "CPU Requests", "Memory Requests", "-"];

interface Props extends PanelProps<SimpleOptions> { }


export const SimplePanel: React.FC<Props> = ({ options, data, width, height, }) => {
  

  const [levelOption, setLevelOption] = useState("Overview");
  const [groupedOption, setGroupedOption] = useState("-");
  const [metricOption, setMetricOption] = useState("-");


  const setLevelOptionHandler = (label: string | undefined)=> {

    if(label !== undefined){
      try {
        setLevelOption(label.split(' ')[0]);
      }catch{
        setLevelOption(label);
      } 
    }
  }

  const setGroupedOptionHandler = (label: string | undefined)=> {
    if(label !== undefined){
      setGroupedOption(label)
    }
  }

  const setMetricOptionHandler = (label: string | undefined)=> {
    if(label !== undefined){
      setMetricOption(label);
    }
  }


  //call handler to get 
  const allRect= handler(width,height,levelOption, data);


  return (
    <div>
      <div className="header">
        <div className="test">
          <label>Level:</label>
          <div><DropdownUI id={"left"} options={dropdownOptions(levelOptions)} onChange={setLevelOptionHandler} value={levelOption}/></div>
        </div>
        <div className="test">
          <label>Grouped by:</label>
          <div><DropdownUI id={"center"} options={calcDropdownOptions()} onChange={setGroupedOptionHandler} value={groupedOption}/></div>
        </div>
        <div className="test">
          <label>Metric:</label>
          <div><DropdownUI id={"right"} options={dropdownOptions(metricOptions)} onChange={setMetricOptionHandler} value={metricOption}/></div>
        </div>
      </div>
      <Canvas width={width} height={height} allRect={allRect} levelOption={levelOption} setLevelOptionHandler={setLevelOptionHandler}/>
    </div>
  )

}