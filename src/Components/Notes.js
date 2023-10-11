import React,{useContext,useEffect,useRef,useState} from 'react'
import {useNavigate} from 'react-router-dom';
import noteContext from "./Context/Notes/noteContext";
import NoteItem from './NoteItem';
import AddNote from './AddNote';
const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate = useNavigate()
  const {notes,getNotes,updateNote} = context;
  useEffect(()=>{
    console.log(localStorage);
    if(localStorage.getItem('token')!=null){
      getNotes();
    }else{
      navigate("/login");
    }
  },[])
  const ref = useRef(null);
  const closeRef = useRef(null);
  const editNote = (currentNote)=>{
     ref.current.click();
     setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag});
  }
  const [note, setNote] = useState({
    id:"",
    etitle: "",
    edescription: "",
    etag: "",
  });
  const handleClick = (e) => {
    console.log("updating the note",note);
    updateNote(note.id,note.etitle,note.edescription,note.etag);
    props.showAlert("Updated Successfully","success")
    closeRef.current.click();
    e.preventDefault();
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  return (
    <>
    <AddNote showAlert={props.showAlert}/>
    
<button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>
<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="etitle" className="form-label">
            title
          </label>
          <input
            type="text"
            className="form-control"
            id="etitle"
            name="etitle"
            aria-describedby="emailHelp"
            value={note.etitle}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="edescription" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="edescription"
            name="edescription"
            value={note.edescription}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
        <label className="form-label" htmlFor="etag">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="etag"
            name="etag"
            value={note.etag}
            onChange={onChange}
          />
          
        </div>
        </form>
      </div>
      <div className="modal-footer">
        <button ref={closeRef}type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button disabled={note.etitle.length<3||note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
      </div>
    </div>
  </div>
</div>
    <div className='row my-3'>
       <h1>Your Notes</h1>
      {notes.length>0? notes.map((note)=>{
        return <NoteItem key={note._id} editNote={editNote} showAlert={props.showAlert} note={note}/>;
      }):<div className='container mx-2'>
      No Notes to Display
      </div>}
    </div>
    </>
  )
}

export default Notes
