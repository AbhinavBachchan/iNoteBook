import React, { useState } from "react";
import noteContext from "./noteContext";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  // const[state,setState] = useState({
  //     "name":"harry",
  //     "class":"6c"
  // });
  // const update=()=>{
  //    setTimeout(()=>{
  //     setState({
  //         "name":"marry",
  //         "class":"11b"
  //     });
  //    },1000)
  // }
  let initialNotes = [];
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);

    //initialNotes = response.json(); // parses JSON response into native JavaScript objects
  }
  const [notes, setNotes] = useState(initialNotes);
  //for adding note using title,description and tag
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const note = response.json(); // parses JSON response into native JavaScript objects
    //pushing the note to the notes array
    setNotes(notes.concat(note));
  };
  //for deleting note
  const deleteNote = async(id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
      method:"DELETE",
      headers:{
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      }
    })
    const json = await response.json();
    console.log(json);
    console.log("deleting the node with " + id);
    //filter func takes an arrow function with a return value
    //if notes id is not equal to the id to be deleted then it will remain in the array else deleted
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };
  //for updating note
  const updateNote = async (id, title, description, tag) => {
    // Default options are marked with *
    //api 
    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    //const json = response.json(); // parses JSON response into native JavaScript objects
    //logic to edit in frontend
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
  };
  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, updateNote,getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};
export default NoteState;
