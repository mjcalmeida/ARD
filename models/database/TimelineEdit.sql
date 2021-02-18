Select nomeEvento, antesDepois, quantidade, unidade, acao, tl.emailId, titulo, body, grupoId, pessoaId, periodicidade,
dataProximoEvento
From Timeline tl 
inner join emails em on tl.emailId = em.id
inner join TimeLineDestinatarios tld on tl.eventoId = tld.eventoId and tld.emailId = tl.emailId
inner join eventos ev on tl.eventoId = ev.id
where tl.id=1
