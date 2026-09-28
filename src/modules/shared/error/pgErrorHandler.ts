// src/modules/shared/error/pgErrorHandler.ts

// Mapa de código de erro do PostgreSQL -> mensagem amigável para o usuário final.
// Fica fora da função porque é uma constante fixa: não precisa ser recriada a cada chamada.
const errorMessages: { [key: string]: string } = {
    // ==========================================
    // CLASSE 23: VIOLAÇÕES DE INTEGRIDADE (Os mais comuns no dia a dia)
    // ==========================================
    '23505': 'Já existe um registro com estes dados informados.', // unique_violation (Ex: email repetido)
    '23503': 'Esta ação não é permitida porque o registro está vinculado a outra informação no sistema.', // foreign_key_violation (Ex: apagar fatura que tem movimentações)
    '23502': 'Um ou mais campos obrigatórios não foram preenchidos.', // not_null_violation (Ex: mandou nulo onde não podia)
    '23514': 'Os dados informados não cumprem as regras de validação do sistema.', // check_violation (Ex: valor negativo onde o banco só aceita positivo)

    // ==========================================
    // CLASSE 22: EXCEÇÕES DE DADOS (Erros de formatação e tamanho)
    // ==========================================
    '22001': 'O texto enviado excede o tamanho máximo permitido para o campo.', // string_data_right_truncation (Ex: mandou 300 caracteres num VARCHAR(255))
    '22003': 'O valor numérico informado é muito alto ou muito baixo para este campo.', // numeric_value_out_of_range (Ex: número gigantesco num campo INT normal)
    '22007': 'O formato de data ou hora informado é inválido.', // invalid_datetime_format
    '22008': 'O valor de data ou hora informado está fora dos limites aceitos.', // datetime_field_overflow
    '22P02': 'O formato de algum dado enviado é inválido.', // invalid_text_representation (Muito comum no Neon: mandar string 'abc' para um campo UUID)

    // ==========================================
    // CLASSE 08: ERROS DE CONEXÃO (Problemas de rede com o Neon)
    // ==========================================
    '08000': 'Não foi possível estabelecer conexão com o banco de dados no momento.', // connection_exception
    '08003': 'A conexão com o banco de dados foi perdida.', // connection_does_not_exist
    '08006': 'Falha na comunicação com o servidor de dados. Tente novamente.', // connection_failure

    // ==========================================
    // CLASSE 40: ERROS DE TRANSAÇÃO (Concorrência)
    // ==========================================
    '40P01': 'O sistema encontrou um conflito de processamento. Por favor, tente novamente.', // deadlock_detected (Dois processos tentaram atualizar a mesma coisa juntos)

    // ==========================================
    // CLASSE 42: ERROS DE SINTAXE E ACESSO (Erros de DEV)
    // ATENÇÃO: Aqui as mensagens devem ser BEM genéricas para não expor a arquitetura
    // ==========================================
    '42601': 'Erro interno no processamento da requisição.', // syntax_error (Você escreveu o SQL errado no backend)
    '42P01': 'Erro interno. Um recurso necessário não foi encontrado.', // undefined_table (Escreveu o nome da tabela errado)
    '42703': 'Erro interno de estruturação de dados.', // undefined_column (Escreveu o nome da coluna errado)

    // ==========================================
    // CLASSE 53: RECURSOS INSUFICIENTES (Gargalos no Servidor)
    // ==========================================
    '53300': 'O sistema está recebendo muitos acessos simultâneos no momento. Tente em instantes.', // too_many_connections (Excedeu o limite do plano do Neon)
    '53200': 'O servidor ficou sem memória para processar a requisição.', // out_of_memory
};

/**
 * Traduz um erro do PostgreSQL (pg / Neon) para uma mensagem segura ao usuário final.
 *
 * @param error          O objeto de erro capturado no catch.
 * @param defaultMessage Mensagem genérica caso o erro não seja de banco ou não seja reconhecido.
 * @returns              A mensagem tratada.
 */
const pgErrorHandler = (
    error: any,
    defaultMessage: string = 'Ocorreu um erro inesperado.'
): string => {
    
    // Se não for um erro de banco (não tem code), devolve a mensagem genérica.
    if (!error || !error.code) {
        return defaultMessage;
    }

    // Código mapeado explicitamente: usa a mensagem específica.
    if (errorMessages[error.code]) {
        return errorMessages[error.code];
    }

    // Fallback por classe (os dois primeiros caracteres do code).
    if (error.code.startsWith('08')) {
        return 'Não foi possível se comunicar com o banco de dados. Tente novamente mais tarde.';
    }

    if (error.code.startsWith('42')) {
        return 'Erro interno no sistema. Tente novamente mais tarde.';
    }

    // Nada reconhecido: mensagem genérica.
    return defaultMessage;
};

export default pgErrorHandler;
