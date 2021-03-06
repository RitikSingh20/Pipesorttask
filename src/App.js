import axios from 'axios';
import React, { useState, useEffect } from 'react'
import './App.css';
import { MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup,MDBPagination,MDBPaginationLink,MDBPaginationItem} from "mdb-react-ui-kit"


function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage,setCurrentPage] = useState(0);
  const [PageLimit] = useState(4);

  const sortOptions = ["name", "address", "emial", "phone", "status"]


  useEffect(() => {
    loadUsersData(0, 4, 0);
  }, []);

  const loadUsersData = async (start,end,increase) => {
    return await axios.get(`http://localhost:3000/users?_start=${start}&_end=${end}`)
      .then((response) => {
       setData(response.data);
       setCurrentPage(currentPage + increase)
      })

      .catch((err) => console.log(err));
 };
  console.log("data", data)

  const handleReset = () => {
    loadUsersData(0,4,0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(`http://localhost:3000/users?q=${value}`)
      .then((response) => {
        setData(response.data);
        setValue("");
      })
      .catch((err) => console.log(err));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value)
    return await axios
      .get(`http://localhost:3000/users?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data);

      })
      .catch((err) => console.log(err));
  };


  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:3000/users?status=${value}`)
      .then((response) => {
        setData(response.data);

      })
      .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if(currentPage === 0) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBBtn onClick={() => loadUsersData(4,8,1)}> 
            Next
          </MDBBtn>
        </MDBPagination>
      );
    } else if( currentPage < PageLimit -1 && data.length === PageLimit ) {
      return (
        <MDBPagination className='mb-0'>
      
        <MDBPaginationItem> <MDBBtn onClick={() => loadUsersData((currentPage -1) * 4, currentPage * 4,-1)}> 
        Prev
        </MDBBtn></MDBPaginationItem>
        <MDBPaginationItem><MDBPaginationLink>{currentPage + 1}</MDBPaginationLink></MDBPaginationItem>
   
        

        <MDBPaginationItem> <MDBBtn onClick={() => loadUsersData((currentPage + 1) * 4, (currentPage +2 ) *4,1)}> 
          Next
        </MDBBtn></MDBPaginationItem>
       
      </MDBPagination>
      )
    } else {
      return (
        <MDBPagination className='mb-0'>
       
        <MDBBtn onClick={() => loadUsersData(4,8,-1)}> 
          Prev
        </MDBBtn>
        <MDBPaginationItem>
          <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
      
      )
    }
  }

  return (
    <div>
      <MDBContainer>
        <form style={{ margin: "auto", padding: "15px", maxWidth: "400px", alignContent: "center" }}
          className="d-flex input-group w-auto"
          onSubmit={handleSearch}
        >
          <input type="text" className='form-control' placeholder='Search Name...' value={value} onChange={(e) => setValue(e.target.value)} />

          <MDBBtn type="submit" color="dark">Search</MDBBtn>
          <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>Reset</MDBBtn>



        </form>
        <div style={{ marginTop: "100px" }}>
          <h2 className='text-center'>Search, filter ,Sort and Pagination </h2>
          <MDBRow>
            <MDBCol size="12">
              <MDBTable>
                <MDBTableHead dark>
                  <tr>
                    <th scope='col'>No.</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Phone</th>
                    <th scope='col'>Address</th>
                    <th scope='col'>Status</th>
                  </tr>
                </MDBTableHead>
                {data.length === 0 ? (
                  <MDBTableBody className='align-center mb-0'>
                    <tr>
                      <td colSpan={8} className="text-center mb-0">No data Found</td>
                    </tr>
                  </MDBTableBody>
                ) : (
                  data.map((item, index) => (
                    <MDBTableBody key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.status}</td>
                      </tr>

                    </MDBTableBody>
                  ))

                )}
              </MDBTable>
            </MDBCol>
          </MDBRow>
          <div style={{ margin: "auto", padding: "15px", maxWidth: "250px", alignContent: "center" }}>{renderPagination()}</div>
        </div>


        <MDBRow>
          <MDBCol size="8">
            <h5>Sort By:</h5>
            <select style={{ width: "50%", borderRadius: "2px", height: "35px" }} onChange={handleSort} value={sortValue}>
              <option>Please select value</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))}
            </select>
          </MDBCol>

          <MDBCol size="4">
            <h5>Filter By Status</h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter("active")}>Active</MDBBtn>
              <MDBBtn color="danger" style={{ marginLeft: "2px" }} onClick={() => handleFilter("unactive")}>Unactive</MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default App;
