<?php

namespace App\Jobs;

use App\Mail\ProductUpdatedEmail;
use App\Models\ProductUpdate;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendProductUpdateNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ProductUpdate $update
    ) {}

    public function handle(): void
    {
        // Get all unique users who have an active entitlement for this product
        $users = User::whereHas('entitlements', function ($query) {
            $query->where('product_id', $this->update->product_id)
                ->whereNull('revoked_at');
        })->get();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new ProductUpdatedEmail($this->update, $user));
        }
    }
}
