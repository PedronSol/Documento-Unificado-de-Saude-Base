from datetime import date
from typing import List, Optional, Union
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
import mysql.connector
import bcrypt
import os

app = FastAPI(title="Passaporte de Saúde - API com CRUD Completo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    banco_host = os.getenv("DB_HOST", "db")
    banco_port = int(os.getenv("DB_PORT", "3306" if banco_host == "db" else "3307"))
    try:
        connection = mysql.connector.connect(
            host=banco_host,
            port=banco_port,
            user="root",
            password="root",
            database="passaporte_saude",
            charset="utf8mb4"
        )
        return connection
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Erro no banco: {err}")

class Vaccine(BaseModel):
    id_vacina: int
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[date | str] = None
    status_vacina: str

class Alert(BaseModel):
    id_alerta: int
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: str
    severidade_alerta: str

class MarkerCreateUpdate(BaseModel):
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: Optional[str] = ""
    severidade_alerta: Optional[str] = "medium"

class Document(BaseModel):
    id_documento: int
    titulo_documento: str
    tipo_documento: str
    data_criacao_documento: date | str
    status_documento: str

class PatientProfile(BaseModel):
    cpf_paciente: str
    nome_paciente: str
    nome_completo: str
    email: str
    avatar: Optional[str] = None
    status_saude: str
    tipo_sanguineo: str
    valor_qr: str
    maior_de_idade: bool
    idade: int

class LoginResponse(BaseModel):
    message: str
    patient_data: PatientProfile
    vaccines: List[Vaccine]
    alerts: List[Alert]
    documents: List[Document]

class VaccineCreateUpdate(BaseModel):
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[date | str] = None
    status_vacina: str


@app.post("/login", response_model=LoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query_paciente = "SELECT * FROM pacientes WHERE email = %s"
    cursor.execute(query_paciente, (form_data.username,))
    paciente = cursor.fetchone()

    if not paciente or form_data.password != paciente["senha_hash"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    data_nasc = paciente["data_nascimento"]
    today = date.today()
    idade_calculada = today.year - data_nasc.year - ((today.month, today.day) < (data_nasc.month, data_nasc.day))

    paciente["maior_de_idade"] = idade_calculada >= 18
    paciente["idade"] = idade_calculada

    cpf = paciente["cpf_paciente"]

    cursor.execute("SELECT id_vacina, nome_vacina, dose, data_aplicacao, status_vacina FROM vacinas WHERE paciente_id = %s", (cpf,))
    vacinas = cursor.fetchall()

    cursor.execute("SELECT id_alerta, tipo_alerta, titulo_alerta, descricao_alerta, severidade_alerta FROM alertas WHERE paciente_id = %s", (cpf,))
    alertas = cursor.fetchall()

    cursor.execute("SELECT id_documento, titulo_documento, tipo_documento, data_criacao_documento, status_documento FROM documentos WHERE paciente_id = %s", (cpf,))
    documentos = cursor.fetchall()

    cursor.close()
    conn.close()

    paciente.pop("senha_hash", None)

    return {
        "message": "Login efetuado com sucesso!",
        "patient_data": paciente,
        "vaccines": vacinas,
        "alerts": alertas,
        "documents": documentos
    }

@app.post("/patients/{cpf_paciente}/vaccines", status_code=201)
def add_vaccine(cpf_paciente: str, vaccine: VaccineCreateUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = """
            INSERT INTO vacinas (paciente_id, nome_vacina, dose, data_aplicacao, status_vacina)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            cpf_paciente.strip(),
            vaccine.nome_vacina.strip(),
            vaccine.dose,
            vaccine.data_aplicacao if vaccine.data_aplicacao else None,
            vaccine.status_vacina
        ))
        conn.commit()
        return {"message": "Vacina registrada com sucesso!"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Erro ao inserir: {err}")
    finally:
        cursor.close()
        conn.close()

@app.get("/patients/{cpf_paciente}/vaccines", response_model=List[Vaccine])
def get_vaccines(cpf_paciente: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT id_vacina, nome_vacina, dose, data_aplicacao, status_vacina FROM vacinas WHERE paciente_id = %s"
    cursor.execute(query, (cpf_paciente,))
    vacinas = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return vacinas

@app.put("/patients/{cpf_paciente}/vaccines/{id_vacina}")
def update_vaccine(cpf_paciente: str, id_vacina: int, vaccine: VaccineCreateUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE vacinas 
        SET nome_vacina = %s, dose = %s, data_aplicacao = %s, status_vacina = %s
        WHERE id_vacina = %s AND paciente_id = %s
    """
    cursor.execute(query, (
        vaccine.nome_vacina,
        vaccine.dose,
        vaccine.data_aplicacao,
        vaccine.status_vacina,
        id_vacina,
        cpf_paciente
    ))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Vacina ou Paciente não encontrado.")
        
    cursor.close()
    conn.close()
    return {"message": "Vacina atualizada com sucesso!"}

@app.delete("/patients/{cpf_paciente}/vaccines/{id_vacina}")
def delete_vaccine(cpf_paciente: str, id_vacina: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "DELETE FROM vacinas WHERE id_vacina = %s AND paciente_id = %s"
    cursor.execute(query, (id_vacina, cpf_paciente))
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Vacina ou Paciente não encontrado.")
        
    cursor.close()
    conn.close()
    return {"message": "Vacina removida com sucesso!"}

@app.get("/patients/{cpf_paciente}/markers", response_model=List[Alert])
def get_markers(cpf_paciente: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT id_alerta, tipo_alerta, titulo_alerta, descricao_alerta, severidade_alerta
        FROM alertas 
        WHERE paciente_id = %s
        ORDER BY id_alerta DESC
    """
    cursor.execute(query, (cpf_paciente.strip(),))
    markers = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return markers

@app.post("/patients/{cpf_paciente}/markers", status_code=201)
def add_marker(cpf_paciente: str, marker: MarkerCreateUpdate):
    titulo = marker.titulo_alerta.strip()
    if not titulo:
        raise HTTPException(status_code=400, detail="O nome do marcador é obrigatório.")

    tipos_validos = {"condition", "medication", "allergy"}
    if marker.tipo_alerta not in tipos_validos:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de marcador inválido. Opções permitidas: {', '.join(tipos_validos)}."
        )

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        check_query = """
            SELECT id_alerta, titulo_alerta, tipo_alerta 
            FROM alertas 
            WHERE paciente_id = %s AND LOWER(TRIM(titulo_alerta)) = LOWER(%s)
        """
        cursor.execute(check_query, (cpf_paciente.strip(), titulo))
        existente = cursor.fetchone()
        
        if existente:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Esta condição ou medicação já está cadastrada.",
                    "existing_marker_id": existente["id_alerta"]
                }
            )

        insert_query = """
            INSERT INTO alertas (paciente_id, tipo_alerta, titulo_alerta, descricao_alerta, severidade_alerta)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            cpf_paciente.strip(),
            marker.tipo_alerta,
            titulo,
            marker.descricao_alerta.strip() if marker.descricao_alerta else "",
            marker.severidade_alerta if marker.severidade_alerta else "medium"
        ))
        conn.commit()
        novo_id = cursor.lastrowid

        return {
            "message": "Marcador salvo com sucesso!",
            "id_marcador": novo_id
        }
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar marcador: {err}")
    finally:
        cursor.close()
        conn.close()

@app.put("/patients/{cpf_paciente}/markers/{id_marcador}")
def update_marker(cpf_paciente: str, id_marcador: int, marker: MarkerCreateUpdate):
    titulo = marker.titulo_alerta.strip()
    if not titulo:
        raise HTTPException(status_code=400, detail="O nome do marcador é obrigatório.")

    tipos_validos = {"condition", "medication", "allergy"}
    if marker.tipo_alerta not in tipos_validos:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de marcador inválido. Opções permitidas: {', '.join(tipos_validos)}."
        )

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        check_query = """
            SELECT id_alerta 
            FROM alertas 
            WHERE paciente_id = %s AND LOWER(TRIM(titulo_alerta)) = LOWER(%s) AND id_alerta != %s
        """
        cursor.execute(check_query, (cpf_paciente.strip(), titulo, id_marcador))
        if cursor.fetchone():
            raise HTTPException(
                status_code=409,
                detail="Já existe outro marcador cadastrado com este nome."
            )

        update_query = """
            UPDATE alertas
            SET tipo_alerta = %s, titulo_alerta = %s, descricao_alerta = %s, severidade_alerta = %s
            WHERE id_alerta = %s AND paciente_id = %s
        """
        cursor.execute(update_query, (
            marker.tipo_alerta,
            titulo,
            marker.descricao_alerta.strip() if marker.descricao_alerta else "",
            marker.severidade_alerta if marker.severidade_alerta else "medium",
            id_marcador,
            cpf_paciente.strip()
        ))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Marcador ou paciente não encontrado.")

        return {"message": "Marcador atualizado com sucesso!"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar marcador: {err}")
    finally:
        cursor.close()
        conn.close()

@app.delete("/patients/{cpf_paciente}/markers/{id_marcador}")
def delete_marker(cpf_paciente: str, id_marcador: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "DELETE FROM alertas WHERE id_alerta = %s AND paciente_id = %s"
        cursor.execute(query, (id_marcador, cpf_paciente.strip()))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Marcador ou paciente não encontrado.")

        return {"message": "Marcador removido com sucesso!"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Erro ao remover marcador: {err}")
    finally:
        cursor.close()
        conn.close()