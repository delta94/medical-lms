import {Injectable} from "@nestjs/common";
import {PasswordHasher} from "@/account/auth/password-hasher";
import {Role} from "@/user/user.entity";
import {Seed} from "@/database/seed";
import {FeatureFlags} from "@/feature/feature.service";

@Injectable()
export class DevSeed extends Seed {
    async execute(): Promise<void> {
        const cardiffId = (await this.db.one("INSERT INTO clients(name, subdomain) VALUES($(name), $(subdomain)) RETURNING id;", {name: "Cardiff University", subdomain: "cardiff"})).id;
        const adminId = (await this.db.one("INSERT INTO users(client_id, name, email, role) VALUES($(clientId), $(name), $(email), $(role)) RETURNING id;", {name: "John Smith", clientId: cardiffId, email: "smithj@cardiff.ac.uk", role: Role.Admin})).id;
        const superUserId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {name: "Sally Spence", clientId: cardiffId, email: "spences@cardiff.ac.uk", role: Role.SuperUser})).id;
        const standardId = (await this.db.one("INSERT INTO users(client_id, name, email, role, disabled) VALUES($(clientId), $(name), $(email), $(role), false) RETURNING id;", {name: "Ffion Davies", clientId: cardiffId, email: "daviesf@cardiff.ac.uk", role: Role.Standard})).id;
        const password = await PasswordHasher.hash("Password123");
        await this.db.none("INSERT INTO password_auth(user_id, password_hash) VALUES($(userId), $(hashedPassword));", {userId: adminId, hashedPassword: password});
        await this.db.none("INSERT INTO password_auth(user_id, password_hash) VALUES($(userId), $(hashedPassword));", {userId: superUserId, hashedPassword: password});
        await this.db.none("INSERT INTO password_auth(user_id, password_hash) VALUES($(userId), $(hashedPassword));", {userId: standardId, hashedPassword: password});
        const cardiffEveryoneId = (await this.db.one("INSERT INTO groups(client_id, name, is_everyone) VALUES($(clientId), $(name), true) RETURNING id;", {clientId: cardiffId, name: "Everyone"})).id;
        await this.db.none("INSERT INTO group_members(group_id, user_id) VALUES($(groupId), $(adminId)), ($(groupId), $(superUserId));", {groupId: cardiffEveryoneId, adminId: adminId, superUserId: superUserId});

        await this.db.none("INSERT INTO patients(client_id, name, age, is_female, description, height, weight, ethnicity) VALUES($(clientId), $(name), $(age), $(isFemale), $(description), $(height), $(weight), $(ethnicity));", {clientId: cardiffId, name: "Dorothy Jenkins", description: "Had a fall", age: 70, isFemale: true, height: 1.65, weight: 60, ethnicity: "Irish Traveller"});
        await this.db.none("INSERT INTO scenarios(client_id, name, description, active) VALUES($(clientId), $(name), $(description), $(active));", {clientId: cardiffId, name: "Elderly Lady", description: "An old lady has fallen", active: false});

        let certificate = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJVLppNq0kCerqMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF2x1a2V3YXJsb3cuZXUuYXV0aDAuY29tMB4XDTIwMDIyNjE0NDQyNFoXDTMz
MTEwNDE0NDQyNFowIjEgMB4GA1UEAxMXbHVrZXdhcmxvdy5ldS5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDnRlJ+j30PqXG/59H9G3MG
zuJJvIaMTsVNdOIE6pSqkuGqYniZpqVvWn7tgASwPmNDSAFI1GI9RmiIcJ2fcS/x
xTA9+1bKZb8kpHcZc9s4ZfLWh5JDR7iDwgphJr/siq6SL9I5an8mIUrFmPlJorYi
IbAeBeA5RUoe/aVAGmm8duwC2OLJdFOHPLqMFFu3M0qBoTHFRP8Hs2mZcKrXHwPl
5CUiFuOwpnNuJtedy9KMKV6367rhlPFwDCHOQdYMGWFKxUclV3B9PeRVYHNegm1b
tiEQuFxE3lECQwhBO6x1jGOORstFUve7kmZiiMROzoxMNqkBC7+Vb1XMuCnMNj8L
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFEg7Grh45EyzmW+/
sSczknLMlyEoMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAK/Lh
9xZlraatIwGYYyGZhjlMPaVvDUKSDbzJQPMOjCl89Mj8iLzxtUcUjLBHA5TIve2Y
jD6Wcve3VyxYtJlukFczKT4Dc3M08bdcByhW1q74zzCR+i7zO5W5S/PPr3/Z4l9m
GIs0jrFikLLIcpDYK59ROHfPHLpws4k6El7np8u373wPJe/9mY5lhrpIpicC2D8+
nkcmyAaTcz2MXn9gWChaGs8Q8jHsO/Zuhg+HUkYPg7ZJqJiXDoR9VnPO8jyWngI4
NZUOuev0b0Tlb9RfecTNYHxN0ObbMDu6uqP4hodexQaA8g2PAIC3vwvHTp5yLyZS
ggQRWa2HTfGERR9MVw==
-----END CERTIFICATE-----
`;
        await this.db.none("INSERT INTO client_saml(client_id, endpoint, certificate) VALUES($(clientId), $(endpoint), $(certificate));", {
            clientId: cardiffId,
            endpoint: "https://lukewarlow.eu.auth0.com/samlp/IM5V1ftONxd9C46KE7YIUJAqixQTdUBl",
            certificate: certificate
        });


        const bristolId = (await this.db.one("INSERT INTO clients(name, subdomain) VALUES($(name), $(subdomain)) RETURNING id;", {name: "Bristol University", subdomain: "bristol"})).id;
        const bristolEveryoneId = (await this.db.one("INSERT INTO groups(client_id, name, is_everyone) VALUES($(clientId), $(name), true) RETURNING id;", {clientId: bristolId, name: "Everyone"})).id;

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
        await this.db.query("INSERT INTO patient_clerking_info(client_id, patient_id, current_complaint_history, medical_history, smoking_status, alcohol_consumption, performance_status, adl, drug_history, allergies, family_history, systemic_review) VALUES($(client_id), $(patient_id), $(current_complaint_history), $(medical_history), $(smoking_status), $(alcohol_consumption), $(performance_status), $(adl), $(drug_history), $(allergies), $(family_history), $(systemic_review));", {client_id: cardiffId, patient_id: 1, current_complaint_history: "Had a witness fall whilst walking to the shop", medical_history: "Type 2 Diabetes, Hypertension", smoking_status: true, alcohol_consumption: 0, performance_status: "1", adl:"Fully Independent", drug_history:"Metformin 1g (twice a day), Ramipril 2.5mg (once a day)", allergies: "Penicillin", family_history: "Stroke", systemic_review: "She has some breathlessness on exertion and occasional indigestion" });
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 1, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 2, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 3, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 4, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 5, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 6, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 7, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 8, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 9, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 10, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 11, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 12, result: "Painful hip palpatation with limited movement", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 13, result: "No Problems", appropriate: true});
        await this.db.one("INSERT INTO patient_physical_exam_results(client_id, patient_id, region_id, result, appropriate) VALUES($(client_id), $(patient_id), $(region_id), $(result), $(appropriate)) RETURNING id", {client_id: cardiffId, patient_id: 1, region_id: 14, result: "Tender Wrist", appropriate: true});
    }
}
