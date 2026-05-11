import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A5F',
    paddingBottom: 10,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A5F',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  fieldLabel: {
    width: '40%',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  fieldValue: {
    width: '60%',
    fontSize: 10,
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  uploadedImage: {
    maxWidth: 200,
    maxHeight: 100,
    marginTop: 5,
  }
});

interface DocumentPDFProps {
  title: string;
  data: Record<string, any>;
  metadata: {
    docId: string;
    date: string;
  };
}

// Em um ambiente real, mapearíamos id -> label ou teríamos isso já consolidado
const LABEL_MAP: Record<string, string> = {
  razao_social: 'Razão Social',
  nome_fantasia: 'Nome Fantasia',
  tipo_item: 'Classificação (Tipo)',
  opcao_maquina: 'Opção da Máquina',
  opcao_equipamento: 'Opção do Equipamento',
  finalidade: 'Finalidade',
  modelo_ecm: 'Modelo / ECM',
  fabricante: 'Fabricante',
  capacidade: 'Capacidade',
  ano_fabricacao: 'Ano',
  serial_number: 'Serial',
  vao_trilhos: 'Vão entre trilhos (m)',
  velocidade_translacao: 'Velocidade translação (m/min)',
  escolta_seguranca: 'Escolta de segurança no tambor',
  controle_remoto: 'Controle remoto',
  potencia_motor: 'Potência do motor principal (kva)',
  estrutura: 'Estrutura',
  projeto_mecanico_eletrico: 'Projeto mecânico e Elétrico do equipamento',
  sistemas_implementados: 'Sistemas de Segurança',
  nome_sistema: 'Nome do Sistema / Descrição',
  foto_sistema: 'Foto do Sistema',
  declaracao_texto: 'Declaração',
  nome_profissional: 'Nome do Profissional',
  funcao_profissional: 'Função do Profissional',
  data_inspecao: 'Data da Inspeção',
  objetivo_texto: 'Objetivo',
  severidade_class: 'Severidade (Classificação)',
  severidade_coment: 'Severidade (Comentários)',
  frequencia_class: 'Frequência (Classificação)',
  frequencia_coment: 'Frequência (Comentários)',
  possibilidade_class: 'Possibilidade de evitar o risco (Classificação)',
  possibilidade_coment: 'Possibilidade de evitar o risco (Comentários)',
  categoria_final_class: 'Categoria Final',
  detalhamento_item_3: 'Detalhamento (Item 3)',
  pontos_perigo_lista: 'Pontos de Perigo',
  descricao_ponto: 'Descrição do Ponto',
  descricao_geral_perigos: 'Descrição Geral dos Perigos',
  texto_introducao_ar: 'Introdução Análise de Risco',
  analise_hrn_tabela: 'Análise HRN',
  fator_risco_desc: 'Descrição do Fator de Risco',
  lo_val: 'LO',
  fe_val: 'FE',
  dhp_val: 'DHP',
  np_val: 'NP',
  texto_conclusao_ar: 'Conclusão Análise de Risco',
  lista_acoes_alcance: 'Ações para Alcance dos Objetivos',
  acao_id: 'ID da Ação',
  acao_desc: 'Descrição da Ação',
  texto_conclusao_alcance: 'Conclusão do Alcance',
  galeria_fotos_alcance: 'Fotos de Evidência',
  foto_evid: 'Foto de Evidência',
  lista_dispositivos_detalhada: 'Dispositivos Aplicados',
  device_qtd: 'Quantidade',
  device_foto: 'Foto do Dispositivo',
  device_posicao: 'Posição do Dispositivo',
  device_desc_longa: 'Descrição do Dispositivo',
  device_funcao_longa: 'Função do Dispositivo',
  lista_avaliacao_mecanica: 'Avaliação Mecânica',
  protecao_id_nome: 'Identificação da Proteção',
  check_construcao: 'Construção Robusta',
  plano_acao_construcao: 'Plano de Ação (Construção)',
  check_fixacao: 'Fixação',
  plano_acao_fixacao: 'Plano de Ação (Fixação)',
  check_riscos_adic: 'Sem Riscos Adicionais',
  plano_acao_riscos_adic: 'Plano de Ação (Riscos Adicionais)',
  check_burlas: 'Dificuldade de Burla',
  plano_acao_burlas: 'Plano de Ação (Burlas)',
  check_distancia: 'Distância Segura',
  plano_acao_distancia: 'Plano de Ação (Distância)',
  check_observacao: 'Observação do Ciclo',
  plano_acao_observacao: 'Plano de Ação (Observação)',
  check_ajustes: 'Ajustes/Manutenção',
  plano_acao_ajustes: 'Plano de Ação (Ajustes)',
  observacoes_finais_protecao: 'Observações Finais',
  lista_garantias_funcionais: 'Garantias Funcionais',
  garantia_id_titulo: 'ID/Título da Garantia',
  garantia_descricao: 'Descrição da Garantia',
  texto_condicao_segura: 'Condição Segura',
  data_validacao: 'Data de Validação',
  numero_art: 'Número da ART',
  assinatura_placeholder: 'Assinatura',
};

export const DocumentPDF = ({ title, data, metadata }: DocumentPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Documento Técnico de Engenharia</Text>
          </View>
          <View style={styles.logoPlaceholder}>
            {data['logo_empresa'] ? (
              <Image src={data['logo_empresa']} style={{width: 60, height: 60}} />
            ) : (
              <Text style={{fontSize: 8, color: '#94a3b8'}}>Sem Logo</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Preenchidos</Text>
          
          {Object.entries(data).map(([key, value]) => {
            if (!value || key === 'logo_empresa') return null;
            
            // Verifica se é imagem provalmente
            const isImage = typeof value === 'string' && value.startsWith('data:image');
            
            return (
              <View key={key} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{LABEL_MAP[key] || key}</Text>
                {isImage ? (
                  <View style={styles.fieldValue}>
                    <Text style={{fontSize: 8, color: '#64748b'}}>Imagem Anexada</Text>
                    <Image src={value} style={styles.uploadedImage} />
                  </View>
                ) : Array.isArray(value) ? (
                  <View style={{...styles.fieldValue, flexDirection: 'column'}}>
                    {value.map((item, index) => (
                      <View key={index} style={{marginBottom: 8, paddingBottom: 8, borderBottomWidth: index < value.length - 1 ? 1 : 0, borderBottomColor: '#e2e8f0'}}>
                        <Text style={{fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4, color: '#1E3A5F'}}>Item {index + 1}</Text>
                        {Object.entries(item).map(([subKey, subVal]) => {
                           if (!subVal) return null;
                           const isSubImage = typeof subVal === 'string' && subVal.startsWith('data:image');
                           return (
                             <View key={subKey} style={{flexDirection: 'row', marginBottom: 4}}>
                               <Text style={{width: '40%', fontSize: 9, color: '#475569', fontFamily: 'Helvetica-Bold'}}>{LABEL_MAP[subKey] || subKey}: </Text>
                               {isSubImage ? (
                                  <View style={{width: '60%'}}>
                                    <Image src={subVal as string} style={{...styles.uploadedImage, width: 100}} />
                                  </View>
                               ) : (
                                  <Text style={{width: '60%', fontSize: 9, color: '#0f172a'}}>{String(subVal)}</Text>
                               )}
                             </View>
                           )
                        })}
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>{String(value)}</Text>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>
          Gerado pelo sistema ATerra em {metadata.date} | Ref: {metadata.docId}
        </Text>
        <Text render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} fixed style={{...styles.footer, textAlign: 'right', borderTopWidth: 0}} />
      </Page>
    </Document>
  );
};
