import paseto from "paseto";

const secret = await paseto.V3.generateKey("local", { format: "paserk" });
console.log(secret);
