import React, { useEffect, useState } from 'react'
import api from "../helper/Api";
import Table from 'react-bootstrap/Table';
import Loader from "../container/Loader";
import { Link } from "react-router-dom";
function Home() {
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState();
    useEffect(() => {
        api.get(`/list`).then((res) => {
            console.log("🚀 ~ file: Home.jsx ~ line 9 ~ api.get ~ res", res)
            if (res.status === 200) {
                setEmployeeData(res.data.data);
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            {loading ?
                <Loader />
                :
                <>
                    <Link to="/add" className='btn btn-primary my-3'>Add New</Link>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Date of Birth</th>
                                <th>Employee Type</th>
                                <th>Hobbies</th>
                                <th>Profile Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData && employeeData.map((employee, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{employee?.firstName}</td>
                                    <td>{employee?.lastName}</td>
                                    <td>{employee?.email}</td>
                                    <td>{new Date(employee?.dob).getDay()} - {new Date(employee?.dob).getMonth()} - {new Date(employee?.dob).getFullYear()}</td>
                                    <td>{employee?.employeeType}</td>
                                    <td>{employee?.hobbies?.join(", ")}</td>
                                    <td><img className='img-fluid rounded-circle' src={employee?.image} alt="profile" /></td>
                                    <td>
                                        <Link to="/add" className='btn btn-primary my-3'>Edit</Link>
                                        <Link to="/add" className='btn btn-danger my-3'>Delete</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            }
        </>
    );
}

export default Home