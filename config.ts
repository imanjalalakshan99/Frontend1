require("dotenv").config();
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined. Using development JWT_SECRET!");
}
const JWT_SECRET =
  process.env.JWT_SECRET ??
  "Ab98LK67JKlk98hGtYHg5TGFy78TgfD234WSDfGh56UjkL0976TFdS34EDrTgh";

export { JWT_SECRET };
