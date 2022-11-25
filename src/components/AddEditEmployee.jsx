import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from 'react-bootstrap/Card';
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup';
import { Form, Button } from "react-bootstrap";


import api from "../helper/Api";
import { EMPLOYEETYPE, HOBBIES } from "../config/constants";


function AddEditEmployee(props) {

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const { employeeId } = useParams()

  const [operationType, setoperationType] = useState("ADD");

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name is a required field."),
    lastName: Yup.string().required("Last name is a required field."),
    email: Yup.string().required().email("Email is a required field."),
    image: Yup.string().url().required("Image is a required field."),
    employeeType: Yup.string().required("Employee Type is a required field."),
    dob: Yup.date().required("Date of Birth is a required field."),
    hobbies: Yup.array().min(1).required("Hobbies is a required field"),
  });


  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      image: "",
      employeeType: "",
      dob: "",
      hobbies: []
    },
    validationSchema: schema,
    onSubmit: (values, actions) => {

      let fields = {};
      let api_path = "/add";
      let api_method = "post";

      fields = values;

      if (operationType === "EDIT") {
        fields._id = employeeId;
        api_path = "/update";
        api_method = "put";
      }

      api[api_method](api_path, { ...fields }).then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      }).catch((err) => {
        toast.error(err.message);
      });
    }
  })


  useEffect(() => {
    if (pathname.includes("/add")) {
      setoperationType("ADD");
    } else if (pathname.includes("/edit")) {
      setoperationType("EDIT");

      api.get(`/details-by-id?_id=${employeeId}`).then(async (res) => {
        if (res.status === 200) {

          let { data } = res.data
          let dobDateObj = new Date(data?.dob)

          const formattedDate = dobDateObj.toLocaleDateString('fr-CA', {
            year: 'numeric', month: 'numeric', day: 'numeric',
          })

          await formik.setFieldValue('firstName', data.firstName, false);
          await formik.setFieldValue('lastName', data.lastName, false)
          await formik.setFieldValue('email', data.email, false)
          await formik.setFieldValue('image', data.image, false)
          await formik.setFieldValue('employeeType', data.employeeType, false)
          await formik.setFieldValue('dob', formattedDate, false)
          await formik.setFieldValue('hobbies', data.hobbies, false)
        }
      });
    }
  }, []);

  return (
    <div className="p-3">
      <Link to={'/'}>Back</Link>
      <Card className="m-2">
        <Card.Body>
          <h2>{operationType === "ADD" ? "Add" : "Edit"} Employee</h2>
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group className="mt-3">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  isValid={formik.touched.firstName && !formik.errors.firstName}
                  isInvalid={!!formik.errors.firstName}
                />
                <Form.Control.Feedback type="invalid"> {formik.errors.firstName} </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  isValid={formik.touched.lastName && !formik.errors.lastName}
                  isInvalid={!!formik.errors.lastName}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isValid={formik.touched.email && !formik.errors.email}
                  isInvalid={!!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>User Profile</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                  isValid={formik.touched.image && !formik.errors.image}
                  isInvalid={!!formik.errors.image}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Employee Type</Form.Label>
                <Form.Select
                  name="employeeType"
                  value={formik.values.employeeType}
                  onChange={formik.handleChange}
                  isValid={formik.touched.employeeType && !formik.errors.employeeType}
                  isInvalid={!!formik.errors.employeeType}
                >
                  <option value=''>Select Employee Type</option>
                  {Object.keys(EMPLOYEETYPE).map((key) => (
                    <option key={key} value={key}>{EMPLOYEETYPE[key]}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formik.errors.employeeType}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  isValid={formik.touched.dob && !formik.errors.dob}
                  isInvalid={!!formik.errors.dob}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.dob}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Hobbies : </Form.Label>
                {Object.keys(HOBBIES).map((key) => (
                  <Form.Check
                    key={key}
                    value={key}
                    label={HOBBIES[key]}
                    name="hobbies"
                    type="checkbox"
                    isValid={formik.touched.hobbies && !formik.errors.hobbies}
                    isInvalid={!!formik.errors.hobbies}
                    checked={formik.values.hobbies.includes(key)}
                    onChange={formik.handleChange}
                  />
                ))}
                <Form.Control.Feedback type="invalid">{formik.errors.hobbies}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" className="mt-3" >Submit</Button>
            </Form>
          </FormikProvider>

        </Card.Body>
      </Card>
    </div>
  )
}

export default AddEditEmployee