'use client';
import Image from "next/image";
const ExploreBtn = () => {
    return(

       <button type="button" id="explore-btn" className="mt-7 mx-auto flex items-center justify-center gap-2 w-fit max-sm:w-1/2 px-8 py-3.5 rounded-full text-center"> 
       
       <a href="#events">
        Explore Events 
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}></Image>
       </a>
       
       
       </button>
    )
}
export default ExploreBtn;