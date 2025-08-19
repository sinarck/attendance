import jwt from "jsonwebtoken";
import z from "zod";
import { protectedProcedure, router } from "../lib/trpc";

const TOKEN_EXPIRATION_SECONDS = 60;

export const meetingRouter = router({
  generateToken: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const kioskId = process.env.KIOSK_ID || "kiosk_default";
      const payload = {
        meetingId: input.meetingId,
        kioskId,
        issuedAt: Math.floor(Date.now() / 1000),
        nonce: crypto.randomUUID(),
      };

      const token = jwt.sign(payload, process.env.QR_CODE_SECRET!, {
        algorithm: "HS256",
        expiresIn: TOKEN_EXPIRATION_SECONDS,
      });

      return { token };
    }),
});

