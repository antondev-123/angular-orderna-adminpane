import { Role } from "../../model/enum/role";

export interface AuthTokenPayload {
    id: number;
    username: string;
    role: Role;
    isOnboardingCompleted: boolean;
}