import React from 'react'

function Alert(props) {
    const capital=(word)=>{
      if(word==="danger"){
        word="Error"
      }
       const lower = word.toLowerCase();
       return lower.charAt(0).toUpperCase()+ lower.slice(1);
    }
  return (
    <div style={{height:'40px'}}>
       {props.alert && 
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
        <strong>{capital(props.alert.type)}</strong>: {props.alert.mssg}
    </div>}
        </div>
  )
}

export default Alert