import { useState } from "react";
import { useFilesContext } from "../hooks/useFilesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const FileForm = () => {
  const { dispatch } = useFilesContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const file = { title: "Default title" };

    const response = await fetch("/api/files", {
      method: "POST",
      body: JSON.stringify(file),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_FILE", payload: json });
    }
  };

  return (
    <button onClick={handleSubmit}>Add File</button>
    // <form className="create" onSubmit={handleSubmit}>
    //   <h3>Add a New File</h3>

    //   <label>File Title:</label>
    //   <input
    //     type="text"
    //     onChange={(e) => setTitle(e.target.value)}
    //     value={title}
    //     className={emptyFields.includes("title") ? "error" : ""}
    //   />

    //   <button>Add File</button>
    //   {error && <div className="error">{error}</div>}
    // </form>
  );
};

export default FileForm;
