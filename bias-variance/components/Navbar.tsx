import { NAV_LINKS } from "@/constants";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className="bg-amber-100 bg-opacity-30 flexCenter max-container
  padding-container relative z-30 py-7 px-4 mt-4 mx-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link
        href="/"
        className="text-[25px] font-montserrat font-extrabold 
   text-primary/100 hover:text-primary/80 transition-colors duration-300 ml-[50px] mr-[50px]"
      >
        {/* text-primary/100 */}
        Bias-Variance Playground
      </Link>
      <ul className="hidden h-full gap-12 lg:flex mr-[570px]">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-600 flexCenter cursor-pointer 
            transition-all ease-in-out duration-500
            hover:text-gray-800 transform-gpu hover:scale-[1.07]"
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
