"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../_components/card";
import { useSession } from "next-auth/react";
import Topbar from "../_components/topbar";
import { LuLoader2 } from "react-icons/lu";

interface Movies {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  popularity: number;
}

interface IdData {
  id: number;
}

// Movies component
export default function Movies() {
  const { status } = useSession();
  const [idList, setIdList] = useState([]);
  const [movieList, setMovieList] = useState<Movies[]>([]);
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  const router = useRouter();

  // fetch data from api to get movies
  const fetchData = async (currentPage: number) => {
    setLoader(true);

    let token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    await fetch(
      `https://api.themoviedb.org/3/movie/changes?page=${currentPage}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
      .then(async function (response) {
        let moviesList = await response.json();
        let result = moviesList?.results;
        setIdList(result);
        localStorage.setItem("movieIDList", JSON.stringify(result));
        return result;
      })
      .catch(function (err) {
        console.log("Error:" + err);
      });
  };

  // fetch movie details data like photo description
  const fetchMovieData = async () => {
    let token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    const promises = idList.map((data: IdData) =>
      fetch(`https://api.themoviedb.org/3/movie/${data?.id}`, {
        method: "get",
        headers: header,
      })
    );

    Promise.all(promises)
      .then((resp) => Promise.all(resp.map((r) => r.json())))
      .then((result: any) => {
        setLoader(false);
        setMovieList([...movieList, ...result]);
      });
  };

  useEffect(() => {
    fetchData(page);
  }, []);

  useEffect(() => {
    if (idList?.length > 0) {
      fetchMovieData();
    }
  }, [idList]);

  // handle movie click details
  const handleMovieClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  // handle search and search api
  const handleSearch = async (searchTxt: string) => {
    if (searchTxt === "") {
      setPage(1);
      fetchData(1);
      return;
    }
    setLoader(true);

    let token = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchTxt}&include_adult=false&language=en-US&page=1`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
      .then(async function (response) {
        let searchMovieList = await response.json();
        let result = searchMovieList?.results;
        setMovieList(result);
        setPage(1);
        setLoader(false);
      })
      .catch(function (err) {
        setLoader(false);
        console.log("Error:" + err);
      });
  };

  // get next page data
  const handleLoadMore = () => {
    setPage(page + 1);
    fetchData(page + 1);
  };

  const showFavData = (value: boolean) => {
    setShowSaved(value);
    let tempList = localStorage.getItem("favouriteMoviesList");
    let idList = JSON.parse(tempList || "");
    setMovieList([]);
    setLoader(true);
    if (value && idList && idList.length > 0) {
      setIdList(
        idList.map((val: string) => ({
          id: val,
        }))
      );
    } else {
      setPage(1);
      fetchData(1);
    }
  };

  // return components
  return (
    <div className="w-screen px-4">
      <Topbar
        showLogout={status === "authenticated"}
        handleSearch={handleSearch}
      />
      <div className="container">
        <input
          type="checkbox"
          onChange={(e) => showFavData(e.target.checked)}
          className="mr-4 mb-4"
        />
        Show My favourite Movies
        {loader && (
          <div className=" w-full fixed ml-[50%] justify-center text-[64px]">
            <LuLoader2 className="animate-spin" />
          </div>
        )}
        <div className="cardLists flex flex-wrap w-full gap-5">
          {movieList &&
            movieList?.map((data: Movies) => (
              <Card
                key={data?.id}
                id={data?.id}
                title={data?.title}
                overview={data?.overview}
                clickMovie={handleMovieClick}
                image={data?.poster_path}
                releaseDate={data?.release_date}
                popularity={data?.popularity}
              />
            ))}
        </div>
        {!showSaved && !loader && movieList.length > 0 && (
          <button
            className="my-4 ml-[45%] bg-slate-400 p-2"
            onClick={() => handleLoadMore()}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
