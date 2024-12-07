import React, { useEffect, useState } from 'react';
import { getDocs, getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CompanyListPage = () => {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [companyData,setCompanyData] = useState([])
  const db = getFirestore(app);
  const navigate = useNavigate()

  const addCompany=()=>{
    navigate("/addcompany")
  }

  const addSecondDocument=async()=>{

    try {
      const docRef = await addDoc(collection(db, "sEVIO5eSYoxZaQfa2Nuw"), {
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
      });
    
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "company"));
        const companies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCompanyData(companies); // Set companyData as an array of companies
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const companyCardClick=(data)=>{
    console.log(data)
      navigate(`/details/${data.id}`)
  }

  // Filter and Sort Logic
  const filteredCompanies = companyData && companyData
    .filter((company) => {
      return (
        (industryFilter === 'All' || companyData?.industry?.stringValue === industryFilter) &&
        company.name.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Company List</h1>
        <p className="text-gray-600 mt-2">Discover and review your favorite companies</p>
      </header>

      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-md w-full max-w-sm text-gray-800"
        />

        {/* Industry Filter */}
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="p-3 border rounded-md text-slate-700"
        >
          <option value="All">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
          <option value="Finance">Finance</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 rounded-md text-slate-700"
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies?.map((company) => (
            <div
              onClick={() => companyCardClick(company)}
              key={company.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
              <p className="text-gray-600">{company.industry}</p>
              <p className="mt-2 text-yellow-500 font-bold">⭐ {company.rating.toFixed(1)}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No companies found.</p>
        )}
      </div>
      <div className=' m-5 flex justify-center'>
      <button
            onClick={addCompany}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Company
          </button>
          <button
            onClick={addSecondDocument}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add another
          </button>
      </div>
    </div>
  );
};

export default CompanyListPage;
