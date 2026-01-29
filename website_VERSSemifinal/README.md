# ZAra - Website de venda online

Projeto academico com HTML, CSS e JavaScript puros. O objetivo e praticar
estrutura de paginas, layout responsivo e validacoes de formularios com um
layout moderno e organizado.

## O que tem no projeto
- 3 categorias com 9 produtos (3 por categoria).
- Zona de compras com carrinho e compra simulada.
- Formulario de contacto com validacao e feedback.
- FAQ, Testemunhos, Politica de Privacidade e Termos.
- Layout responsivo para desktop (1280px) e telemovel (440px).

## Estrutura de pastas
- `index.html`: estrutura do site e secoes.
- `components/`: blocos HTML menores carregados via JavaScript.
- `css/`: estilos separados por responsabilidade.
- `js/`: scripts divididos por modulos (carrinho, validacao, menu, etc).
- `js/utils/`: funcoes utilitarias partilhadas.

## Como rodar
1. Use um servidor estatico local com Node.js (necessario para carregar componentes):

```bash
npx serve .
```

Depois aceda a `http://localhost:3000/website_paulo/`.

## Observacoes
- Este projeto nao usa back-end. A compra e o contacto sao simulacoes
  educacionais.
- Os comentarios no codigo explicam o que cada parte faz.
