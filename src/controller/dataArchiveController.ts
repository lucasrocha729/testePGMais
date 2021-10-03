import { Request, Response } from "express";
import { Readable } from "stream";
import readLine from "readline";
import DataArchive from "../models/DataArchive";
import { validateDataFile } from "../utils/Validations";

const dataFile: DataArchive[] = [];

export async function uploadData(req: Request, res: Response) {
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
  validateDataFile(dataFile);

  return res.json(dataFile);
}
