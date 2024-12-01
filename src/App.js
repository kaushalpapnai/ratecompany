import AboutUs from "./components/AboutUs";
import AdminDashboard from "./components/AdminDashboard";
import CompanyDetailsPage from "./components/CompanyDetailsPage";
import CompanyListPage from "./components/CompanyListPage";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import SubmitReviewPage from "./components/SubmitReviewPage";
import UserProfilePage from "./components/UserProfilePage";
import ContactUs from "./ContactUs";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  
  const user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    reviews: [
      {
        companyName: 'TechCorp',
        rating: 4,
        comment: 'Great company to work with!',
      },
      {
        companyName: 'Webify Solutions',
        rating: 5,
        comment: 'Amazing services and support.',
      },
    ],
  };


  const stats = {
    users: 120,
    companies: 50,
    reviews: 300,
  };
  
  const companies = [
    { id: 1, name: 'TechCorp', reviewCount: 150 },
    { id: 2, name: 'Webify Solutions', reviewCount: 80 },
  ];
  
  const reviews = [
    { id: 1, userName: 'Alice Johnson', companyName: 'TechCorp', rating: 4 },
    { id: 2, userName: 'Bob Smith', companyName: 'Webify Solutions', rating: 5 },
  ];



  const router = createBrowserRouter([
    {
      path:"/",
      element: <HomePage/>
    },
    {
      path:"/login",
      element: <LoginForm/>
    },
    {
      path:"/about",
      element: <AboutUs/>
    },
    {
      path:"/companylist",
      element: <CompanyListPage/>
    },
    {
      path:"/companydetails",
      element: <CompanyDetailsPage/>
    },
    {
      path:"/submitreview",
      element: <SubmitReviewPage/>
    },
    {
      path:"/userprofile",
      element: <UserProfilePage/>
    },
    {
      path:"/contactus",
      element: <ContactUs/>
    },
  ])
  
  

  return (
    <RouterProvider router={router}>
      <Navbar/>
      <LoginForm/>
      <HomePage/>
      <CompanyListPage/>
      <CompanyDetailsPage/>
      <SubmitReviewPage companyName={"techCorp"} />
      <UserProfilePage user={user}/>
      {/* <AdminDashboard stats={stats} companies={companies} reviews={reviews}/> */}
      <AboutUs/>
      <ContactUs/>
    </RouterProvider>

  );
}

export default App;
