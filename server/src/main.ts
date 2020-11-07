import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as bodyParser from "body-parser";
import "./polyfill";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(bodyParser.json({limit: "5mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
    await app.listen(process.env.SERVER_PORT ?? 4000);
}

bootstrap();
