import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteExperience } from "./site-experience.functions";
import { DEFAULT_EXPERIENCE } from "./site-experience";
export function useSiteExperience() {
  const get = useServerFn(getSiteExperience);
  const query = useQuery({
    queryKey: ["site-experience"],
    queryFn: () => get(),
    staleTime: 15000,
    refetchInterval: 30000,
    retry: false,
  });
  return { ...query, settings: query.data?.settings || DEFAULT_EXPERIENCE };
}
