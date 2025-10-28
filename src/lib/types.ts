export interface User {
  id: string;
  nome: string;
  email: string;
  idade: number;
  peso: number;
  altura: number;
  sexo: 'masculino' | 'feminino';
  nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso';
  meta_calorias: number;
  plano_premium: boolean;
}

export interface Refeicao {
  id: string;
  user_id: string;
  data: Date;
  nome: string;
  calorias: number;
  imagem_url?: string;
  macros: {
    carboidratos: number;
    proteinas: number;
    gorduras: number;
  };
}

export interface Exercicio {
  id: string;
  user_id: string;
  tipo: string;
  duracao_min: number;
  calorias_gastas: number;
  data: Date;
}

export interface HistoricoDiario {
  id: string;
  user_id: string;
  data: Date;
  total_calorias_consumidas: number;
  total_calorias_gastas: number;
  saldo: number;
  status: 'abaixo' | 'dentro' | 'acima';
}

export interface ExercicioMET {
  nome: string;
  met: number;
}

export const EXERCICIOS_MET: ExercicioMET[] = [
  { nome: 'Caminhada leve', met: 3.0 },
  { nome: 'Corrida', met: 8.0 },
  { nome: 'Ciclismo', met: 7.5 },
  { nome: 'Musculação', met: 6.0 },
  { nome: 'Natação', met: 7.0 },
  { nome: 'Yoga', met: 3.5 },
];