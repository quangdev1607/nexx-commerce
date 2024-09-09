import { useQuery } from "@tanstack/react-query";
import { getAllProvinces, getDistricts, getWards } from "./api";

export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
    refetchOnWindowFocus: false,
  });
};

export const useDistricts = (provinceId: string) => {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => getDistricts(provinceId),
    refetchOnWindowFocus: false,
    enabled: !!provinceId,
  });
};

export const useWards = (districtId: string) => {
  return useQuery({
    queryKey: ["districts", districtId],
    queryFn: () => getWards(districtId),
    refetchOnWindowFocus: false,
    enabled: !!districtId,
  });
};
