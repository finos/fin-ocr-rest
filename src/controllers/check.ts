/**
 * Copyright (c) 2024 Capital One
*/
import * as express from "express";
import { Body, Controller, Post, Route, Request,FormField, UploadedFiles, UploadedFile } from "tsoa";
import * as ocr from "@finos/fin-ocr-sdk";
import multer from "multer";
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },// Optional: Limit file size to 10MB
});

@Route("/check")
export class CheckController extends Controller {

  @Post("scanFile")
   public async uploadFile(
     @UploadedFile() image: Express.Multer.File,
     @FormField() id?: string,
   ): Promise<ocr.CheckScanResponse> {
     const cm = await ocr.CheckMgr.getInstance();
     const base64Image = image.buffer.toString('base64');
       let csr: ocr.CheckScanRequest;
     csr = {
       id: id || "default-id",
       image: {
         format: image.mimetype.split('/')[1],
         buffer: base64Image
       }
     };
     console.log("csr " + csr.image.format)
      return await cm.scan(csr, {});
   }

  @Post("scan")
  public async scan(@Request() req: express.Request, @Body() csr: ocr.CheckScanRequest): Promise<ocr.CheckScanResponse> {
      const ctx = (req as any).ctx;
      const cm = await ocr.CheckMgr.getInstance();
      return await cm.scan(csr, {ctx});
  }

  @Post("preprocess")
  public async preprocess(@Request() req: express.Request, @Body() cpr: ocr.CheckPreprocessRequest): Promise<any> {
      const ctx = (req as any).ctx;
      const cm = await ocr.CheckMgr.getInstance();
      return await cm.preprocess(cpr, {ctx});
  }

}
