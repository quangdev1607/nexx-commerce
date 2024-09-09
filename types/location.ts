export type Provinces = {
  results: [
    {
      province_id: string;
      province_name: string;
      province_type?: string;
    },
  ];
};

export type Districts = {
  results: [
    {
      district_id: string;
      district_name: string;
      district_type?: string;
      lat?: string;
      lng?: string;
      province_id: string;
    },
  ];
};

export type Wards = {
  results: [
    {
      district_id: string;
      ward_id: string;
      ward_name: string;
      ward_type?: string;
    },
  ];
};
