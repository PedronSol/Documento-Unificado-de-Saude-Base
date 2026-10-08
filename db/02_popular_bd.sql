SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE passaporte_saude;

INSERT IGNORE INTO pacientes (
    cpf_paciente,
    nome_paciente,
    nome_completo,
    email,
    senha_hash,
    avatar,
    status_saude,
    tipo_sanguineo,
    valor_qr,
    data_nascimento
)
VALUES
    (
        '00011122222',
        'Carlos Silva',
        'Carlos Eduardo Silva',
        'carlos.silva@email.com',
        'senha123',
        null,
        'updated',
        'A+',
        'https://saude.gov.br/passport/000.111.222-22',
        '1985-04-12'
    ),
    (
        '11122233344',
        'Mariana Souza',
        'Mariana Costa Souza',
        'mariana.souza@email.com',
        'senha123',
        null,
        'pending',
        'O-',
        'https://saude.gov.br/passport/111.222.333-44',
        '2021-07-11'
    ),
    (
        '12345678900',
        'Roberto Oliveira',
        'Roberto Santos Oliveira',
        'roberto.oliveira@email.com',
        'senha123',
        null,
        'overdue',
        'B+',
        'https://saude.gov.br/passport/123.456.789-00',
        '1993-09-25'
    ),
    (
        '00111223401',
        'Juliana Lima',
        'Juliana Ribeiro Lima',
        'juliana.lima@email.com',
        'senha123',
        null,
        'updated',
        'AB+',
        'https://saude.gov.br/passport/001.112.234-01',
        '2002-11-02'
    ),
    (
        '14235486778',
        'Ricardo Prado',
        'Ricardo Almeida Prado',
        'ricardo.prado@email.com',
        'senha123',
        null,
        'pending',
        'O+',
        'https://saude.gov.br/passport/142.354.867-78',
        '1976-01-30'
    ),
    (
        '11111111111',
        'Beatriz Dias',
        'Beatriz Goncalves Dias',
        'beatriz.dias@email.com',
        'senha123',
        null,
        'updated',
        'A-',
        'https://saude.gov.br/passport/111.111.111-11',
        '1999-12-05'
    ),
    (
        '98765432111',
        'Lucas Vieira',
        'Lucas Martins Vieira',
        'lucas.vieira@email.com',
        'senha123',
        null,
        'overdue',
        'B-',
        'https://saude.gov.br/passport/987.654.321-11',
        '2010-06-15'
    ),
    (
        '11123423298',
        'Camila Fernandes',
        'Camila Rodrigues Fernandes',
        'camila.fernandes@email.com',
        'senha123',
        null,
        'updated',
        'O+',
        'https://saude.gov.br/passport/111.234.232-98',
        '1988-08-21'
    ),
    (
        '00000000001',
        'Fernando Rocha',
        'Fernando Henrique Rocha',
        'fernando.rocha@email.com',
        'senha123',
        null,
        'pending',
        'AB-',
        'https://saude.gov.br/passport/000.000.000-01',
        '1964-03-14'
    ),
    (
        '12312312312',
        'Sofia Mendes',
        'Sofia Castro Mendes',
        'sofia.mendes@email.com',
        'senha123',
        null,
        'updated',
        'A+',
        'https://saude.gov.br/passport/12312312312',
        '2005-05-19'
    );

INSERT IGNORE INTO vacinas (
    id_vacina,
    paciente_id,
    nome_vacina,
    dose,
    data_aplicacao,
    status_vacina
)
VALUES
    (
        '1',
        '00011122222',
        'COVID-19 (Pfizer)',
        '3ª Dose - Reforço',
        '2024-02-10',
        'applied'
    ),
    (
        '2',
        '00011122222',
        'Influenza',
        'Dose Anual',
        '2024-04-15',
        'applied'
    ),
    (
        '3',
        '00011122222',
        'Tríplice Viral',
        '2ª Dose',
        '2023-05-15',
        'applied'
    ),
    (
        '1',
        '11122233344',
        'COVID-19 (Bivalente)',
        'Reforço',
        '2023-11-22',
        'applied'
    ),
    (
        '2',
        '11122233344',
        'Influenza',
        'Dose Anual',
        null,
        'pending'
    ),
    (
        '3',
        '11122233344',
        'Hepatite B',
        '3ª Dose',
        '2024-01-05',
        'applied'
    ),
    (
        '1',
        '12345678900',
        'Tétano (dT)',
        'Reforço',
        null,
        'overdue'
    ),
    (
        '2',
        '12345678900',
        'Febre Amarela',
        'Dose Única',
        '2015-02-14',
        'applied'
    ),
    (
        '1',
        '00111223401',
        'COVID-19 (Pfizer)',
        '3ª Dose',
        '2024-01-05',
        'applied'
    ),
    (
        '2',
        '00111223401',
        'Influenza',
        'Dose Anual',
        '2024-05-02',
        'applied'
    ),
    (
        '3',
        '00111223401',
        'HPV',
        '2ª Dose',
        '2022-09-12',
        'applied'
    ),
    (
        '1',
        '14235486778',
        'Hepatite A',
        '2ª Dose',
        null,
        'pending'
    ),
    (
        '2',
        '14235486778',
        'Meningocócica ACWY',
        'Dose Única',
        '2023-07-19',
        'applied'
    ),
    (
        '1',
        '11111111111',
        'COVID-19 (AstraZeneca)',
        '2ª Dose',
        '2022-08-14',
        'applied'
    ),
    (
        '2',
        '11111111111',
        'Influenza',
        'Dose Anual',
        '2024-05-10',
        'applied'
    ),
    (
        '3',
        '11111111111',
        'Tríplice Viral',
        'Reforço',
        '2023-01-11',
        'applied'
    ),
    (
        '1',
        '98765432111',
        'Febre Amarela',
        'Dose Única',
        null,
        'overdue'
    ),
    (
        '2',
        '98765432111',
        'Tríplice Viral',
        '1ª Dose',
        '2023-09-15',
        'applied'
    ),
    (
        '1',
        '11123423298',
        'COVID-19 (Janssen)',
        'Dose Única',
        '2021-11-10',
        'applied'
    ),
    (
        '2',
        '11123423298',
        'Influenza',
        'Dose Anual',
        '2024-04-18',
        'applied'
    ),
    (
        '1',
        '00000000001',
        'Meningocócica B',
        '2ª Dose',
        null,
        'pending'
    ),
    (
        '2',
        '00000000001',
        'Tétano (dT)',
        'Reforço',
        '2022-01-30',
        'applied'
    ),
    (
        '1',
        '12312312312',
        'COVID-19 (Pfizer)',
        '4ª Dose',
        '2024-02-05',
        'applied'
    ),
    (
        '2',
        '12312312312',
        'Influenza',
        'Dose Anual',
        '2024-05-01',
        'applied'
    ),
    (
        '3',
        '12312312312',
        'Hepatite B',
        '3ª Dose',
        '2023-12-15',
        'applied'
    );

INSERT IGNORE INTO alertas (
    id_alerta,
    paciente_id,
    tipo_alerta,
    titulo_alerta,
    descricao_alerta,
    severidade_alerta
)
VALUES
    (
        '1',
        '00011122222',
        'condition',
        'Hipertensão',
        'Diagnosticada em 2021. Controlada.',
        'medium'
    ),
    (
        '2',
        '00011122222',
        'medication',
        'Losartana 50mg',
        'Tomar 1x ao dia pela manhã.',
        'low'
    ),
    (
        '1',
        '11122233344',
        'allergy',
        'Alergia a Dipirona',
        'Urticária severa e edema de glote.',
        'high'
    ),
    (
        '1',
        '12345678900',
        'condition',
        'Asma Moderada',
        'Uso de bombinha em crises sazonais.',
        'medium'
    ),
    (
        '2',
        '12345678900',
        'medication',
        'Aerolin Spray',
        'Uso SOS se houver falta de ar.',
        'low'
    ),
    (
        '1',
        '14235486778',
        'allergy',
        'Intolerância Severa à Lactose',
        'Problemas gastrointestinais agudos.',
        'medium'
    ),
    (
        '1',
        '11111111111',
        'condition',
        'Hipotireoidismo',
        'Diagnosticado em 2018.',
        'medium'
    ),
    (
        '2',
        '11111111111',
        'medication',
        'Puran T4 50mcg',
        '1 comprimido em jejum diário.',
        'low'
    ),
    (
        '1',
        '98765432111',
        'allergy',
        'Alergia a Frutos do Mar',
        'Choque anafilático com camarão.',
        'high'
    ),
    (
        '1',
        '00000000001',
        'condition',
        'Insuficiência Renal Leve',
        'Necessidade de monitoramento de creatinina.',
        'medium'
    ),
    (
        '1',
        '12312312312',
        'allergy',
        'Alergia a Sulfa',
        'Causa erupções cutâneas graves.',
        'high'
    );

INSERT IGNORE INTO documentos (
    id_documento,
    paciente_id,
    titulo_documento,
    tipo_documento,
    data_criacao_documento,
    status_documento
)
VALUES
    (
        '1',
        '00011122222',
        'Eletrocardiograma',
        'exam',
        '2024-03-12',
        'viewed'
    ),
    (
        '2',
        '00011122222',
        'Receita - Dr. Marcos Lima',
        'prescription',
        '2024-03-12',
        'viewed'
    ),
    (
        '1',
        '11122233344',
        'Hemograma e Ferro',
        'exam',
        '2024-05-10',
        'new'
    ),
    (
        '2',
        '11122233344',
        'Atestado Médico',
        'report',
        '2024-05-11',
        'viewed'
    ),
    (
        '1',
        '12345678900',
        'Espirometria',
        'exam',
        '2023-10-20',
        'viewed'
    ),
    (
        '1',
        '00111223401',
        'Beta HCG Quantitativo',
        'exam',
        '2024-05-18',
        'new'
    ),
    (
        '2',
        '00111223401',
        'Ultrassonografia Obstétrica',
        'exam',
        '2024-05-25',
        'new'
    ),
    (
        '1',
        '14235486778',
        'Exame de Fezes',
        'exam',
        '2024-04-03',
        'viewed'
    ),
    (
        '2',
        '14235486778',
        'Encaminhamento Nutricionista',
        'report',
        '2024-04-04',
        'viewed'
    ),
    (
        '1',
        '11111111111',
        'Dosagem de TSH e T4 Livre',
        'exam',
        '2024-04-22',
        'viewed'
    ),
    (
        '2',
        '11111111111',
        'Receita - Dra. Elena Cruz',
        'prescription',
        '2024-04-23',
        'viewed'
    ),
    (
        '1',
        '98765432111',
        'Teste Alérgico Prick Test',
        'exam',
        '2023-10-10',
        'viewed'
    ),
    (
        '1',
        '11123423298',
        'Check-up Geral',
        'exam',
        '2024-04-19',
        'viewed'
    ),
    (
        '1',
        '00000000001',
        'Creatinina e Ureia',
        'exam',
        '2024-05-14',
        'new'
    ),
    (
        '2',
        '00000000001',
        'Laudo Nefrológico',
        'report',
        '2024-05-15',
        'new'
    ),
    (
        '1',
        '12312312312',
        'Receita Dermatologista',
        'prescription',
        '2024-05-20',
        'new'
    )