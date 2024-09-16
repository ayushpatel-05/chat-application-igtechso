import Input from "./Input";
import Checkbox from "./Checkbox";
import { useDispatch } from "react-redux";
import { register } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

// Main Login Component
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const dispatch = useDispatch();


  function handelChange(e) {
      if (e.target.type == "checkbox") return;
      setFormData((oldState) => ({
        ...oldState,
        [e.target.name]: e.target.value,
      }));
  }

  function handelSubmit(e) {
    e.preventDefault();

    dispatch(register(formData));
    navigate('/')
  }


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
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#" onSubmit={handelSubmit}>
              <Input
                  label="Your name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  handelChange={handelChange}
                />
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
                <Input
                  label="Confirm password"
                  type="password"
                  name="confirm-password"
                  placeholder="••••••••"
                />
                <Checkbox label="I accept the" name="terms" />
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" to="/login">
                    Login here
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
