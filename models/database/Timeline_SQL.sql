SELECT ev.nomeEvento,
if(tl.unidade = "Dias", 
	if(tl.antesDepois = "-",
       date_sub(ev.dataProximoEvento, interval tl.quantidade day),
       date_add(ev.dataProximoEvento, interval tl.quantidade day)),
if(tl.unidade = "Meses", 
	if(tl.antesDepois = "-",
       date_sub(ev.dataProximoEvento, interval tl.quantidade month),
       date_add(ev.dataProximoEvento, interval tl.quantidade month)),
if(tl.unidade = "Anos", 
	if(tl.antesDepois = "-",
       date_sub(ev.dataProximoEvento, interval tl.quantidade day),
       date_add(ev.dataProximoEvento, interval tl.quantidade day)), 
       "Erro")
)) dataEmissao,
tl.acao,
em.titulo,
nmPessoa,
emailPessoa  
FROM ard.Timeline tl
inner join eventos ev on ev.id = tl.eventoId
inner join emails  em on em.id = tl.emailId
inner join TimeLineDestinatarios td on em.id = td.emailId
inner join pessoas pe on pe.id = td.pessoaId 
 where pe.id in (
 Select id
    from pessoas 
    where (grupoId in (Select grupoId from TimeLineDestinatarios where grupoId = 3) 
    or    id in (Select pessoaId from TimeLineDestinatarios where grupoId = 2))
    and   receberEmails = true
    and   Ativo = true);
    