import FAQPage from "@/components/faq-page";
import { Navbar } from "@/components/organisms/Navbar";
import PulsingCircle from "@/components/pulsing-circle";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="fixed bottom-6 right-6 z-50">
        <PulsingCircle />
      </div>
      <div className="mt-10">
        <FAQPage />
      </div>
    </>
  );
}
