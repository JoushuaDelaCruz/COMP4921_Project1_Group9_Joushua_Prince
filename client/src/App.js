import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api").then((res) => setData(res.data));
  }, []);

  return (
    <div className="container">
      <button type="button" className="btn btn-success">
        {!data ? "Loading..." : data}
      </button>
    </div>
  );
};

export default App;
