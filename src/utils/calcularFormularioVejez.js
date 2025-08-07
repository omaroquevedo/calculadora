export default function calcularCampos(formData) {
  const resultado = { ...formData };

  // Obtener valores necesarios
  const saldo1 = parseFloat(formData["Saldo en cuotas CCICO fondo 1 (BDA)"]) || 0;
  const saldo2 = parseFloat(formData["Saldo en cuotas CCICO fondo 2 (BDA)"]) || 0;
  const vc1 = parseFloat(formData["Valor cuota fondo 1"]) || 0;
  const vc2 = parseFloat(formData["Valor cuota fondo 2"]) || 0;
  const ufHoy = parseFloat(formData["Valor UF hoy"]) || 0;
  const saldoCuotasBR = parseFloat(formData["Saldo en cuotas BR"]) || 0;
  const saldoPesosBR = parseFloat(formData["Saldo en pesos BR (BDA)"]) || 0;
  const cnu = parseFloat(formData["CNU"]) || 0;
  const tasaInteres = parseFloat(formData["Tasa interés pensión"]) || 0;

  // Evitar división por cero
  if (ufHoy === 0) return resultado;

  // 1. Saldo en UF CCICO
  const saldoUfCCICO = ((saldo1 * vc1) + (saldo2 * vc2)) / ufHoy;
  if (!isNaN(saldoUfCCICO)) {
    resultado["Saldo en UF CCICO"] = saldoUfCCICO.toFixed(2);
  }

  // 2. Saldo en UF BR
  const saldoUfBR = saldoCuotasBR / ufHoy;
  if (!isNaN(saldoUfBR)) {
    resultado["Saldo en UF BR"] = saldoUfBR.toFixed(2);
  }

  // 3. Saldo total en UF BR + CCICO
  const totalUf = saldoUfCCICO + saldoUfBR;
  if (!isNaN(totalUf)) {
    resultado["Saldo total en UF BR + CCICO"] = totalUf.toFixed(2);
  }

  // 4. CNU x 12
  const cnuX12 = cnu * 12;
  if (!isNaN(cnuX12)) {
    resultado["CNU x 12"] = cnuX12.toFixed(2);
  }

  // 5. Saldo para PAFE (menos mortuoria)
  const saldoPafe = totalUf - cnuX12;
  if (!isNaN(saldoPafe)) {
    resultado["Saldo para PAFE (menos mortuoria)"] = saldoPafe.toFixed(2);
  }

  // 6. PAFE en UF
  const pafeUF = saldoPafe * tasaInteres;
  if (!isNaN(pafeUF)) {
    resultado["PAFE en UF"] = pafeUF.toFixed(2);
  }

  // 7. PAFE en pesos
  const pafePesos = pafeUF * ufHoy;
  if (!isNaN(pafePesos)) {
    resultado["PAFE en $"] = pafePesos.toFixed(0);
  }

  return resultado;
}
