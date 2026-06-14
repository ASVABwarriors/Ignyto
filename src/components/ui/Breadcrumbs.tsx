import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 mb-6 bg-white py-3 px-4 rounded-xl shadow-sm border border-gray-100">
      <Link href="/admin/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        Dashboard
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="mx-3 text-gray-300">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
