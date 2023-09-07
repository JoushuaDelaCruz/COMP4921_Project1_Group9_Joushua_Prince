import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api").then((res) => setData(res.data));
  }, []);

  return (
    <div className="App">
      <h1>{!data ? "Loading..." : data}</h1>
    </div>
  );
};

export default App;
