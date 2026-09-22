<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pembayaran Berhasil untuk Pesanan {{ $order->order_number }}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Halo {{ $user->name }},</h2>
    
    <p>Hore! Pembayaran untuk pesanan Anda <strong>{{ $order->order_number }}</strong> telah berhasil diverifikasi.</p>
    
    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
        <h3 style="margin-top: 0; color: #166534;">Pembayaran Lunas</h3>
        <p style="margin: 5px 0;"><strong>Total Pembayaran:</strong> Rp {{ number_format($order->total_amount, 0, ',', '.') }}</p>
        <p style="margin: 5px 0;"><strong>Metode Pembayaran:</strong> Xendit</p>
    </div>

    <h3>Produk yang Anda Beli:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
            <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Produk</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Harga</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">{{ $item->product->title }}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p style="text-align: center; margin: 30px 0;">
        <a href="{{ route('checkout.status', ['order' => $order->id, 'token' => $order->access_token]) }}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Akses Produk Anda
        </a>
    </p>

    @if(isset($user->is_guest) && $user->is_guest)
    <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fef3c7;">
        <h3 style="margin-top: 0; color: #b45309;">Buat Akun untuk Menyimpan Pesanan</h3>
        <p style="margin: 5px 0;">Pesanan ini belum tersimpan di akun manapun. Buat akun menggunakan email <strong>{{ $user->email }}</strong> untuk menyimpan pesanan ini secara permanen agar Anda bisa mendownloadnya kapan saja.</p>
        <p style="text-align: center; margin: 20px 0 10px;">
            <a href="{{ url('/register') }}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Buat Akun Sekarang</a>
        </p>
    </div>
    @endif

    <p>Atau Anda juga dapat mengunduh Invoice (PDF) yang kami lampirkan pada email ini.</p>
    
    <p>Terima kasih telah berbelanja di Digital Insani!<br>Tim Digital Insani</p>
</body>
</html>
