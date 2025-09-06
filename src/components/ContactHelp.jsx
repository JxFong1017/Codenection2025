import Link from "next/link";
import { useT } from "../utils/i18n";

export default function ContactHelp() {
  const t = useT();
  const text = t("contact_us_help");
  const parts = text.split("{contact_us}");

  return (
    <p className="text-gray-700">
      {parts[0]}
      <Link
        href="/contact-us"
        className="underline text-blue-800 hover:text-blue-900"
      >
        {t("contact_us")}
      </Link>
      {parts[1]}
    </p>
  );
}
