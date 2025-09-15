import Options from "./Options";
import Nav from "./Nav";

export default function PageHeader() {
  return (
    <header className="w-full h-7 bg-gray-600 text-white">
      <h1 className="inline mr-6 ml-3">MyKanBan</h1>
      <Options></Options>
      <Nav></Nav>
    </header>
  );
}
