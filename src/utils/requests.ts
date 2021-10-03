import DataArchive from "../models/DataArchive";
import https from "https";

export function requestBlackList(blockedList: DataArchive): string {
  try {
    https.get(
      `https://front-test-pg.herokuapp.com/blacklist/${blockedList.ddd}${blockedList.phoneNumber}`,
      (res) => {
        return res.statusCode!;
      }
    );
  } catch (error) {
    console.log(error);
  }
  return "";
}
