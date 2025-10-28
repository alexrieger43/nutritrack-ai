import { User } from './types';

// Cálculo de IMC
export function calcularIMC(peso: number, altura: number): number {
  return peso / Math.pow(altura / 100, 2);
}

export function classificarIMC(imc: number): string {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc <= 24.9) return 'Normal';
  if (imc <= 29.9) return 'Sobrepeso';
  return 'Obesidade';
}

// Cálculo de TMB (Taxa Metabólica Basal)
export function calcularTMB(user: User): number {
  const { peso, altura, idade, sexo } = user;
  
  if (sexo === 'masculino') {
    return 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
  } else {
    return 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
  }
}

// Fator de atividade
export function getFatorAtividade(nivel: string): number {
  switch (nivel) {
    case 'sedentario': return 1.2;
    case 'leve': return 1.375;
    case 'moderado': return 1.55;
    case 'intenso': return 1.725;
    default: return 1.2;
  }
}

// Cálculo de meta calórica
export function calcularMetaCalorica(user: User, objetivo: 'emagrecer' | 'manter' | 'ganhar'): number {
  const tmb = calcularTMB(user);
  const fator = getFatorAtividade(user.nivel_atividade);
  const tmbComAtividade = tmb * fator;
  
  switch (objetivo) {
    case 'emagrecer': return Math.round(tmbComAtividade * 0.85);
    case 'manter': return Math.round(tmbComAtividade * 1.0);
    case 'ganhar': return Math.round(tmbComAtividade * 1.15);
    default: return Math.round(tmbComAtividade);
  }
}

// Cálculo de calorias gastas com exercícios
export function calcularCaloriasExercicio(met: number, peso: number, duracaoMin: number): number {
  return Math.round((met * 3.5 * peso / 200) * duracaoMin);
}

// Determinar status do dia baseado na meta
export function determinarStatus(consumidas: number, meta: number): 'abaixo' | 'dentro' | 'acima' {
  const percentual = (consumidas / meta) * 100;
  
  if (percentual < 85) return 'abaixo';
  if (percentual <= 115) return 'dentro';
  return 'acima';
}

// Gerar cor baseada no status
export function getCorStatus(status: 'abaixo' | 'dentro' | 'acima'): string {
  switch (status) {
    case 'abaixo': return 'text-green-600 bg-green-50';
    case 'dentro': return 'text-yellow-600 bg-yellow-50';
    case 'acima': return 'text-red-600 bg-red-50';
  }
}