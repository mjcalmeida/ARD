SELECT ev.nomeEvento,
    tl.antesDepois,
    tl.quantidade,
	tl.unidade,
	tl.acao,
    em.Titulo
FROM ard.Timeline tl
inner join eventos ev on ev.id = tl.eventoId
inner join emails  em on em.id = tl.emailId
