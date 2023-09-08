import React from "react";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState("");
  const [passwordInvalidMessage, setPasswordInvalidMessage] = useState("");

  const inputIsInvalid = (idTag) => {
    document.getElementById(idTag).classList.remove("is-valid");
    document.querySelector(`[id="${idTag}"]`).classList.add("is-invalid");
  };

  const inputIsValid = (idTag) => {
    document.getElementById(idTag).classList.remove("is-invalid");
    document.querySelector(`[id="${idTag}"]`).classList.add("is-valid");
  };

  const validatePassword = () => {
    if (password === "") {
      inputIsInvalid("passwordInput");
      setPasswordInvalidMessage("Please enter your password");
      return false;
    }
    // Check if password is correct in the database!
    inputIsValid("passwordInput");
    return true;
  };

  const validateUsername = () => {
    if (!username) {
      inputIsInvalid("usernameInput");
      setUsernameInvalidMessage("Please enter your username");
      return false;
    }
    // Check if a username finds a match in the database
    inputIsValid("usernameInput");
    return true;
  };

  const loginUser = async () => {
    console.log(validateUsername());
    console.log(validatePassword());
  };

  return (
    <main className="vh-100 bg-dark bg-opacity-25">
      <p>
        {" "}
        <a href="./">LinkMorpher</a>{" "}
      </p>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-light text-primary">
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h1 className="fw-bold mb-2 text-uppercase">Log In</h1>
                  <p className="text-primary-50 mb-5">
                    Login to your LinkMorpher Account
                  </p>

                  <div className="form-outline mb-4">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Enter your username"
                      id="usernameInput"
                      required
                    />
                    <div className="invalid-feedback">
                      {usernameInvalidMessage}
                    </div>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      id="passwordInput"
                      className="form-control"
                      placeholder="Enter your password"
                      required
                    />
                    <div className="invalid-feedback">
                      {passwordInvalidMessage}
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary btn-lg px-5 mt-5"
                    type="submit"
                    onClick={loginUser}
                  >
                    Login
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="./signup" className="text-info-50 fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
