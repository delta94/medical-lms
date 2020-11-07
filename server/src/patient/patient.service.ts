import {Inject, Injectable, Scope, UnauthorizedException} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {PatientRepository} from "@/patient/patient.repository";
import {Patient} from "@/patient/patient.entity";
import {Role} from "@/user/user.entity";
import {QueryRequest} from "@/FilteredQueryRequest";
import {PaginatedList} from "@/PaginatedList";
import {PhysicalExamResults} from "@/physicalexamresults/physicalexamresults.entity";
import {PhysicalExamRegionRepository} from "@/physicalexamregions/physicalexamregion.repository";
import {PhysicalExamResultsRepository} from "@/physicalexamresults/physicalexamresults.repository";
import { Logger } from '@nestjs/common';


@Injectable({scope: Scope.REQUEST})
export class PatientService {
    constructor(

        private readonly patientRepository: PatientRepository,
        private readonly examRegionRepo: PhysicalExamRegionRepository,
        private readonly examResultsRepo: PhysicalExamResultsRepository,
        @Inject(REQUEST) private readonly request: any) {
    }




    async create(clientId: number, name: string, age: number, isFemale: boolean, description: string, height: number, weight: number, ethnicity: string): Promise<Patient> {
        this.authorise(clientId);
        let patient: Patient = {
            clientId: clientId,
            name: name,
            age: age,
            isFemale: isFemale,
            description: description,
            height: height,
            weight: weight,
            ethnicity: ethnicity
        };

        let result = await this.patientRepository.create(patient)

        let examRegions = await this.examRegionRepo.find();


        for (let i=0; i<examRegions.length; i++) {
            let examResult: PhysicalExamResults = {
                regionId: examRegions[i].id,
                clientId: clientId,
                patientId: result.id,
                result: examRegions[i].defaultValue,
                appropriate: true
            };
            await this.examResultsRepo.create(examResult);
        }

        return result;

    }

    async find(clientId: number, queryRequest: QueryRequest): Promise<PaginatedList<Patient>> {
        this.authorise(clientId);

        return await this.patientRepository.find(clientId, queryRequest);
    }

    async findById(clientId: number, id: number): Promise<Patient | null> {
        this.authoriseRead(clientId);
        return await this.patientRepository.findById(clientId, id);
    }

    async update(clientId: number, id: number, name: string, age: number, isFemale: boolean, description: string, height: number, weight: number, ethnicity: string): Promise<Patient> {
        this.authorise(clientId);
        let patient = await this.findById(clientId, id);
        patient.name = name;
        patient.age = age;
        patient.isFemale = isFemale;
        patient.description = description;
        patient.height = height;
        patient.weight = weight;
        patient.ethnicity = ethnicity;
        return await this.patientRepository.update(patient);
    }

    async delete(clientId: number, id: number): Promise<boolean> {
        this.authorise(clientId);
        return await this.patientRepository.delete(clientId, id);
    }


    authoriseRead(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch)
            throw new UnauthorizedException();
    }

    authorise(clientId: number): void {
        const clientMismatch = this.request.user.clientId !== clientId && this.request.user.role !== Role.Admin;

        if (clientMismatch || this.request.user.role < Role.SuperUser)
            throw new UnauthorizedException();
    }
}
