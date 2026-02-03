import * as React from "react";
import { cn } from "@/lib/utils";

const Breadcrumb = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <nav className={cn("flex", className)} aria-label="breadcrumb" {...props} />
);

const BreadcrumbList = ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className={cn("flex flex-wrap items-center gap-2 text-sm text-muted-foreground", className)} {...props} />
);

const BreadcrumbItem = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("flex items-center gap-2", className)} {...props} />
);

const BreadcrumbLink = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={cn("hover:text-foreground", className)} {...props} />
);

const BreadcrumbSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("text-muted-foreground", className)} {...props}>
    /
  </span>
);

const BreadcrumbPage = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("font-medium text-foreground", className)} {...props} />
);

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage };
