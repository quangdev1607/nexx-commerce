"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push("/");
    }
  };

  return (
    <div className="my-4 flex flex-wrap items-center justify-center gap-4">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50",
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("yellow")}
        className={cn(
          "cursor-pointer bg-yellow-500 text-white hover:bg-yellow-400 hover:opacity-100",
          tag === "yellow" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Yellow
      </Badge>
      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer bg-blue-500 text-white hover:bg-blue-400 hover:opacity-100",
          tag === "blue" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter("pink")}
        className={cn(
          "cursor-pointer bg-pink-500 text-white hover:bg-pink-400 hover:opacity-100",
          tag === "pink" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Pink
      </Badge>
      <Badge
        onClick={() => setFilter("grey")}
        className={cn(
          "cursor-pointer bg-slate-500 text-white hover:bg-slate-400 hover:opacity-100",
          tag === "grey" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Grey
      </Badge>
      <Badge
        onClick={() => setFilter("black")}
        className={cn(
          "cursor-pointer bg-black text-white hover:bg-black/50 hover:opacity-100",
          tag === "black" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Black
      </Badge>
      <Badge
        onClick={() => setFilter("red")}
        className={cn(
          "cursor-pointer bg-red-500 hover:bg-red-600 hover:opacity-100",
          tag === "red" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Red
      </Badge>
      <Badge
        onClick={() => setFilter("purple")}
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100",
          tag === "purple" && tag ? "opacity-100" : "opacity-50",
        )}
      >
        Purple
      </Badge>
    </div>
  );
}
