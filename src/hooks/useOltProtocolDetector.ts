
import { useOltConfigurations } from './useOltConfigurations';

export type OltProtocol = 'snmp' | 'http' | 'hybrid';

interface ProtocolConfig {
  protocol: OltProtocol;
  capabilities: {
    snmp: boolean;
    http: boolean;
    apiEndpoints?: string[];
  };
}

export const useOltProtocolDetector = () => {
  const { configurations } = useOltConfigurations();

  // Configurações de protocolo por marca/modelo
  const protocolMatrix: Record<string, Record<string, ProtocolConfig>> = {
    huawei: {
      'MA5608T': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/v1/'] } },
      'MA5683T': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/v1/'] } },
      'MA5800-X7': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/v2/'] } },
      'MA5800-X15': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/v2/'] } },
    },
    zte: {
      'C320': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/ztp/'] } },
      'C300': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/ztp/'] } },
      'C220': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'C600': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/'] } },
    },
    fiberhome: {
      'AN5516-01': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'AN5516-04': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'AN5516-06': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/'] } },
    },
    parks: {
      'OLT 4800': { protocol: 'http', capabilities: { snmp: false, http: true, apiEndpoints: ['/api/v1/'] } },
      'OLT 8800': { protocol: 'http', capabilities: { snmp: false, http: true, apiEndpoints: ['/api/v1/'] } },
      'OLT 1600': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
    },
    datacom: {
      'DM4100': { protocol: 'hybrid', capabilities: { snmp: true, http: true, apiEndpoints: ['/api/'] } },
      'DM4000': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'DM991': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
    },
    vsol: {
      'V1600D': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'V1600G': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'V2408G': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'V2724G': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
      'V3216G': { protocol: 'snmp', capabilities: { snmp: true, http: false } },
    }
  };

  const getOltProtocol = (oltConfigId: string): ProtocolConfig => {
    const config = configurations.find(c => c.id === oltConfigId);
    
    if (!config) {
      return { protocol: 'snmp', capabilities: { snmp: true, http: false } };
    }

    const brandConfig = protocolMatrix[config.brand.toLowerCase()];
    if (!brandConfig) {
      return { protocol: 'snmp', capabilities: { snmp: true, http: false } };
    }

    const modelConfig = brandConfig[config.model];
    if (!modelConfig) {
      return { protocol: 'snmp', capabilities: { snmp: true, http: false } };
    }

    return modelConfig;
  };

  const getSupportedOperations = (oltConfigId: string) => {
    const protocolConfig = getOltProtocol(oltConfigId);
    
    return {
      snmpOperations: protocolConfig.capabilities.snmp,
      httpOperations: protocolConfig.capabilities.http,
      protocol: protocolConfig.protocol,
      apiEndpoints: protocolConfig.capabilities.apiEndpoints || []
    };
  };

  return {
    getOltProtocol,
    getSupportedOperations,
    protocolMatrix
  };
};
