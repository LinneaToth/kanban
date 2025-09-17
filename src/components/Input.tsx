export default function Input({ type, name, labelText, value, onChange }) {
  switch (type) {
    case "text": {
      return (
        <>
          {" "}
          <label
            className="block mb-1 mt-2 text-sm text-slate-600"
            htmlFor={name}>
            {labelText}
          </label>
          <input
            className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}></input>
        </>
      );
    }
    case "textarea": {
      return (
        <>
          {" "}
          <label
            className="block mb-1 mt-2 text-sm text-slate-600"
            htmlFor={name}>
            {labelText}
          </label>{" "}
          <textarea
            id={name}
            className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            name={name}
            value={value}
            onChange={onChange}
          />
        </>
      );
    }
    case "select": {
      return (
        <>
          <label
            className="block mb-1 mt-2 text-sm text-slate-600"
            htmlFor={name}>
            {labelText}
          </label>
          <select
            id={name}
            name={name}
            className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow mb-4"
            onChange={onChange}>
            {value.map((board: Column) => {
              return (
                <option
                  key={board.id}
                  value={board.id}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer">
                  {board.title}
                </option>
              );
            })}
          </select>
        </>
      );
    }
    default:
      return null;
  }
}
