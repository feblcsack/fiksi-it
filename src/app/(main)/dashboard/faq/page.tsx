import FAQPage from "@/components/faq-page";
import { Navbar } from "@/components/organisms/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="mt-10">
        <FAQPage />
      </div>
    </>
  );
}
