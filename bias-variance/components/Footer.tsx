import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
      <footer className="flexCenter mb-24 mt-5 padding-container max-container">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <h4 className="font-bold">Contact Me</h4>
            <p className="mb-2 flex items-center gap-1">Email: 
            <Link href='mailto:03mocl@gmail.com'>
              <span>03mocl@gmail.com</span>
            </Link>
            </p>
            <h4 className="font-bold">Socials</h4>
            <Link href='https://www.instagram.com/3mocl/' className="flex items-center gap-2">
              <Image src='/instagram.svg' alt="instagram" width={22} height={22}/>
              <span>Instagram</span>
            </Link>
            <Link href='https://www.linkedin.com/in/3mocl/' className="flex items-center gap-2">
              <Image src='/linkedin.svg' alt="linkedin" width={24} height={24}/>
              <span>LinkedIn</span>
            </Link>
          </div>
          <div className="border bg-gray-20" />
          <p className="regular-14 w-full text-center text-gray-30">
           © 2024 Bias-Variance Playground | All Rights Reserved
          </p>
        </div>
      </footer>
    );
  };

export default Footer;
