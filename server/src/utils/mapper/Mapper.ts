interface Mapper {
  mapFromIdToString: (id: number) => string;
  mapFromStringToId: (key: string) => number;
}

export default Mapper;
