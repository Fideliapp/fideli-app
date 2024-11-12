export const isValidDocument = (document: string): boolean => {
  document = document.replace(/[^\d]/g, '');

  if (document.length === 11) {
    return isValidCPF(document);
  } else if (document.length === 14) {
    return isValidCNPJ(document);
  }

  return false;
};

const isValidCPF = (cpf: string): boolean => {
  return cpf.length === 11 && !/^(\d)\1{10}$/.test(cpf);
};

const isValidCNPJ = (cnpj: string): boolean => {
  return cnpj.length === 14 && !/^(\d)\1{13}$/.test(cnpj);
};
