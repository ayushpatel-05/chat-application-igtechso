export default function Checkbox({ label, name, handelChange }) {
    return (
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id={name}
              name={name}
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              required
              onChange={handelChange}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={name}
              className="font-light text-gray-500 dark:text-gray-300"
            >
              {label}{" "}
              <a
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                href="#"
              >
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>
      );
}