import { Toaster } from "sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import { RoutesWrapper } from "./routes";


function App() {
  return (
    <div className="tableMain">
      <ErrorBoundary>
        <RoutesWrapper />
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            success: "toast-success",
            error: "toast-error",
          },
        }}
      />
    </div>
  );
}

export default App