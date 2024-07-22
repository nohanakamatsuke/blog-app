import { EXAMPLE_PATH } from "@/lib/constants";
import {FaInstagram, FaGithub} from "react-icons/fa6";
import Link from "next/link";

export function Footer() {
  return (
      <footer className="text-gray-600 body-font">
        <div className="py-8 mx-auto flex items-center sm:flex-row flex-col">
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2024 Nohana Kamatsuke</p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <Link href="https://www.instagram.com/fiorifleur_flor" className="ml-3 text-gray-500" target="_blank">
              <FaInstagram />
            </Link>
            <Link href="https://github.com/nohanakamatsuke" className="ml-3 text-gray-500" target="_blank">
              <FaGithub />
            </Link>
          </span>
        </div>
      </footer>
    
  );
}

export default Footer;
