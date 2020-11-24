import React, {useState} from 'react';



export function Test(){


    const [count, setCount] = useState(0);


    return(
        <div>
            <p>You clicked {count} time</p>
            <button onClick={()=> setCount(count+1)}>
                Click Me
            </button>
        </div>
    )

}