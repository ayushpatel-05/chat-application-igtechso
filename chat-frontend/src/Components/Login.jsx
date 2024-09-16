import Input from "./Input";
import Checkbox from "./Checkbox";
import { useState, useEffect } from "react";
import { login } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Main Login Component
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [formData, setFormdata] = useState({ email: "", password: "" });

  function handelChange(e) {
    if (e.target.type == "checkbox") return;
    setFormdata((oldState) => ({
      ...oldState,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/");
    }
  }, [user.isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO: Validate form data here

    dispatch(login(formData));
  };

  return (
    <div className="flex justify-center">
      <section className="bg-gray-50 dark:bg-gray-900 w-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Chat
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                <Input
                  label="Your email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  handelChange={handelChange}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  handelChange={handelChange}
                />
                <Checkbox
                  label="Remember me"
                  name="remember"
                  handelChange={handelChange}
                />
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Login
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Dont have an account?{" "}
                  <Link
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    to="/register"
                  >
                    Signup here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
