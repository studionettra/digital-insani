import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';

const STORAGE_KEY = 'di_guest_wishlist_ids_v1';

export function useWishlist() {
    const { auth } = usePage<any>().props;
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (auth?.user) {
            // Fetch from backend for logged in user
            axios.get('/wishlist/ids')
                .then(res => {
                    if (res.data?.ids) {
                        const dbIds = res.data.ids.map(Number);
                        setWishlistIds(dbIds);

                        // Check if guest has stored IDs to sync
                        const saved = localStorage.getItem(STORAGE_KEY);
                        if (saved) {
                            try {
                                const guestIds = JSON.parse(saved);
                                if (Array.isArray(guestIds) && guestIds.length > 0) {
                                    axios.post('/wishlist/sync', { ids: guestIds })
                                        .then(() => {
                                            localStorage.removeItem(STORAGE_KEY);
                                            axios.get('/wishlist/ids').then(r => setWishlistIds(r.data.ids.map(Number)));
                                        })
                                        .catch(() => {});
                                } else {
                                    localStorage.removeItem(STORAGE_KEY);
                                }
                            } catch (e) {
                                localStorage.removeItem(STORAGE_KEY);
                            }
                        }
                    }
                })
                .catch(() => {});
        } else {
            // Guest mode: load from localStorage
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setWishlistIds(JSON.parse(saved).map(Number));
                }
            } catch (e) {
                setWishlistIds([]);
            }
        }
    }, [auth?.user]);

    const isWishlisted = (productId: number) => {
        return wishlistIds.includes(Number(productId));
    };

    const toggleWishlist = async (productId: number, title?: string) => {
        const id = Number(productId);
        const willAdd = !wishlistIds.includes(id);

        if (auth?.user) {
            setLoading(true);
            try {
                const res = await axios.post(`/wishlist/toggle/${id}`);
                if (res.data?.in_wishlist) {
                    setWishlistIds(prev => [...prev, id]);
                    toast.success(title ? `"${title}" disimpan ke wishlist.` : 'Produk disimpan ke wishlist.');
                } else {
                    setWishlistIds(prev => prev.filter(i => i !== id));
                    toast.info(title ? `"${title}" dihapus dari wishlist.` : 'Produk dihapus dari wishlist.');
                }
            } catch (err: any) {
                toast.error('Gagal memperbarui wishlist.');
            } finally {
                setLoading(false);
            }
        } else {
            // Guest mode
            let nextIds: number[];
            if (willAdd) {
                nextIds = [...wishlistIds, id];
                toast.success(title ? `"${title}" disimpan ke wishlist.` : 'Produk disimpan ke wishlist.');
            } else {
                nextIds = wishlistIds.filter(i => i !== id);
                toast.info(title ? `"${title}" dihapus dari wishlist.` : 'Produk dihapus dari wishlist.');
            }
            setWishlistIds(nextIds);
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
            }
        }
    };

    return {
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isWishlisted,
        toggleWishlist,
        loading,
    };
}
