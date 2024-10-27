// src/services/authService.ts

import { instance } from "@/config/api";

type TUserLoginInfos = {
    user: {
        createAt: string;
        email: string;
        name: string;
        phone: string | null;
        role: "ADMIN" | "USER" | "OTHER_ROLE";
        updateAt: string;
        uuidOrganizations: string;
    };
};

async function login(
    email: string,
    password: string,
): Promise<TUserLoginInfos | undefined> {
    try {
        const result = await instance.post<TUserLoginInfos>("auth/login", {
            email,
            password,
        });

        return result.data;
    } catch (error) {
        throw new Error('Login failed'); 
    }
}

export { login };
