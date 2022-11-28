import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";
import { newOnCreateNote } from "./graphql/subscriptions";

function App({ signOut, user }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [id, setId] = useState("");

  let subOncreate;

  function setUpSubscriptions() {
    subOncreate = API.graphql(graphqlOperation(newOnCreateNote)).subscribe({
      next: (noteData) => {
        // next is a function that allows to get any data that returns from a Subscription
        console.log(noteData.value);
      },
    });
  }
  useEffect(() => {
    getNotes();
    // API.graphql(graphqlOperation(onCreateNote)).subscribe({
    //   next: (noteData) => {
    //     // next is a function that allows to get any data that returns from a Subscription
    //     console.log(noteData);
    //   },
    // });
  }, [setNotes]);

  useEffect(() => {
    console.log("subscription");
    setUpSubscriptions();
    return () => {
      subOncreate.unsubscribe();
    };
  }, []);

  const getNotes = async () => {
    // You can await here
    const result = await API.graphql(graphqlOperation(listNotes));
    setNotes(result.data.listNotes.items);
    // ...
  };

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const hasExistingNote = () => {
    if (id) {
      // check to see if ID exists
      const isNote = notes.findIndex((note) => note.id === id) > -1;
      // check boolean, if findIndex = -1 didnt find an index
      return isNote;
    }
    return false;
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    console.log(note);
    // check to see if existing note
    if (hasExistingNote()) {
      // UPDATE note
      handleUpdateNote();
    } else {
      // CREATE note
      const input = {
        note: note,
      };
      const result = await API.graphql(
        graphqlOperation(createNote, {
          input: input,
        })
      );
      const newNote = result.data.createNote;
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setNote("");
    }
  };

  const handleUpdateNote = async () => {
    const input = { id, note };
    const result = await API.graphql(graphqlOperation(updateNote, { input }));
    const updatedNote = result.data.updateNote;
    // find index
    const index = notes.findIndex((note) => note.id === updatedNote.id);
    const updatedNotes = [
      // slides before index
      ...notes.slice(0, index),
      // index
      updatedNote,
      // slides after index
      ...notes.slice(index + 1),
    ];
    setNotes(updatedNotes);
    setId("");
    setNote("");
  };

  const handleDeleteNote = async (noteId) => {
    const input = {
      id: noteId,
    };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedNoteId = result.data.deleteNote.id;
    const updatedNotes = notes.filter((note) => note.id !== deletedNoteId);
    setNotes(updatedNotes);
  };

  const handleSetNote = (item) => {
    const { note, id } = item;
    setNote(note);
    setId(id);
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-wasged-red">
      <button onClick={signOut}>Sign out</button>
      <h1 className="code f2-1">Amplify Notetaker</h1>
      <form className="mb3" onSubmit={handleAddNote}>
        <input
          type="text"
          value={note}
          onChange={handleChange}
          className="pa2 f4"
          placeholder="Write your note"
        />
        <button className="pa2 f4" type="submit">
          {id !== "" ? "Update note" : "Add Note"}
        </button>
      </form>
      {/* Notes List */}
      <div>
        {notes.map((item) => (
          <div key={item.id} className="flex items-center">
            <li onClick={() => handleSetNote(item)} className="list pa1 f3">
              {item.note}
            </li>
            <button
              onClick={() => handleDeleteNote(item.id)}
              className="bg-transparent bn f4"
            >
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, true, { includeGreetings: true });
