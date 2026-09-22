<?php

namespace App\Providers;

use App\Listeners\LinkGuestOrdersToUser;
use Carbon\CarbonImmutable;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Auth\Events\Registered;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use League\Flysystem\Filesystem;
use Masbug\Flysystem\GoogleDriveAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(
            Registered::class,
            LinkGuestOrdersToUser::class
        );

        $this->configureDefaults();

        Storage::extend('google', function ($app, $config) {
            $client = new Client;

            // Set service account credentials
            $client->setAuthConfig(base_path('google-credentials.json'));
            $client->addScope(Drive::DRIVE);

            $service = new Drive($client);

            $options = [];
            if (isset($config['teamDriveId'])) {
                $options['teamDriveId'] = $config['teamDriveId'];
            }

            $adapter = new GoogleDriveAdapter($service, $config['folder'] ?? '/', $options);

            return new FilesystemAdapter(
                new Filesystem($adapter),
                $adapter,
                $config
            );
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
