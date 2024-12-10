import React, { useEffect, useState } from "react";
import axios from "axios";

const WallpaperApp = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    // const UNSPLASH_ACCESS_KEY ='lhUq0Qfw9YbO7omOOdDAQlmbTQVnWhyteqpjDe4ZNIw';
    const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    const fetchWallpapers = async (query = "nature") => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos`,
                {
                    params: {
                        query,
                        per_page: 30,

                    },
                    headers: {
                        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                    },
                }
            );
            setWallpapers(response.data.results);
        } catch (error) {
            console.error("Error fetching wallpapers:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWallpapers(searchQuery);
    };

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "wallpaper.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchWallpapers();
    }, []);

    return (
        <div className=" bg-gradient-to-r from-yellow-500 to-orange-200 min-h-screen">
            <div className="flex gap-3 bg-white justify-between pe-0.5">
                <div className="flex gap-3 px-5 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-10 h-10 mt-1.5">

                    <circle cx="150" cy="150" r="140" fill="none" stroke="#2c3e50" strokeWidth="10" />

                    <text x="150" y="190"
                        fontFamily="Arial, sans-serif"
                        fontSize="100"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#2c3e50">
                        HDW
                    </text>
                </svg>
                <h1 className="text-xl font-bold text-center text-gray-800 mb-4 mt-3">
                    HD Wallpapers
                </h1>
                </div>
                <a href="https://github.com/Marikannan16" className="me-10 mt-3.5">
                <button className="">
                    <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" fill="none" viewBox="0 0 24 24" className="w-6 hover:scale-125 duration-200 hover:stroke-blue-500"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                </button>
                <span className="absolute -top-14 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">GitHub<span>
                </span></span>
                </a>


            </div> <br />

            <form onSubmit={handleSearch} className="flex justify-center mb-6 ">
                <div className="relative w-[700px]">
                    <input
                        type="text"
                        placeholder="Search for wallpapers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none "
                    />
                    <button
                        type="submit"
                        className="h-9 w-9 bg-blue-500 text-white  hover:bg-green-600 transition rounded-full absolute right-2 top-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>


                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex flex-row gap-2 mx-auto justify-center h-56 place-items-end">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:.7s]" />
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:.3s]" />
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:.7s]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wallpapers.map((wallpaper) => (
                        <div
                            key={wallpaper.id}
                            className="relative group bg-gray-100 rounded-lg shadow-md overflow-hidden"
                        >
                            <img
                                src={wallpaper.urls.small}
                                alt={wallpaper.alt_description}
                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <button
                                    onClick={() => handleDownload(wallpaper.links.download)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* <button type="button" onClick={()=>setPageper(pageper+10)} >load more</button> */}

        </div>
    );
};

export default WallpaperApp;
