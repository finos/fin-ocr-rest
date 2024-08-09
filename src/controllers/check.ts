/**
 * Copyright (c) 2024 Discover Financial Services
*/
import * as express from "express";
import { Body, Controller, Post, Route, Request } from "tsoa";
import * as ocr from "@discoverfinancial/fin-ocr-sdk";

@Route("/check")
export class CheckController extends Controller {

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
