import express from "express";
import { container } from "tsyringe";
import { MailService } from "../../application/mail/MailService";

const router = express.Router();

const mailService = container.resolve(MailService);
router.post("/contact-us", async (req, res, next) => {
  try {
    mailService.contactUs(req.body.subject, req.body.details, req.body.userId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

export default router;
