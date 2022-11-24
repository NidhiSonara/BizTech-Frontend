import React, {useRef, useState, useEffect } from "react";
import {  useLocation } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import Card from 'react-bootstrap/Card';


import api from "../helper/Api";



function AddEditEmployee(props) {

  const location = useLocation();
  const pathname = location.pathname;

  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [operationType, setoperationType] = useState("ADD");

  const [employee, setEmployee] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    image: "",
    employeeType: "",
    dob: "",
    hobbies: []
  });

  useEffect(() => {
    if (pathname.includes("/add")) {
      setoperationType("ADD");
      setLoading(false);
    } else if (pathname.includes("/edit")) {
      setoperationType("EDIT");
      api.get(`details-by-id?id=${props.match.params.id}`).then((res) => {
        if (res.status === 200) {
          console.log("res.data.data",res.data.data)
          // setPoem(res.data.data);
          // setEditor(res.data.data);
          setLoading(false);
        }
      });
    }
  }, []);

  const validator = useRef(
    new SimpleReactValidator({
      className: "form-error",
    })
  );

  const handleTextChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validator.current.allValid()) {
      let fields = {};
      let api_path = "/add";
      let api_method = "post";

      fields = employee;

      if (operationType === "EDIT") {
        fields._id = props.match.params.id;
        api_path = "/edit";
        api_method = "put";
      } 

      api[api_method](api_path, { ...fields }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.message);
          props.history.push("/poem");
        } else {
          toast.error(res.message);
        }
      });
    } else {
      validator.current.showMessages();
      setForceUpdate(!forceUpdate);
    }
  };

  return (
    <Card className="m-2">
      <Card.Body>
        <h2>{operationType === "ADD" ? "Add" : "Edit"} Employee</h2>
        
      </Card.Body>
    </Card>
  )
}

export default AddEditEmployee