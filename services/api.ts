import { Districts, Provinces, Wards } from "@/types/location";
import axios from "axios";

export const getAllProvinces = async () => {
  const { data } = await axios.get<Provinces>("/api/province");
  return data;
};

export const getDistricts = async (provinceId: string) => {
  const { data } = await axios.get<Districts>(`/api/districts/${provinceId}`);
  return data;
};
export const getWards = async (districtId: string) => {
  const { data } = await axios.get<Wards>(`/api/wards/${districtId}`);
  return data;
};
