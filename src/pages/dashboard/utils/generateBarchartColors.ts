function interpolarCor(start: string, end: string, fator: number): string {
  const s = parseInt(start.slice(1), 16)
  const e = parseInt(end.slice(1), 16)

  const sr = (s >> 16) & 0xff
  const sg = (s >> 8) & 0xff
  const sb = s & 0xff

  const er = (e >> 16) & 0xff
  const eg = (e >> 8) & 0xff
  const eb = e & 0xff

  const r = Math.round(sr + fator * (er - sr))
  const g = Math.round(sg + fator * (eg - sg))
  const b = Math.round(sb + fator * (eb - sb))

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function gerarCores(qtd: number): string[] {
  const cores = []
  for (let i = 0; i < qtd; i++) {
    cores.push(interpolarCor('#800000', '#006400', i / (qtd - 1)))
  }
  return cores
}
