import Agenda from "agenda";
import { Config } from "../config/config.js";


export const agenda = new Agenda({db : {address : Config.MONGO_URI}})
