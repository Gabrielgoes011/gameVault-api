import type { Response } from 'express';
import pgErrorHandler from '../error/pgErrorHandler.js';

// Formato padrão de TODA resposta da API.
// O <T> é um "genérico": representa o tipo do dado retornado (ex: PlatformResponseDTO).
interface ApiResponse<T> {
    success: boolean;
    action?: string; // indica a ação realizada (ex: 'created')
    message: string;
    data?: T;       // o "?" indica que é opcional (respostas de erro não têm data)
}

// Erro de regra de negócio, lançado no service.
// Ex: throw new AppError('Plataforma não encontrada.', 404);
class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

// ==========================================
// RESPOSTAS DE SUCESSO
// ==========================================

// 200 - OK (buscas, atualizações)
const ok = <T>(res: Response, data: T, message: string = 'Operação realizada com sucesso.') => {
    const body: ApiResponse<T> = { success: true, message, data };
    return res.status(200).json(body);
};

// 201 - Created (inserções)
const created = <T>(res: Response, data: T, message: string = 'Registro criado com sucesso.') => {
    const body: ApiResponse<T> = { success: true, action: 'created', message, data };
    return res.status(201).json(body);
};

// 204 - No Content (exclusões; não envia corpo)
const noContent = (res: Response) => {
    return res.status(204).send();
};

// ==========================================
// RESPOSTAS DE ERRO
// ==========================================

// Resposta de erro genérica, com o status que você escolher
const fail = (res: Response, statusCode: number, message: string) => {
    const body: ApiResponse<null> = { success: false, message };
    return res.status(statusCode).json(body);
};

// 400 - Bad Request (dados inválidos enviados pelo cliente)
const badRequest = (res: Response, message: string = 'Dados inválidos.') => fail(res, 400, message);

// 404 - Not Found (registro não existe)
const notFound = (res: Response, message: string = 'Registro não encontrado.') => fail(res, 404, message);

// Usado no catch do controller: descobre o tipo do erro e responde com o status certo.
const handleError = (res: Response, error: unknown, defaultMessage?: string) => {
    // Erro de regra de negócio lançado pelo service
    if (error instanceof AppError) {
        return fail(res, error.statusCode, error.message);
    }

    // Erro do PostgreSQL: o pgErrorHandler traduz o código para uma mensagem amigável
    const message = pgErrorHandler(error, defaultMessage);
    const code: string | undefined = (error as { code?: string })?.code;

    if (code === '23505') return fail(res, 409, message);             // registro duplicado -> Conflict
    if (code?.startsWith('22') || code?.startsWith('23')) {
        return fail(res, 400, message);                               // dado inválido -> Bad Request
    }

    // Qualquer outro erro (conexão, SQL errado, bug no código...)
    console.error(error);
    return fail(res, 500, message);
};

export { AppError, ok, created, noContent, fail, badRequest, notFound, handleError };
export type { ApiResponse };
