import DataArchive from "../models/DataArchive";
import { requestBlackList } from "./requests";

const regexPhoneNumber = new RegExp("^[1-9]{2}9[7-9]{1}[0-9]{3}[0-9]{4}$");
const regexHour = new RegExp("^[1]{1}$");

export function validateDataFile(dataFile: DataArchive[]) {
  const dataFileValidated = dataFile
    .filter(
      (data) =>
        data.ddd !== "11" && //Remove estado de SP
        regexPhoneNumber.test(`${data.ddd}${data.phoneNumber}`) && // Válida se o número esta no formato correto
        regexHour.test(`${data.shippingTime.substr(0, 1)}`) && //Válida horário
        data.message.length < 140 //Válida tamanho da mensagem
    )
    .filter((fl) => requestBlackList(fl) !== "404");
  showValidMessages(dataFileValidated);
}

async function showValidMessages(validMessages: DataArchive[]) {
  for await (let element of validMessages) {
    if (
      element.mobileOperator.toUpperCase() === "VIVO" ||
      element.mobileOperator.toUpperCase() === "TIM"
    ) {
      element.idBroker = "1";
    } else if (
      element.mobileOperator.toUpperCase() === "CLARO" ||
      element.mobileOperator.toUpperCase() === "OI"
    ) {
      element.idBroker = "2";
    } else {
      element.idBroker = "3";
    }

    console.log(`${element.idMessage};${element.idBroker}`);
  }
}
