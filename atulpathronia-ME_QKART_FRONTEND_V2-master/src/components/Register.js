import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link,useHistory } from "react-router-dom";


const Register = () => {
  // REGISTER FORM DATA
  const [form,setForm] = useState({
    username: "", password: "", confirmPassword: ""
  })

  // LOADING
  const [loading,setLoading] = useState(false)

  // MATERTIAL UI COMPONENT
  const { enqueueSnackbar } = useSnackbar();

  // REACT ROUTER DOM COMPONENT
  const history = useHistory();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const register = async (formData) => {
    // FORM INPUT VALIDATION
     if(validateInput(form) === true){

      // IF VALIDATION IS TRUE ; LOADING WILL START
      setLoading(true)

      // REGISTER END POINT URL
      const registerEndPoint = config.endpoint + "/auth/register"

      
      try {
        const res = await axios.post(registerEndPoint, {username:form.username, password:form.password})
        if(res.status === 201){
          // IF VALIDATION IS TRUE, ENDPOINT IS CONFIGURED, BACKEND IS RUNNING AND USERNAME IS NOT CREATED SUCCESS RESPSONSE WILL COME
          enqueueSnackbar("Registered Successfully", { variant: 'success' });
          setLoading(false)
          history.push("/login")
          
        }
      } catch (err) {
        setLoading(false)
        if (err.response && err.response.status === 400) {
          // DUPLICATE USERNAME
          enqueueSnackbar("Username is already taken", { variant: 'error' });
        } else {
          // IF BACKEND IS NOT RUNNING
          enqueueSnackbar("Something went wrong!", { variant: 'error' });
        }
      }
     }
  };
  

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(data.username === ""){
      // VALIDATING USERNAME IS NOT EMPTY
      enqueueSnackbar("Username is a required field", { variant: 'warning' });
      return false
    }  
     if(data.username.length <= 5){
      // VALIDATING USERNAME LENGTH GREATER THAN OR EQUAL TO 6
      enqueueSnackbar("Username must be at least 6 characters", { variant: 'warning' });
      return false
    }   
    if(data.password === ""){
      // VALIDATING PASSWORD IS NOT EMPTY
      enqueueSnackbar("Password is a required field", { variant: 'warning' });
      return false
    } if(data.password.length <= 5 ){
      // VALIDATING PASSWORD LENGTH GREATER THAN OR EQUAL TO 6
      enqueueSnackbar("Password must be at least 6 characters", { variant: 'warning' });
      return false
    }if(data.password !== data.confirmPassword){
    // VALIDATING PASSWORD INPUT VALUE WITH CONFIRM PASSWORD INPUT VALUE
    enqueueSnackbar("Passwords do not match", { variant: 'warning' });
      return false
    } else {
      // IF NONE OF THE ABOVE RETURN HAPPEN RETURN TRUE
      return true
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={form.username}
            onChange={(e)=>setForm({...form,username:e.target.value})}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={form.confirmPassword}
            onChange={(e)=>setForm({...form, confirmPassword:e.target.value})}
          />
          {loading ?
          <Button className="button" variant="contained" onClick={register}>
                    <CircularProgress color="inherit"></CircularProgress>
         </Button>
          : <Button className="button" variant="contained" onClick={register}>
            Register Now
           </Button> } 
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
              </Link>             
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
