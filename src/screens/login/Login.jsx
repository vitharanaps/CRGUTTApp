import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { doc, getDoc } from "firebase/firestore";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        getUserDetails(user);
      })
      .catch((error) => {
        setError(true);
      });
    setLoading(false);
  };

  //check if admin

  const getUserDetails = async (user) => {
    const docRef = doc(db, "users", user?.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().role === "admin") {
        localStorage.setItem("user", JSON.stringify({id: docSnap?.id , ...docSnap.data()}));

        dispatch({ type: "LOGIN", payload: {id: docSnap?.id, ...docSnap.data()} });
        navigate("/");
      }else{
        alert("You Haven't Access To Do This")
      }
    } else {
      console.log("No such document!");
    }
  };
  return (
    <Box
      sx={{
        width: "95%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        paddingRight:10,
        backgroundImage: `url("../assests/adminPanelHome.jpeg")`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          height: "50vh",
          width: "40vw",
          boxShadow: "-1px 1px 7px 5px rgba(0,0,0,0.48)",
          borderRadius: 10,
          padding: 3,
          gap: 5,
        }}
      >
        <Box>
          <Typography variant="h6" color="gray">
            Welcome To CRGU TT App Manager
          </Typography>
        </Box>
        <form onSubmit={handleLogin}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <TextField
                id="outlined-required"
                label="Email"
                placeholder="Youremail@gmail.com"
                type="text"
                size="fullwidth"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                size="fullwidth"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            {error && (
              <Typography variant="body2" color="error">
                Something Went Wrong
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <Button variant="contained" type="submit">
                  Sign In
                </Button>
              )}

              <Button variant="outlined" type="reset">
                Reset
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
