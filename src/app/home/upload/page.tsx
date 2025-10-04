import UploadCoverForm from "@/components/UploadCoverForm";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-lg w-full">
        <UploadCoverForm />
      </div>
    </main>
  );
}
