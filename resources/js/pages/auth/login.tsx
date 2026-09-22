import { Form, Head } from '@inertiajs/react';
import { Turnstile } from '@marsidev/react-turnstile';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 mt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-[4px] border-zinc-300 dark:border-zinc-700"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-zinc-600 dark:text-zinc-400 cursor-pointer">Remember me</Label>
                            </div>

                            <div className="flex flex-col items-center mt-2 w-full overflow-hidden rounded-xl">
                                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''} />
                                <InputError message={errors['cf-turnstile-response']} className="mt-2" />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full py-6 text-base"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-zinc-500 text-center text-sm mt-4">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4">
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
