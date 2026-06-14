import React from "react";

export function H1({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 suppressHydrationWarning {...props}>{children}</h1>;
}

export function H2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 suppressHydrationWarning {...props}>{children}</h2>;
}

export function H3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 suppressHydrationWarning {...props}>{children}</h3>;
}

export function H4({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 suppressHydrationWarning {...props}>{children}</h4>;
}

export function H5({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 suppressHydrationWarning {...props}>{children}</h5>;
}

export function H6({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h6 suppressHydrationWarning {...props}>{children}</h6>;
}
