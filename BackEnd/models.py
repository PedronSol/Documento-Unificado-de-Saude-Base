from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date

class Vaccine(BaseModel):
    id_vacina: int               
    nome_vacina: str
    dose: str
    data_aplicacao: Optional[date] = None
    status_vacina: str

    @field_validator('nome_vacina')
    def nome_nao_vazio(cls, v):
        if not v.strip():
            raise ValueError('O nome da vacina não pode ser vazio')
        return v

class Alert(BaseModel):
    id_alerta: int               
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: str
    severidade_alerta: str

    @field_validator('titulo_alerta')
    def titulo_nao_vazio(cls, v):
        if not v or not v.strip():
            raise ValueError('O nome do marcador é obrigatório')
        return v.strip()

    @field_validator('tipo_alerta')
    def tipo_valido(cls, v):
        tipos_validos = {'condition', 'medication', 'allergy'}
        if v not in tipos_validos:
            raise ValueError(f'Tipo de marcador inválido. Deve ser um dos: {", ".join(tipos_validos)}')
        return v


class MarkerCreateUpdate(BaseModel):
    tipo_alerta: str
    titulo_alerta: str
    descricao_alerta: Optional[str] = ""
    severidade_alerta: Optional[str] = "medium"

    @field_validator('titulo_alerta')
    def titulo_nao_vazio(cls, v):
        if not v or not v.strip():
            raise ValueError('O nome do marcador é obrigatório')
        return v.strip()

    @field_validator('tipo_alerta')
    def tipo_valido(cls, v):
        tipos_validos = {'condition', 'medication', 'allergy'}
        if v not in tipos_validos:
            raise ValueError(f'Tipo de marcador inválido. Deve ser um dos: {", ".join(tipos_validos)}')
        return v