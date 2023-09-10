import CompleteService from "../CompleteService";
import Party, { IParty } from "./party";
import PartyMapper from "./party.mapper";

class PartyService extends CompleteService<IParty> {
  private static instance: PartyService;
  public static getInstance(): PartyService {
    if (!PartyService.instance) {
      PartyService.instance = new PartyService(
        Party,
        PartyMapper.getInstance()
      );
    }
    return PartyService.instance;
  }
}

export default PartyService;
