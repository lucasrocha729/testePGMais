import { Router, Request, Response } from "express";
import multer from "multer";
import { Readable } from "stream";
import readLine from "readline";
import DataArchive from "./models/DataArchive";
import https from "https";

const multerConfig = multer();

const router = Router();

const dataFile: DataArchive[] = [];
const regexPhoneNumber = new RegExp("^[1-9]{2}9[7-9]{1}[0-9]{3}[0-9]{4}$");
const regexHour = new RegExp("^[1]{1}$");

router.post(
  "/data",
  multerConfig.single("file"),
  async (req: Request, res: Response) => {
    const buffer = req.file?.buffer.toString();
    const readableFile = new Readable();

    readableFile.push(buffer);
    readableFile.push(null);

    const fileLine = readLine.createInterface({
      input: readableFile,
    });

    for await (let line of fileLine) {
      const fileSplit = line.split(";");
      dataFile.push({
        idMessage: fileSplit[0],
        ddd: fileSplit[1],
        phoneNumber: fileSplit[2],
        mobileOperator: fileSplit[3],
        shippingTime: fileSplit[4],
        message: fileSplit[5],
      });
    }

    dataFile
      .filter((f) => f.ddd !== "11")
      .filter(
        (f) =>
          regexPhoneNumber.test(`${f.ddd}${f.phoneNumber}`) &&
          regexHour.test(`${f.shippingTime.substr(0, 1)}`) &&
          f.message.length < 140
      )
      .filter((fl) => requestBlackList(fl) !== "404")
      .map((m) => console.log(m));

    return res.json(dataFile);
  }
);
function requestBlackList(blockedList: DataArchive): string {
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

export { router };
