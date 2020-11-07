import {Injectable} from "@nestjs/common";
import {PasswordHasher} from "@/account/auth/password-hasher";
import {Role} from "@/user/user.entity";
import {Seed} from "@/database/seed";

@Injectable()
export class ProdSeed extends Seed {
    async execute(): Promise<void> {
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Chest", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue: "Normal Appearances" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Testicular", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue: "No palpable mass" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Breast", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue: "Observation: No skin or nipple changes, Palpation: No breast or axillary mass." });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Respiratory", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"Observation: No chest wall deformity, Palpation: Symmetrical expansion, Percussion: Resonant, Auscultation: Clear bilaterally, Peripheral stigmata: None"});
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Cardiac", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"Observations: No surgical scars or pacemaker, Palpation: No heaves or thrills, Auscultation: HS I+II+0" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Abdomen", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"Observations: No scarring or distention, Palpation: Soft, non-tender, Percussion: Normal, Auscultation: Normal bowel sounds" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Neurological - Central and Peripheral", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"Observations: Symmetrical appearances, Tone: Normal, Power: Upper limbs 5/5, Lower limbs 5/5, Reflexex: Intact, Co-ordination: Normal, Sensation: Normal" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Neurological - Cranial Nerves", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"CN I to XII intact" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Vascular - Arterial and Venous", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"Observations: Normal appearances, Palpation: Warm. Normal palpable pulses, Auscultation: No bruits, Special tests: Normal" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Musculoskeletal - Shoulder ", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"No tenderness. Normal ROM" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Musculoskeletal - Knee ", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"No tenderness. Normal ROM" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Musculoskeletal - Hip ", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"No tenderness. Normal ROM" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Musculoskeletal - Ankle and Foot ", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:"No tenderness. Normal ROM" });
        await this.db.query("INSERT INTO physical_exam_regions(name, female_sensitive, male_sensitive, deleted, default_value) VALUES($(name), $(female_sensitive), $(male_sensitive), $(deleted), $(defaultValue))", { name: "Musculoskeletal - Hand and Wrist ", female_sensitive: false, male_sensitive: false, deleted: false, defaultValue:" No tenderness. Normal ROM" });


        const openId = (await this.db.one("INSERT INTO clients(name, subdomain) VALUES($(name), $(subdomain)) RETURNING id;", {
            name: "The Open University",
            subdomain: "openuni"
        })).id;
        const adminId = (await this.db.one("INSERT INTO users(client_id, name, email, role) VALUES($(clientId), $(name), $(email), $(role)) RETURNING id;", {
            name: "Admin User",
            clientId: openId,
            email: "admin@example.com",
            role: Role.Admin
        })).id;
        const superUserId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {
            name: "Super User",
            clientId: openId,
            email: "super@example.com",
            role: Role.SuperUser
        })).id;
        const standardId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {
            name: "Standard User",
            clientId: openId,
            email: "standard@example.com",
            role: Role.Standard
        })).id;
        const password = await PasswordHasher.hash("Password123");
        await this.db.none("INSERT INTO password_auth(user_id, password_hash) VALUES($(adminId), $(hashedPassword)), ($(superUserId), $(hashedPassword)), ($(standardId), $(hashedPassword));", {
            adminId: adminId,
            superUserId: superUserId,
            standardId: standardId,
            hashedPassword: password
        });
        const cardiffEveryoneId = (await this.db.one("INSERT INTO groups(client_id, name, is_everyone) VALUES($(clientId), $(name), true) RETURNING id;", {
            clientId: openId,
            name: "Everyone"
        })).id;
        await this.db.none("INSERT INTO group_members(group_id, user_id) VALUES($(groupId), $(adminId)), ($(groupId), $(superUserId)), ($(groupId), $(standardId));", {
            groupId: cardiffEveryoneId,
            adminId,
            superUserId,
            standardId
        });

        const patientId = (await this.db.one("INSERT INTO patients(client_id, name, age, is_female, description, height, weight) VALUES($(clientId), $(name), $(age), $(isFemale), $(description), $(height), $(weight)) RETURNING id;", {
            clientId: openId,
            name: "Dorothy Jenkins",
            description: "Had a fall",
            age: 70,
            isFemale: true,
            height: 1.65,
            weight: 60
        })).id;
        const scenarioId = (await this.db.one("INSERT INTO scenarios(client_id, name, description, active) VALUES($(clientId), $(name), $(description), $(active)) RETURNING id;", {
            clientId: openId,
            name: "Elderly Lady",
            description: "An old lady has fallen",
            active: false
        })).id;
        const clerking = await this.db.query("INSERT INTO patient_clerking_info(client_id, patient_id, current_complaint_history, medical_history, smoking_status, alcohol_consumption, performance_status, adl, drug_history, allergies, family_history, systemic_review) VALUES($(client_id), $(patient_id), $(current_complaint_history), $(medical_history), $(smoking_status), $(alcohol_consumption), $(performance_status), $(adl), $(drug_history), $(allergies), $(family_history), $(systemic_review));",{
            client_id: openId, patient_id: patientId, current_complaint_history: "Had a witness fall whilst walking to the shop", medical_history: "Type 2 Diabetes, Hypertension", smoking_status: true, alcohol_consumption: 0, performance_status: "1", adl:"Fully Independent", drug_history:"Metformin 1g (twice a day), Ramipril 2.5mg (once a day)", allergies: "Penicillin", family_history: "Stroke", systemic_review: "She has some breathlessness on exertion and occasional indigestion"
        });
        const pe1 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 1, result: "No Problems", appropriate: true})).id;
        const pe2 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 2, result: "No Problems", appropriate: true})).id;
        const pe3 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 3, result: "No Problems", appropriate: true})).id;
        const pe4 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 4, result: "No Problems", appropriate: true})).id;
        const pe5 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 5, result: "No Problems", appropriate: true})).id;
        const pe6 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 6, result: "No Problems", appropriate: true})).id;
        const pe7 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 7, result: "No Problems", appropriate: true})).id;
        const pe8 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 8, result: "No Problems", appropriate: true})).id;
        const pe9 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 9, result: "No Problems", appropriate: true})).id;
        const pe10 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 10, result: "No Problems", appropriate: true})).id;
        const pe11 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 11, result: "No Problems", appropriate: true})).id;
        const pe12 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 12, result: "Painful hip palpatation with limited movement", appropriate: true})).id;
        const pe13 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 13, result: "No Problems", appropriate: true})).id;
        const pe14 = (await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: openId, patient_id: patientId, region_id: 14, result: "Tender Wrist", appropriate: true})).id;
        const clientOrgId = (await this.db.one("INSERT INTO clients(name, subdomain) VALUES($(name), $(subdomain)) RETURNING id;", {
            name: "Client's Organisation",
            subdomain: "client-org"
        })).id;
        const imranId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {
            name: "Imran",
            clientId: clientOrgId,
            email: "imran.a.siddiqui@gmail.com",
            role: Role.SuperUser
        })).id;

        const youngId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {
            name: "Young",
            clientId: clientOrgId,
            email: "zelei@medl.fi",
            role: Role.SuperUser
        })).id;

        await this.db.none("INSERT INTO password_auth(user_id, password_hash) VALUES($(imranId), $(hashedPassword)), ($(youngId), $(hashedPassword));", {
            imranId: imranId,
            youngId: youngId,
            hashedPassword: password
        });
    }
}
