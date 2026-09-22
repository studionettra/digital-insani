import { Form, Head } from '@inertiajs/react';
import { Turnstile } from '@marsidev/react-turnstile';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-zinc-700 dark:text-zinc-300">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                    className="bg-white/50 dark:bg-zinc-900/50"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex flex-col items-center mt-2 w-full overflow-hidden rounded-xl">
                                <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''} />
                                <InputError message={errors['cf-turnstile-response']} className="mt-2" />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full py-6 text-base"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-zinc-500 text-center text-sm mt-4">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4">
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
