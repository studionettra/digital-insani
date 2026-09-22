import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageHeader } from '@/components/page-header';
import admin from '@/routes/admin';

export default function MembersIndex({ members }: { members: any }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
            router.delete(`/admin/members/${id}`);
        }
    };

    const breadcrumbs = [
        { title: 'Admin Dashboard', href: admin.dashboard() },
        { title: 'Data Member', href: admin.members.index() },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Member | Admin" />

            <PageHeader
                title="Daftar Member"
                description="Lihat dan kelola seluruh pengguna di platform Anda."
            >
                <Link
                    href="/admin/members/create"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
                >
                    <Plus className="size-4" />
                    Tambah Member
                </Link>
            </PageHeader>

            <div className="rounded-2xl border border-border/70 bg-white dark:bg-zinc-900/80 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                                <tr>
                                    <th className="px-6 py-5 border-b border-border">Nama</th>
                                    <th className="px-6 py-5 border-b border-border">Email</th>
                                    <th className="px-6 py-5 border-b border-border">Bergabung</th>
                                    <th className="px-6 py-5 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {members.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                </div>
                                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada member</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    members.data.map((member: any) => (
                                        <tr key={member.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-zinc-600 dark:text-zinc-400">{member.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                    {new Date(member.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/members/${member.id}/edit`}
                                                        className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(member.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Minimalist Pagination */}
                    {members.links && members.links.length > 3 && (
                        <div className="border-t border-border bg-zinc-50/30 dark:bg-zinc-900/30 p-4">
                            <div className="flex items-center justify-center gap-1 text-sm font-medium">
                                {members.links.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3.5 py-2 rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : link.url
                                                ? 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
        </AdminLayout>
    );
}
