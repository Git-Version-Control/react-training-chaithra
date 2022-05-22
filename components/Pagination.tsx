import React from 'react';
import { useEffect } from 'react';
import "../components/Pagination.css";

const Pagination = ({ itemPerPage, totalPosts,paginate }:any) => {
  const pageNumbers = [];
  

  for (let i = 1; i <= Math.ceil(totalPosts / itemPerPage); i++) {
    pageNumbers.push(i);
  }
  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?page=";
  const fetchData = async() => {
    //let base_url="https://restcountries.com/v3.1/name/"+quote+locationData.location.name+quote
    
    const response=await fetch(`${API_ENDPOINT}${paginate}`)
    const data=await response.json();
    console.log(data); 
   
  };
  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className='pagination'>
        {pageNumbers.map(number => (
          <div key={number} className='page-item'>
            {/*<a onClick={() => paginate(number)} href='!#' className='page-link'>*/}
            <a onClick={()=>{fetchData()}}>
              {number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
