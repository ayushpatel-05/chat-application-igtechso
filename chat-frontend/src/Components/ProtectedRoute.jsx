import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
    if(!user) {
        return (<Navigate to="/login" replace></Navigate>)
    }
  return (
    <>
        {children}
    </>
  );
}