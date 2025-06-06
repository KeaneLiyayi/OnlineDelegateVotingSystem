"use client"


import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            redirect: false,
            callbackUrl: "/admin/verifyOtp", // redirect after login
            identifier: email,
            password,

        });
        if  (res?.ok){
            toast.success("Logged in! Redirecting...")
            window.location.href = res?.url || "/admin/verifyOtp"
        }else{
            toast.error("Invalid registration number or password")
        }





    }
    return (
        <div className="container px-4 mx-auto">
            <div className="max-w-lg mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold">Sign in</h2>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block mb-2 font-extrabold" htmlFor="email">Registration No</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                            className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"

                            id="email"
                            placeholder="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-extrabold" htmlFor="password">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)}
                            className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
                            type="password"
                            id="password"
                            placeholder="**********"
                        />
                    </div>
                    <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
                        <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
                            <label htmlFor="remember">
                                <input type="checkbox" id="remember" />
                                <span className="ml-1 font-extrabold">Remember me</span>
                            </label>
                        </div>
                        <div className="w-full lg:w-auto px-4">
                            <a className="inline-block font-extrabold hover:underline" href="#">Forgot your password?</a>
                        </div>
                    </div>
                    <button type="submit" className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow rounded transition duration-200">
                        Sign in
                    </button>
                    <p className="text-center font-extrabold">
                        Don’t have an account?{" "}
                        <a className="text-red-500 hover:underline" href="#">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
