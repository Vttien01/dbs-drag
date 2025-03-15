import { apiUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

const baseHeaderZip = {
    'Content-Type': 'application/zip',
};

const apiConfig = {
    account: {
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}admin/v1/users/me`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}admin/v1/users/me`,
            method: 'PUT',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        refreshToken: {
            baseURL: `${apiUrl}v1/account/refresh_token`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    user: {
        login: {
            baseURL: `${apiUrl}admin/v1/users/login`,
            method: 'POST',
            headers: baseHeader,
        },
        ldapLogin: {
            baseURL: `${apiUrl}admin/v1/ldap/login`,
            method: 'POST',
            headers: baseHeader,
        },
        getDetails: {
            baseURL: `${apiUrl}user/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        logout: {
            baseURL: `${apiUrl}v1/users/logout`,
            method: 'POST',
            headers: baseHeader,
        },
        verifyOtp: {
            baseURL: `${apiUrl}admin/v1/users/otp/verify`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    file: {
        image: {
            baseURL: `${apiUrl}admin/v1/image/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
        video: {
            baseURL: `${apiUrl}admin/v1/video/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
        dowloadImage: {
            baseURL: `${apiUrl}admin/v1/image/download`,
            method: 'GET',
            headers: baseHeader,
            responseType: 'blob',
        },
    },
    game: {
        getList: {
            baseURL: `${apiUrl}admin/v1/games`,
            method: 'GET',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}admin/v1/games/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}admin/v1/games`,
            method: 'POST',
            headers: baseHeader,
        },
        addGlobalLibrary: {
            baseURL: `${apiUrl}admin/v1/media_server/games`,
            method: 'POST',
            headers: baseHeader,
        },
        addGlobalGameQuestion: {
            baseURL: `${apiUrl}admin/v1/media_server/game_questions`,
            method: 'POST',
            headers: baseHeader,
        },
        listGlobalGameQuestion: {
            baseURL: `${apiUrl}admin/v1/media_server/game_questions`,
            method: 'GET',
            headers: baseHeader,
        },
        listGlobalLibrary: {
            baseURL: `${apiUrl}admin/v1/media_server/games`,
            method: 'GET',
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}admin/v1/games/:id`,
            method: 'PUT',
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}admin/v1/games/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        question: {
            create: {
                baseURL: `${apiUrl}admin/v1/game_questions`,
                method: 'POST',
                headers: baseHeader,
            },
            getList: {
                baseURL: `${apiUrl}admin/v1/games/:id/questions`,
                method: 'GET',
                headers: baseHeader,
            },
            getById: {
                baseURL: `${apiUrl}admin/v1/game_questions/:id`,
                method: 'GET',
                headers: baseHeader,
            },
            update: {
                baseURL: `${apiUrl}admin/v1/game_questions/:id`,
                method: 'PUT',
                headers: baseHeader,
            },
            delete: {
                baseURL: `${apiUrl}admin/v1/game_questions/:id`,
                method: 'DELETE',
                headers: baseHeader,
            },
            ordering: {
                baseURL: `${apiUrl}admin/v1/game_questions/:id/ordering`,
                method: 'PUT',
                headers: baseHeader,
            },
            import: {
                baseURL: `${apiUrl}admin/v1/game_questions/import/csv`,
                method: 'POST',
                headers: multipartFormHeader,
            },
            export: {
                baseURL: `${apiUrl}admin/v1/game_questions/export/csv`,
                method: 'GET',
                headers: baseHeader,
            },
        },
    },
};

export default apiConfig;
