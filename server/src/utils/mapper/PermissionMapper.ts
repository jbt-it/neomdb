import Mapper from "./Mapper";

// Is this even necessary???
class PermissionMapper implements Mapper {
  mapFromIdToString = () => {
    return "Test";
  };
  mapFromStringToId = () => {
    return 0;
  };
}

export default PermissionMapper;
