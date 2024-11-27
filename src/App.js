import CompanyListPage from "./components/CompanyListPage";
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="text-white h-screen">
     <Navbar/>
     {/* <LoginForm/> */}
     {/* <HomePage/> */}
     <CompanyListPage/>
    </div>
  );
}

export default App;
