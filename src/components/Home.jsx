import React, { useEffect, useState } from 'react'
import api from "../helper/Api";
import Table from 'react-bootstrap/Table';
import Loader from "../container/Loader";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
function Home() {
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState();
    useEffect(() => {
        getEmployeeList()
    }, []);

    const getEmployeeList = () => {
        api.get(`/list`).then((res) => {
            if (res.status === 200) {
                setEmployeeData(res.data.data);
                setLoading(false);
            }
        }).catch((err) => {
            toast.error(err.message);
        });
    }

    const handleDelete = (employee) => {
        swal({
            title: "Are you sure you want to delete this Employee?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                api.delete(`/delete?_id=${employee?._id}`).then((res) => {
                    if (res.status === 200) {
                        // toast.success(res.data.message);
                        swal("Poof! Employee has been deleted!", {
                            icon: "success",
                        });
                        getEmployeeList();
                    } else {
                        toast.error(res.data.message);
                    }
                });

            } else {
                swal("Employee is safe!");
            }
        });
    }

    return (
        <div className='p-3'>
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
                                    <td>{index + 1}</td>
                                    <td>{employee?.firstName}</td>
                                    <td>{employee?.lastName}</td>
                                    <td>{employee?.email}</td>
                                    <td>{new Date(employee?.dob).getDate()}-{new Date(employee?.dob).getMonth()}-{new Date(employee?.dob).getFullYear()}</td>
                                    <td>{employee?.employeeType}</td>
                                    <td>{employee?.hobbies?.join(", ")}</td>
                                    <td><img className='img-fluid rounded-circle' src={employee?.image} alt="profile" /></td>
                                    <td>
                                        <Link to={`/edit/${employee._id}`} className='btn btn-primary my-3'>Edit</Link>
                                        <Button className='btn btn-danger my-3' onClick={() => handleDelete(employee)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            }
        </div>
    );
}

export default Home