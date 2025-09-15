export default function Button({ children, onClick, bgcolor = "gray" }) {
  //bg-gray-700 bg-gray-800 bg-gray-300
  return (
    <button
      className={`rounded-md bg-slate-800 py-1 px-3 border border-transparent text-center text-xs text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer`}
      onClick={onClick}>
      {children}
    </button>
  );
}
