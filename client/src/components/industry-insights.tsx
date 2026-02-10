import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: string;
  publishedAt: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const gradients = [
  "from-orange-500 to-rose-500",
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-violet-500",
];

export function IndustryInsights() {
  const { data: articles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const displayArticles = articles.slice(0, 4);

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-header mb-3">
            Industry Insights
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Latest developments in AI — fetched live from top tech publications
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayArticles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[i % 4]} items-center justify-center ${article.image ? "hidden" : "flex"}`}
                  >
                    <Newspaper className="h-10 w-10 text-white/30" />
                  </div>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {article.source}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      {timeAgo(article.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-primary transition-colors">
                      Read
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Newspaper className="h-8 w-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Unable to load latest news</p>
          </div>
        )}
      </div>
    </section>
  );
}
