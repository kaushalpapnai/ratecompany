import React, { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const AddNewCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState("");
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !industry || !rating || !description) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "company"), {
        name: companyName,
        industry,
        rating: parseFloat(rating),
        description,
        ...(location && { location }),
      });
      setSuccessMessage(`Company added successfully! ID: ${docRef.id}`);
      setErrorMessage("");
      setCompanyName("");
      setIndustry("");
      setRating("");
      setDescription("");
      setLocation("");
    } catch (error) {
      setErrorMessage("Error adding company: " + error.message);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "company"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add a Company</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details to add a new company
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="name"
          >
            Company Name
          </label>
          <input
            type="text"
            id="name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter company name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="industry"
          >
            Industry
          </label>
          <input
            type="text"
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter company industry"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="location"
          >
            Location (optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter company location"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="rating"
          >
            Rating (1-5)
          </label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter company rating"
            min="1"
            max="5"
            step="0.1"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="Enter company description"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Add Company
        </button>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default AddNewCompany;
