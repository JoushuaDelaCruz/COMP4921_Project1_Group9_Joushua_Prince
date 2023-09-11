import React, { useEffect } from "react";
import axios from "axios";

const NotFound = () => {
  useEffect(() => {
    fetch("/404");
  }, []);
  return <div>Page not found</div>;
};

export default NotFound;
