import React, { useContext } from "react";
import "./NoteItem.css";
import noteContext from "./Context/Notes/noteContext";
const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { note, editNote } = props;
  const { deleteNote } = context;
  const handleClick = () => {
    deleteNote(note._id);
    props.showAlert("Deleted Successfully","success");
  };

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-trash mx-2" onClick={handleClick}></i>
            <i className="fa-solid fa-pen-to-square mx-3" onClick={() => {editNote(note)}}></i>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
