import {Injectable} from '@nestjs/common';
import {ClientRepository} from "@/client/client.repository";

@Injectable()
export class FeatureService {
    private globalFeatures: Map<string, IFeatureObject>;

    constructor(private readonly clientRepository: ClientRepository) {
        this.loadGlobalFlags();
    }

    private async loadGlobalFlags() {
        const globalFeaturesObj = await import(`../../features.${process.env.NODE_ENV}.json`);
        this.globalFeatures = new Map<string, IFeatureObject>(Object.entries(globalFeaturesObj));
    }

    async isEnabled(clientId: number, featureKey: string): Promise<boolean> {
        const featureStatus = await this.clientRepository.isFeatureEnabled(clientId, featureKey);

        let globalFeature: IFeatureObject = this.globalFeatures.get(featureKey);
        if (!globalFeature) {
            console.warn(`${featureKey} is not a feature key, but has been used.`);
            return false;
        }

        if (featureStatus.enabled === null) {
            return globalFeature.status.enabled;
        } else if (globalFeature.status.force) {
            if (featureStatus.force && globalFeature.status.enabled)
                return featureStatus.enabled;
            else
                return globalFeature.status.enabled;
        } else {
            return featureStatus.enabled;
        }
    }

    isEnabledGlobally(featureKey: string): boolean {
        let feature: IFeatureObject = this.globalFeatures.get(featureKey);
        if (!feature) {
            console.warn(`${featureKey} is not a feature key, but has been used.`);
            return false;
        }

        return feature.status.enabled;
    }

    getFeatureFlagsForSystem(): Map<string, IFeatureObject> {
        return this.globalFeatures;
    }

    async getFeatureFlagsForClient(clientId: number): Promise<Map<string, IFeatureStatus>> {
        return await this.clientRepository.getFeatureFlagsForClient(clientId);
    }

    async setFeatureFlagsForClient(clientId: number, flags: Map<string, IFeatureStatus>): Promise<boolean> {
        flags.forEach((value, key) => {
            //If the flag is set to defer then delete the entry to avoid storing it in the database.
            if (value.enabled === null)
                flags.delete(key);

            //If the flag is not in the global flags then it has been removed, so shouldn't be stored in the database anymore.
            const globalFlag = this.globalFeatures.get(key);
            if (!globalFlag)
                flags.delete(key);
        });

        return await this.clientRepository.setFeatureFlagsForClient(clientId, flags);
    }
}

export interface IFeatureObject {
    label: string;
    description: string;
    status: IFeatureStatus
}

export interface IFeatureStatus {
    enabled: boolean | null;
    force?: boolean;
}

export enum FeatureFlags {
    emails = "emails",
    samlSSO = "saml",
    mfa = "mfa",
    mfaTotp = "mfa-totp",
    mfaFido = "mfa-fido"
}
