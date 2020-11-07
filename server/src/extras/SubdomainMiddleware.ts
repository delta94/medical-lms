import {Injectable, NestMiddleware} from "@nestjs/common";
import {ClientRepository} from "@/client/client.repository";

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
    constructor(private readonly clientRepository: ClientRepository) {
    }

    use(req: Request, res: Response, next: Function) {
        const host = req.headers["x-forwarded-host"];
        if (host) {
            const splitHost = host.split(".");
            let subdomain = "";

            if (splitHost.length > 1) {
                subdomain = splitHost[0];
            } else {
                if (process.env.NODE_ENV === "development") {
                    subdomain = "cardiff";
                }
            }

            this.clientRepository.findBySubdomain(subdomain)
                .then(client => {
                    req["clientId"] = client.id;
                    next();
                })
                .catch(err => {
                    console.warn(err);
                    next();
                });
        } else {
            next();
        }
    }
}