/**
 * Copyright (c) 2024 Discover Financial Services
*/
import { Controller, Get, Route } from "tsoa";

export interface HealthResponse {
   status: string;
}

@Route("/")
export class HealthController extends Controller {

  @Get("health")
  public health(): HealthResponse {
    return {
        status: "OK"
    }
  }

}
