export default function Button({ children, onClick, bgcolor = "gray" }) {
  //bg-gray-700 bg-gray-800 bg-gray-300
  return (
    <button
      className={`m-1 px-3 inlinepy-2 text-xs font-medium text-center text-white bg-${bgcolor}-700 rounded-md hover:bg-${bgcolor}-800 focus:ring-1 focus:outline-none focus:ring-${bgcolor}-300 hover:cursor-pointer`}
      onClick={onClick}>
      {children}
    </button>
  );
}
