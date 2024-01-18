import {
    ExactInputParams,
    ExactInputSingleParams,
    ExactOutputParams,
    ExactOutputSingleParams,
} from "@blockchain"
import { QuoteType } from "../enums"

type ParamsScenario =
  | ExactInputSingleScenario
  | ExactInputScenario
  | ExactOutputSingleScenario
  | ExactOutputScenario;
  
export default ParamsScenario

interface ExactInputSingleScenario {
  quoteType: QuoteType.ExactInputSingle;
  params: ExactInputSingleParams;
}

interface ExactInputScenario {
  quoteType: QuoteType.ExactInput;
  params: ExactInputParams;
}

interface ExactOutputSingleScenario {
  quoteType: QuoteType.ExactOutputSingle;
  params: ExactOutputSingleParams;
}

interface ExactOutputScenario {
  quoteType: QuoteType.ExactOutput;
  params: ExactOutputParams;
}
