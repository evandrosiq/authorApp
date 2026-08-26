import { describe, expect, it } from 'vitest'

// Smoke test da infraestrutura de teste (jsdom + jest-dom + localStorage).
// Garante que o gate de testes está de fato executando algo.
describe('ambiente de teste', () => {
  it('expõe o DOM via jsdom', () => {
    const el = document.createElement('div')
    el.textContent = 'ok'
    document.body.appendChild(el)

    expect(el).toBeInTheDocument()
  })

  it('expõe localStorage e o limpa entre os testes', () => {
    expect(localStorage.getItem('items')).toBeNull()
    localStorage.setItem('items', '[]')

    expect(localStorage.getItem('items')).toBe('[]')
  })
})
