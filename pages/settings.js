
import Head from "next/head";
import Link from "next/link";
import { useT } from "../src/utils/i18n";

export default function Settings() {
  const t = useT();

  return (
    <>
      <Head>
        <title>{t("settings")} - CGS Insurance</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <a className="text-4xl font-extrabold text-[#004F9E] ml-1">CGS</a>
                </Link>
              </div>
              <Link href="/profile">
                <a className="text-blue-600 hover:underline">{t("back_to_profile")}</a>
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4">{t("settings")}</h1>
          {/* Add content for Settings page here */}
        </main>
      </div>
    </>
  );
}
