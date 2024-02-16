"use client";
import Link from "next/link";

interface Props {
  id: number;
  title: string;
  overview: string;
  image: string;
  clickMovie: Function;
  popularity: number;
  releaseDate: string;
}

// Card Component
export default function Card(props: Props) {
  const { id, title, overview, image, clickMovie, popularity, releaseDate } =
    props;

  // handle click for open a detail view
  const handleClick = () => {
    clickMovie(id);
  };

  // return component
  return (
    <Link
    key={id}
      href={`/details/${id}`}
      onClick={() => handleClick()}
      className="  rounded overflow-hidden shadow-lg w-[calc(100%_/_3_-_14px)] max-w-full"
    >
      <div className=" w-full lg:max-w-full lg:flex h-[250px]">
        <div
          className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${image})`,
          }}
          title="Woman holding a mug"
        ></div>
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-lg mb-2">{title}</div>
            <div className="text-gray-900 font-bold text-sm mb-2">
              Popularity: {popularity}%
            </div>
            <div className="text-gray-900 font-bold text-xs mb-2">
              Released On: {releaseDate}
            </div>

            <p className="text-gray-700 text-xs">{overview}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
