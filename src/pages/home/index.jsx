import useToggle from "../../utils/hooks/useToggle"
import React,{ useState } from "react"
import useBoolean from "../../utils/hooks/useBoolean"

const HomePage = () => {
    const [state, actions] = useBoolean();
    
    return (
      <>
      <StaticWrapper
        actions={actions}
      />
      <span>{state.toString()}</span>
      </>
    );
  }
  
  const StaticWrapper = React.memo(({ actions }) => {
    console.log('Wrapper rendered');
    return <button onClick={actions.toggle}>Toggle</button>;
  });


export default HomePage