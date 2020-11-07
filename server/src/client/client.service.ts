import {Inject, Injectable, Scope, UnauthorizedException} from '@nestjs/common';
import {ClientRepository} from "./client.repository";
import {Client} from "./client.entity";
import {REQUEST} from "@nestjs/core";
import {Role} from "@/user/user.entity";
import {GroupRepository} from "@/group/group.repository";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";

@Injectable({scope: Scope.REQUEST})
export class ClientService {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly groupRepository: GroupRepository,
        @Inject(REQUEST) private readonly request: any) {
    }

    async create(name: string, disabled: boolean, subdomain: string, logo: string = ""): Promise<Client> {
        this.authorise();

        let client: Client = {
            name: name,
            disabled: disabled,
            subdomain: subdomain,
            logo: logo
        };

        //TODO Look into transactions in pg-promise
        let result = await this.clientRepository.create(client);

        await this.groupRepository.create({
            clientId: result.id,
            name: "Everyone",
            isEveryone: true
        });

        return result;
    }

    async find(queryRequest: QueryRequest): Promise<PaginatedList<Client>> {
        this.authorise();

        return await this.clientRepository.find(queryRequest);
    }

    async findById(id: number): Promise<Client> {
        //Do not authorise
        return await this.clientRepository.findById(id);
    }

    async update(id: number, name: string, disabled: boolean, subdomain: string, logo: string | null): Promise<Client> {
        this.authorise(id);

        let client = await this.findById(id);
        client.name = name;
        client.disabled = disabled;
        client.subdomain = subdomain;
        client.logo = logo;
        return await this.clientRepository.update(client);
    }

    async delete(id: number): Promise<boolean> {
        this.authorise();

        return await this.clientRepository.delete(id);
    }

    authorise(clientId: number = 0): void {
        if (clientId === 0) {
            if (this.request.user.role !== Role.Admin)
                throw new UnauthorizedException();
        } else {
            const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

            if (clientMismatch || this.request.user.role < Role.SuperUser)
                throw new UnauthorizedException();
        }
    }
}
