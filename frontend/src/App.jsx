import "./App.css";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/add"
          element={<AddTask />}
        />

        <Route
          path="/edit/:id"
          element={<EditTask />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;