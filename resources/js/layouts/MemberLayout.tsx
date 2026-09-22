
import type { BreadcrumbItem } from '@/types';

export default function MemberLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    // Note: The global layout from app.tsx automatically wraps pages in AppLayout.
    // Returning just children here prevents the double-sidebar/double-layout issue.
    return <>{children}</>;
}
