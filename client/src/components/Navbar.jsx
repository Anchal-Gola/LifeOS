function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b">
      <h2 className="text-2xl font-bold">LifeOS</h2>

      <div className="flex items-center gap-8">
        <a href="#features" className="hover:text-blue-600">
          Features
        </a>

        <a href="#about" className="hover:text-blue-600">
          About
        </a>

        <button className="border rounded-lg px-4 py-2">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;