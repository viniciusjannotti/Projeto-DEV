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
