SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DROP DATABASE IF EXISTS passaporte_saude;

CREATE DATABASE IF NOT EXISTS passaporte_saude CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE passaporte_saude;

CREATE TABLE
    IF NOT EXISTS pacientes (
        cpf_paciente CHAR(11) PRIMARY KEY,
        CHECK (cpf_paciente REGEXP '^[0-9]{11}$'),
        nome_paciente VARCHAR(20) NOT NULL,
        nome_completo VARCHAR(100) NOT NULL,
        email VARCHAR(30) NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        status_saude ENUM ('updated', 'pending', 'overdue'),
        tipo_sanguineo ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        valor_qr VARCHAR(255),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_nascimento DATE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS vacinas (
        id_vacina INT AUTO_INCREMENT,
        paciente_id CHAR(11),
        nome_vacina VARCHAR(100),
        dose VARCHAR(50),
        data_aplicacao DATE,
        status_vacina ENUM ('pending', 'applied', 'overdue'),
        PRIMARY KEY (id_vacina, paciente_id),
        FOREIGN KEY (paciente_id) REFERENCES pacientes (cpf_paciente) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS alertas (
        id_alerta INT AUTO_INCREMENT,
        paciente_id CHAR(11),
        tipo_alerta ENUM ('condition', 'medication', 'allergy'),
        titulo_alerta VARCHAR(50),
        descricao_alerta VARCHAR(200),
        severidade_alerta ENUM ('low', 'medium', 'high'),
        PRIMARY KEY (id_alerta, paciente_id),
        FOREIGN KEY (paciente_id) REFERENCES pacientes (cpf_paciente) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS documentos (
        id_documento INT AUTO_INCREMENT,
        paciente_id CHAR(11),
        titulo_documento VARCHAR(50),
        tipo_documento VARCHAR(20),
        data_criacao_documento DATE,
        status_documento ENUM ('viewed', 'new'),
        PRIMARY KEY (id_documento, paciente_id),
        FOREIGN KEY (paciente_id) REFERENCES pacientes (cpf_paciente) ON DELETE CASCADE
    );