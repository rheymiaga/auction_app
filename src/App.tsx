import { Route, Routes } from "react-router-dom"
import { Home } from "./components/homePage/Home"
import { Admin } from "./components/adminPage/Admin"


function App() {


  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
