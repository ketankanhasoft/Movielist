"use client";
import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";

// Movies Detail component
export default function Details({ params }: { params: { id: string } }) {
  const { status } = useSession();

  let localFav: string | null = localStorage.getItem("favouriteMoviesList");
  let [movieDetails, setMovieDetails] = useState<any>();
  let [err, setErr] = useState(false);

  let [favouriteMovieList, setFavouriteMovieList] = useState<any>(
    JSON.parse(localFav || "[]")
  );

  const fetchMovieData = async () => {
    let token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    let api_url = `https://api.themoviedb.org/3/movie/${params?.id}`;
    await fetch(api_url, {
      method: "get",
      headers: header,
    })
      .then(async (response) => {
        let moviesDetailList = await response.json();
        setMovieDetails(moviesDetailList);
      })
      .catch(function (err) {
        console.log("Error:" + err);
      });
  };

  useEffect(() => {
    fetchMovieData();
  }, [params]);

  // handle favourite click on star
  const handleFavourite = () => {
    if (status !== "authenticated") {
      setErr(true);
      return;
    }
    let parsedArr;

    if (favouriteMovieList !== null) {
      parsedArr = favouriteMovieList;
    } else {
      parsedArr = [];
    }

    let favMovieList = [...parsedArr];

    if (!parsedArr.includes(params?.id)) {
      favMovieList.push(params?.id);
    } else {
      let tempIndex = favMovieList.findIndex((item) => item === params?.id);
      favMovieList.splice(tempIndex, 1);
    }
    setFavouriteMovieList(favMovieList);
    localStorage.setItem("favouriteMoviesList", JSON.stringify(favMovieList));
  };

  // return component
  return (
    <div className=" max-w-full h-screen rounded overflow-hidden shadow-lg">
      <div className="max-w-sm w-full lg:max-w-full lg:flex h-full">
        <div
          className="h-48 lg:h-auto flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden w-[35%]"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails?.poster_path})`,
          }}
          title="Woman holding a mug"
        ></div>
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <button className="flex mb-4" onClick={() => handleFavourite()}>
              {favouriteMovieList.includes(params?.id) ? (
                <FaStar className="text-3xl" color={"#cc3300"} />
              ) : (
                <CiStar className="text-3xl" />
              )}
              {err && (
                <div className="ml-4 text-sm mt-1">
                  Please login to save this movie.
                </div>
              )}
            </button>
            <div className="text-gray-900 font-bold text-xl mb-2">
              {movieDetails?.title}
            </div>

            <div className="text-gray-900 font-bold text-sm mb-2">
              Popularity: {movieDetails?.popularity}%
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Released On: {movieDetails?.release_date}
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Genres:{" "}
              {movieDetails?.genres.map((val: any) => val.name).toString()}
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Production Companies:{" "}
              {movieDetails?.production_companies
                .map((val: any) => val.name)
                .toString()}
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Spoken Languages:{" "}
              {movieDetails?.spoken_languages
                .map((val: any) => val.name)
                .toString()}
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Vote Average: {movieDetails?.vote_average}
            </div>
            <p className="text-gray-700 text-base">{movieDetails?.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
