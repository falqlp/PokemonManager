import ColorService, { TRAINER_COLORS } from "./ColorService";
import { container } from "tsyringe";

describe("ColorService", () => {
  let colorService: ColorService;

  beforeEach(() => {
    colorService = container.resolve(ColorService);
  });

  describe("getColorForTrainer method", () => {
    it("should return a valid color for a string ID", () => {
      const randomID = "randomID";
      const color = colorService.getColorForTrainer(randomID);
      expect(typeof color).toBe("string");
      expect(TRAINER_COLORS).toContain(color);
    });
  });
});
