import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ApplicationContextProvider } from "./context/ContextManager";
import { EditPage, HomePage, RegisterPage } from "./pages";

export function RoutesWrapper(): React.ReactElement {
  return (
    <Router>
      <ApplicationContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/editar/:id" element={<EditPage />} />
        </Routes>
      </ApplicationContextProvider>
    </Router>
  );
}
