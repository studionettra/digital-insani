import { useState, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Star, Trash2, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AdminLayout from '@/layouts/AdminLayout';
import StarRating from '@/components/StarRating';

type Review = {
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    is_verified_buyer: boolean;
    created_at: string;
    product?: {
        id: number;
        title: string;
        slug: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

type Props = {
    reviews: {
        data: Review[];
        links: any[];
        total: number;
    };
    filters: {
        search?: string;
        rating?: string;
    };
};

export default function ReviewsIndex({ reviews, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRating, setSelectedRating] = useState(filters.rating || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/reviews', {
            search: search.trim() || undefined,
            rating: selectedRating || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleFilterRating = (ratingValue: string) => {
        setSelectedRating(ratingValue);
        router.get('/admin/reviews', {
            search: search.trim() || undefined,
            rating: ratingValue || undefined,
        }, {
            preserveState: true,
        });
    };

    const handleToggle = (id: number) => {
        router.patch(`/admin/reviews/${id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus ulasan ini secara permanen?')) {
            router.delete(`/admin/reviews/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Ulasan Produk | Admin" />
            <AppSidebarHeader
                breadcrumbs={[
                    { title: 'Admin Dashboard', href: '/admin/dashboard' },
                    { title: 'Ulasan Produk', href: '#' },
                ]}
            />

            <div className="flex h-full flex-1 flex-col gap-8 p-6 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                            Ulasan Produk
                        </h1>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">
                            Moderasi rating dan ulasan yang dikirimkan oleh pembeli terverifikasi.
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari pembeli, komentar, atau produk..."
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                    </form>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        <button
                            type="button"
                            onClick={() => handleFilterRating('')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                !selectedRating
                                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                            }`}
                        >
                            Semua Bintang
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleFilterRating(String(star))}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                    selectedRating === String(star)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                                }`}
                            >
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {star}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bento-card border-none ring-1 ring-border shadow-xs flex flex-col min-h-0 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4 border-b border-border">Pembeli</th>
                                    <th className="px-6 py-4 border-b border-border">Produk</th>
                                    <th className="px-6 py-4 border-b border-border">Rating</th>
                                    <th className="px-6 py-4 border-b border-border">Ulasan</th>
                                    <th className="px-6 py-4 border-b border-border text-center">Status</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {reviews.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                                            <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                                Tidak ada ulasan ditemukan
                                            </p>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                Ulasan dari pembeli akan muncul di sini secara otomatis.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.data.map((review) => (
                                        <tr key={review.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{review.customer_name}</span>
                                                    {review.is_verified_buyer && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Pembeli Terverifikasi
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {review.product ? (
                                                    <Link
                                                        href={`/products/${review.product.slug}`}
                                                        className="text-blue-600 dark:text-blue-400 hover:underline max-w-xs truncate block"
                                                    >
                                                        {review.product.title}
                                                    </Link>
                                                ) : (
                                                    <span className="text-zinc-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StarRating rating={review.rating} size="sm" />
                                            </td>
                                            <td className="px-6 py-4 max-w-sm whitespace-normal">
                                                <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2">
                                                    {review.comment}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(review.id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                        review.is_approved
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200'
                                                    }`}
                                                >
                                                    {review.is_approved ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Disetujui
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Ditangguhkan
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    title="Hapus Ulasan"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
