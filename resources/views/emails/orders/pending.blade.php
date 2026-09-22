<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Menunggu Pembayaran Pesanan {{ $order->order_number }}</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Halo {{ $user->name }},</h2>
    
    <p>Terima kasih telah memesan di Digital Insani. Pesanan Anda dengan nomor <strong>{{ $order->order_number }}</strong> sedang menunggu pembayaran.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Detail Pembayaran</h3>
        <p style="margin: 5px 0;"><strong>Total Pembayaran:</strong> Rp {{ number_format($order->total_amount, 0, ',', '.') }}</p>
    </div>

    @if($order->payment_url)
    <p style="text-align: center; margin: 30px 0;">
        <a href="{{ $order->payment_url }}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Bayar Sekarang
        </a>
    </p>
    @endif

    <p>Harap segera menyelesaikan pembayaran agar pesanan Anda dapat kami proses. Jika Anda sudah melakukan pembayaran, harap abaikan email ini.</p>
    
    <p>Terima kasih,<br>Tim Digital Insani</p>
</body>
</html>
