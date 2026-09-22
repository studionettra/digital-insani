<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        body { font-family: sans-serif; color: #333; line-height: 1.5; font-size: 14px; }
        .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .details { margin-bottom: 30px; }
        .details th { text-align: left; padding-right: 20px; }
        .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items th, .items td { border: 1px solid #ddd; padding: 10px; }
        .items th { background-color: #f8f9fa; }
        .items .text-right { text-align: right; }
        .total-row th, .total-row td { font-weight: bold; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 50px; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="invoice-title">INVOICE</h1>
        <p style="margin: 0;">Digital Insani</p>
    </div>

    <table class="details">
        <tr>
            <th>No. Invoice</th>
            <td>: {{ $order->order_number }}</td>
        </tr>
        <tr>
            <th>Tanggal</th>
            <td>: {{ $order->created_at->format('d M Y') }}</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>: <span style="text-transform: uppercase; font-weight: bold; color: {{ $order->status === 'paid' ? 'green' : 'red' }};">{{ $order->status }}</span></td>
        </tr>
        <tr>
            <th>Pelanggan</th>
            <td>: {{ $user->name }} ({{ $user->email }})</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Produk</th>
                <th class="text-right">Harga</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->title }}</td>
                <td class="text-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td class="text-right"><strong>Subtotal</strong></td>
                <td class="text-right">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</td>
            </tr>
            @if($order->discount_amount > 0)
            <tr>
                <td class="text-right"><strong>Diskon ({{ $order->coupon_code }})</strong></td>
                <td class="text-right">- Rp {{ number_format($order->discount_amount, 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td class="text-right">Total</td>
                <td class="text-right">Rp {{ number_format($order->total_amount, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        Terima kasih atas pembelian Anda!<br>
        Jika ada pertanyaan, hubungi kami di support@digitalinsani.com
    </div>

</body>
</html>
