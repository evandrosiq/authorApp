# Specs

Uma spec por feature, criada por `/especificar <feature>` e nomeada
`SPEC-NNN-<slug>.md`. Cada uma carrega regras de negócio numeradas (RN-XX),
critérios de aceite testáveis, casos-limite e — depois de `/planejar` — o plano
em tasks com a matriz de rastreabilidade RN→task.

Layout **flat** neste projeto (um domínio só: autores/obras). Se surgirem domínios
independentes com volume grande de specs, aí sim agrupe em `specs/<domínio>/` e
passe a preencher a coluna "Domínio" no `STATUS.md`.

Regra descoberta durante a implementação volta para a spec **antes** de virar código.
