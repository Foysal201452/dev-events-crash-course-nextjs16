'use client';
import Link from "next/link"
import Image from "next/image"
import posthog from "posthog-js"

const Navbar =()=>{
    const handleLogoClick = () => {
        posthog.capture('nav_logo_clicked');
    };

    const handleNavLinkClick = (label: string) => {
        posthog.capture('nav_link_clicked', { label });
    };

    return(
        <header>
            <nav>
                <Link href='/'className="logo" onClick={handleLogoClick}>


                <Image src="/icons/logo.png" alt="logo" height={24} width={24}></Image>


                </Link>

                <ul>
                    <Link href="/" onClick={() => handleNavLinkClick('Home')}>Home</Link>
                    <Link href="/" onClick={() => handleNavLinkClick('Events')}>Events</Link>
                    <Link href="/" onClick={() => handleNavLinkClick('Create Event')}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )

}

export default Navbar;