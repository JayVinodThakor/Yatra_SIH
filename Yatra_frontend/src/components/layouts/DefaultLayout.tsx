import type { PropsWithChildren } from "react";
import App from "../../App";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DefaultLayout = ({ children }: PropsWithChildren) => {
  return (
    <App>
      <Navbar />
      <div className="relative pb-14 md:pb-0">{children}</div>
      <Footer />
    </App>
  );
};

export default DefaultLayout;