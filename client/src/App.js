import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api").then((res) => setData(res.data));
  }, []);

  return (
    <>
      <header className="mb-auto"></header>
      <div className="d-flex justify-content-center align-items-center h-100 p-5 bg-dark rounded-3">
        <button type="button" className="btn btn-success">
          {!data ? "Loading..." : data}
        </button>
      </div>
    </>
  );
};

export default App;
