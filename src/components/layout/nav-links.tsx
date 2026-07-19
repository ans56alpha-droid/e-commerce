import Link from "next/link";
import { navigation } from "@/constants/navigation";

export default function NavLinks() {
  return (
    <ul className="flex items-center gap-6">
      {navigation.map((item) => (
        <li key={item.label}>
          <Link href={item.href} className="transition-colors duration-200 hover:text-blue-600">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
