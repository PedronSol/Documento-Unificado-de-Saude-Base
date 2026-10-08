"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Pill, ShieldAlert } from "lucide-react";

import { Plus, Edit2, Trash2 } from "lucide-react";

export function MedicalAlerts({ alerts, onAdd, onEdit, onDelete, canManage = true }) {
  const typeConfig = {
    allergy: {
      icon: ShieldAlert,
      label: "Alergia",
      iconClass: "text-destructive",
    },
    condition: {
      icon: Heart,
      label: "Condição",
      iconClass: "text-warning",
    },
    medication: {
      icon: Pill,
      label: "Medicação",
      iconClass: "text-primary",
    },
  };

  const severityConfig = {
    high: {
      className: "bg-destructive text-destructive-foreground",
      label: "Alta",
    },
    medium: {
      className: "bg-warning text-warning-foreground",
      label: "Média",
    },
    low: {
      className: "bg-secondary text-secondary-foreground",
      label: "Baixa",
    },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base lg:text-lg font-semibold">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Marcadores de Saúde e Alertas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Gerencie suas condições, medicações e alergias ativas
            </p>
          </div>
          {canManage && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 h-8 rounded-xl hover:bg-primary/90 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Marcador
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {(!alerts || alerts.length === 0) ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border/60">
              Nenhum marcador de saúde cadastrado no momento.
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
            >
              {alerts.map((alert) => {
                const type = typeConfig[alert.tipo_alerta] || typeConfig.condition;
                const severity = severityConfig[alert.severidade_alerta] || severityConfig.medium;
                const TypeIcon = type.icon;

                return (
                  <motion.div
                    key={alert.id_alerta}
                    variants={item}
                    className="p-3 lg:p-4 rounded-xl bg-card border border-destructive/10 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-destructive/10 shrink-0">
                        <TypeIcon
                          className={`h-5 w-5 lg:h-6 lg:w-6 ${type.iconClass}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium text-sm lg:text-base text-foreground truncate">
                            {alert.titulo_alerta}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <Badge
                              className={`text-xs ${severity.className}`}
                            >
                              {type.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {alert.descricao_alerta || "Sem descrição"}
                        </p>

                        {canManage && (
                          <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(alert)}
                                className="p-1 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors text-xs flex items-center gap-1 px-2"
                                title="Editar marcador"
                              >
                                <Edit2 className="w-3 h-3" />
                                Editar
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(alert)}
                                className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-xs flex items-center gap-1 px-2"
                                title="Remover marcador"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remover
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
