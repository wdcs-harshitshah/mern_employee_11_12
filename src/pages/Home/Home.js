import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spiner from "../../components/Spiner/Spiner";
import Tables from "../../components/Tables/Tables";
import {
  addData,
  dltdata,
  updateData,
} from "../../components/context/ContextProvider";
import { deletefunc, usergetfunc, usersalary } from "../../services/Apis";
import "./home.css";

const Home = () => {
  const [userdata, setUserData] = useState([]);
  const [showspin, setShowSpin] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [salary, setSalary] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { useradd, setUseradd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deletedata, setDLtdata } = useContext(dltdata);

  const navigate = useNavigate();

  const adduser = () => {
    navigate("/register");
  };

  // get user
  const userGet = async () => {
    try {
      const response = await usergetfunc(search, gender, status, sort, page);
      if (response.status === 200) {
        setUserData(response.data.usersdata);

        const total = response.data.usersdata.reduce((acc, user) => {
          console.log("Acc:", acc);
          console.log("User Salary:", user.salary);
          return acc + user.salary
        }, 0)
        setTotalSalary(total);
        setPageCount(response.data.Pagination.pageCount);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // user delete
  const deleteUser = async (id) => {
    try {
      const response = await deletefunc(id);
      if (response.status === 200) {
        userGet();
        setDLtdata(response.data);
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // pagination
  // handle prev btn
  const handlePrevious = () => {
    setPage((prevPage) => {
      if (prevPage === 1) return prevPage;
      return prevPage - 1;
    });
  };

  // handle next btn
  const handleNext = () => {
    setPage((prevPage) => {
      if (prevPage === pageCount) return prevPage;
      return prevPage + 1;
    });
  };

  useEffect(() => {
    userGet()
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, gender, status, sort, page, salary]);

  useEffect(() => {
    usersalary()
      .then((res) => res.json())
      .then((data) => setSalary(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      {useradd ? (
        <Alert variant="success" onClick={() => setUseradd("")} dismissible>
          {useradd.fname.toUpperCase()} Successfully Added
        </Alert>
      ) : (
        ""
      )}

      {update ? (
        <Alert variant="primary" onClick={() => setUpdate("")} dismissible>
          {update.fname.toUpperCase()} Successfully Update
        </Alert>
      ) : (
        ""
      )}

      {deletedata ? (
        <Alert variant="danger" onClick={() => setDLtdata("")} dismissible>
          {deletedata.fname.toUpperCase()} Successfully Delete
        </Alert>
      ) : (
        ""
      )}
      <h3>Total salary of All the Employees: {totalSalary}</h3>

      {/* search add btn */}
      <div className="search_add mt-4 d-flex justify-content-between">
        <div className="search col-lg-4">
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="success" className="search_btn">
              Search
            </Button>
          </Form>
        </div>
        <div className="add_btn">
          <Button variant="primary" onClick={adduser}>
            {" "}
            <i className="fa-solid fa-plus"></i>&nbsp; Add User
          </Button>
        </div>
      </div>

      <div className="filter_gender">
        <div className="filter">
          <h3>Filter By Gender</h3>
          <div className="gender d-flex justify-content-between">
            <Form.Check
              type={"radio"}
              label={`All`}
              name="gender"
              value={"All"}
              onChange={(e) => setGender(e.target.value)}
              defaultChecked
            />
            <Form.Check
              type={"radio"}
              label={`Male`}
              name="gender"
              value={"Male"}
              onChange={(e) => setGender(e.target.value)}
            />
            <Form.Check
              type={"radio"}
              label={`Female`}
              name="gender"
              value={"Female"}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* sort by value */}
      <div className="filter_newold">
        <h3>Sort By Value</h3>
        <Dropdown className="text-center">
          <Dropdown.Toggle className="dropdown_btn" id="dropdown-basic">
            <i className="fa-solid fa-sort"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSort("new")}>New</Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("old")}>Old</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* filter by status */}
      <div className="filter_status">
        <div className="status">
          <h3>Filter By Status</h3>
          <div className="status_radio d-flex justify-content-between flex-wrap">
            <Form.Check
              type={"radio"}
              label={`All`}
              name="status"
              value={"All"}
              onChange={(e) => setStatus(e.target.value)}
              defaultChecked
            />
            <Form.Check
              type={"radio"}
              label={`Active`}
              name="status"
              value={"Active"}
              onChange={(e) => setStatus(e.target.value)}
            />
            <Form.Check
              type={"radio"}
              label={`InActive`}
              name="status"
              value={"InActive"}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
      </div>

      {showspin ? (
        <Spiner />
      ) : (
        <Tables
          userdata={userdata}
          deleteUser={deleteUser}
          userGet={userGet}
          usersalary={usersalary}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          page={page}
          pageCount={pageCount}
          setPage={setPage}
        />
      )}
    </>
  );
};

export default Home;
