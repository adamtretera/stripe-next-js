import React from 'react';
import Link from "next/link"
function Navbar(props) {
    return (
        <nav className="h-20">
            <ul className="max-w-full h-full flex justify-center gap-8">
                <li className="flex items-center justify-center text-xl black font-bold">
                    <Link href={"/"}>Home</Link>
                </li>
                <li className="flex items-center justify-center text-xl text-black font-bold">
                    <Link href={"/checkout"}>Checkout</Link>
                </li>
                <li className="flex items-center justify-center text-xl text-black font-bold">
                    <Link href={"/payments"}>Payments</Link>
                </li>
                <li className="flex items-center justify-center text-xl text-black font-bold">
                    <Link href={"/subscriptions"}>Subscriptions</Link>
                </li>
            </ul>

        </nav>
    );
}

export default Navbar;